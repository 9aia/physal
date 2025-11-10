import { MaybePromise } from "./lib/ts";

export type PluginManifest = {
  name: string;
  version?: string;
  description?: string;
  author?: string;
  license?: string;
  dependencies?: Record<string, string>;
}

export type PluginToInstall = {
  name: string;
  version: string;
}

// --- Core Message & Handler Types ---

export interface RequestMessage {
  type: 'request';
  id: string;
  requestType: string;
  payload?: any;
}

export interface ResponseMessage {
  type: 'response';
  id: string;
  payload?: any;
  error?: string;
}

export interface EventMessage {
  type: 'event';
  eventType: string;
  payload?: any;
  namespace?: string;
}

export type SdkMessage = RequestMessage | ResponseMessage | EventMessage;

// A handler function can be sync or async
export type HandlerFn = (payload?: any) => MaybePromise<any>;

// An event handler function
export type ListenerFn = (payload?: any) => void;

// For tracking pending requests that expect a response
export interface PendingRequest {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

export interface Logger {
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
  debug: (...args: any[]) => void;
}
