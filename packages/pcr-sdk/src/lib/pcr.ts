import type { ListenerFn, SdkMessage } from 'shared-sdk';

export type CPR = {
  on: (eventType: string, listener: ListenerFn) => void;
  off: (eventType: string, listener: ListenerFn) => void;
  destroy: () => void;
  logger: {
    info: (...args: any[]) => void;
    error: (...args: any[]) => void;
    warn: (...args: any[]) => void;
    debug: (...args: any[]) => void;
  };
}

export function createCPR(): CPR {
  const eventListeners = new Map<string, Set<ListenerFn>>();

  const logger = {
    info: (...args: any[]) => {
      console.log(`[pcr]`, ...args);
    },
    error: (...args: any[]) => {
      console.error(`[pcr]`, ...args);
    },
    warn: (...args: any[]) => {
      console.warn(`[pcr]`, ...args);
    },
    debug: (...args: any[]) => {
      console.debug(`[pcr]`, ...args);
    },
  };

  const messageListener = (event: MessageEvent<SdkMessage>) => {
    // Only accept messages from the parent window (the app)
    if (event.source !== window.parent) return;

    const { data: msg } = event;
    if (!msg || !msg.type) return;

    // Only handle events from the app
    if (msg.type === 'event' && msg.eventType) {
      const { eventType, payload } = msg;
      const listeners = eventListeners.get(eventType);
      
      logger.debug('Handling event', eventType, payload);
      
      if (listeners) {
        listeners.forEach(listener => {
          try {
            listener(payload);
          } catch (err: any) {
            logger.error(`Error in event handler for ${eventType}:`, err);
          }
        });
      }
    }
  };

  window.addEventListener('message', messageListener);

  const on = (eventType: string, listener: ListenerFn) => {
    if (!eventListeners.has(eventType)) {
      eventListeners.set(eventType, new Set());
    }
    eventListeners.get(eventType)!.add(listener);
  };

  const off = (eventType: string, listener: ListenerFn) => {
    const listeners = eventListeners.get(eventType);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        eventListeners.delete(eventType);
      }
    }
  };

  const destroy = () => {
    window.removeEventListener('message', messageListener);
  };

  return {
    on,
    off,
    destroy,
    logger,
  }
}
