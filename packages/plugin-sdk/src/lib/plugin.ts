import type { HandlerFn, PendingRequest, RequestMessage, ResponseMessage, EventMessage, SdkMessage, ListenerFn } from 'shared-sdk';
import type { PluginConfig, PluginSDK } from '../types.d.ts';

/**
 * Creates a Plugin instance for a plugin module.
 * Automatically namespaces handlers and routes requests to the parent.
 */
export function createPlugin({ namespace, parentOrigin }: PluginConfig): PluginSDK {
    const handlers = new Map<string, HandlerFn>();
    const pendingRequests = new Map<string, PendingRequest>();
    const eventListeners = new Map<string, Set<ListenerFn>>();

    const logger = {
      info: (...args: any[]) => {
        console.log(`[plugin:${namespace}]`, ...args);
      },
      error: (...args: any[]) => {
        console.error(`[plugin:${namespace}]`, ...args);
      },
      warn: (...args: any[]) => {
        console.warn(`[plugin:${namespace}]`, ...args);
      },
      debug: (...args: any[]) => {
        console.debug(`[plugin:${namespace}]`, ...args);
      },
    };
  
    const messageListener = async (event: MessageEvent<SdkMessage>) => {
      // 1. Validate origin
      if (event.origin !== parentOrigin) return;
  
      const { data: msg, source } = event;
      if (!msg || !msg.type || !source) return;
  
      // 2. Handle an incoming REQUEST (from the parent)
      if (msg.type === 'request' && msg.id && msg.requestType) {
        const { id, requestType, payload } = msg;
  
        // Check if it's for this plugin's namespace
        if (requestType.startsWith(`${namespace}.`)) {
          const action = requestType.substring(namespace.length + 1);
          const handler = handlers.get(action);
          
          if (handler) {
            try {
              const responseData = await handler(payload);
              (source as Window).postMessage({ type: 'response', id, payload: responseData } as ResponseMessage, event.origin);
            } catch (err: any) {
              (source as Window).postMessage({ type: 'response', id, error: err.message } as ResponseMessage, event.origin);
            }
          } else {
            (source as Window).postMessage({ type: 'response', id, error: `[${namespace}] No handler for action: ${action}` } as ResponseMessage, event.origin);
          }
        }
      }
      // 3. Handle an incoming RESPONSE (from the parent)
      else if (msg.type === 'response' && msg.id) {
        const promise = pendingRequests.get(msg.id);
        if (promise) {
          if (msg.error) promise.reject(new Error(msg.error));
          else promise.resolve(msg.payload);
          pendingRequests.delete(msg.id);
        }
      }
      // 4. Handle an incoming EVENT (from the parent)
      else if (msg.type === 'event' && msg.eventType) {
        const { eventType, payload } = msg;
        const listeners = eventListeners.get(eventType);
        if (listeners) {
          listeners.forEach(listener => listener(payload));
        }
      }
    };
  
    window.addEventListener('message', messageListener);
  
    return {
      handle: (action, handler) => {
        handlers.set(action, handler);
      },
  
      request: <T = any>(requestType: string, payload?: any): Promise<T> => {
        return new Promise((resolve, reject) => {
          const requestId = crypto.randomUUID();
          pendingRequests.set(requestId, { resolve, reject });
  
          const message: RequestMessage = {
            type: 'request',
            id: requestId,
            requestType,
            payload
          };
          window.parent.postMessage(message, parentOrigin);
          
          setTimeout(() => {
            if (pendingRequests.has(requestId)) {
              reject(new Error(`[${namespace}] Request timed out for: ${requestType}`));
              pendingRequests.delete(requestId);
            }
          }, 5000);
        });
      },

      emit: (eventType: string, payload?: any) => {
        const message: EventMessage = {
          type: 'event',
          eventType,
          payload,
          namespace
        };
        window.parent.postMessage(message, parentOrigin);
      },

      on: (eventType: string, listener: ListenerFn) => {
        if (!eventListeners.has(eventType)) {
          eventListeners.set(eventType, new Set());
        }
        eventListeners.get(eventType)!.add(listener);
      },

      off: (eventType: string, listener: ListenerFn) => {
        const handlers = eventListeners.get(eventType);
        if (handlers) {
          handlers.delete(listener);
          if (handlers.size === 0) {
            eventListeners.delete(eventType);
          }
        }
      },
      
      destroy: () => {
        window.removeEventListener('message', messageListener);
      },

      logger,
    };
  }