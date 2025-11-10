import { HandlerFn, ListenerFn, Logger, PluginManifest } from 'shared-sdk';

interface PluginConfig {
  /** The unique namespace for this plugin. */
  namespace: string;
  /** The exact origin of the parent. */
  parentOrigin: string;
  /** Optional plugin.json metadata for container registration */
  manifest?: PluginManifest;
}

export interface PluginSDK {
  /** Registers a handler for an action within this plugin's namespace. */
  handle: (action: string, handler: HandlerFn) => void;
  /** Sends a request to the bootloader or another plugin. */
  request: <T = any>(requestType: string, payload?: any) => Promise<T>;
  /** Emits an event to the bootloader. */
  emit: (eventType: string, payload?: any) => void;
  /** Registers an event listener for events from the bootloader. */
  on: (eventType: string, listener: ListenerFn) => void;
  /** Removes an event listener. */
  off: (eventType: string, listener: ListenerFn) => void;
  /** Removes the message listener. */
  destroy: () => void;

  logger: Logger;
}

