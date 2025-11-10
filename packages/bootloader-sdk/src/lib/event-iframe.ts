export function emit(iframeRef: HTMLIFrameElement, eventType: string, payload: any) {
  iframeRef.contentWindow?.postMessage({
    type: 'event',
    eventType,
    payload,
  }, import.meta.env.VITE_IFRAME_SRC ?? 'http://localhost:5174');
}
