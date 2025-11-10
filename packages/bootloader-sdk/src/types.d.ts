export interface Bootloader {
  /** Registers a handler for the app itself. */
  handle: (requestType: string, handler: HandlerFn) => void;
  /** Sends a request to a plugin. */
  request: <T = any>(requestType: string, payload?: any) => Promise<T>;
  /** Registers an event listener for events from plugins. */
  on: (eventType: string, listener: ListenerFn) => void;
  /** Removes an event listener. */
  off: (eventType: string, listener: ListenerFn) => void;
  /** Removes the message listener. */
  destroy: () => void;

  logger: Logger;
}

// export type PluginToInstall = {
//   name: string;
//   version: string;
// }

// export type LoadedPlugin = {
//   name: string;
//   json: PluginJson;
// }

// export interface PluginRegistration {
//   window: Window;
//   origin: string;
// }

// export interface RegisteredPluginContext {
//   emit: (eventType: string, payload?: any) => void;
// }
