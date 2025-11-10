import { emit } from "bootloader-sdk";
import { type PluginToInstall } from "shared-sdk";
import { createSignal, Show } from "solid-js";

function PCRFrame(props: { plugins: PluginToInstall[] }) {
  const [loaded, setLoaded] = createSignal(false);
  let iframeRef: HTMLIFrameElement | undefined;

  const handleLoad = () => {
    setLoaded(true);

    if (iframeRef) {
      emit(iframeRef, 'runtimeReady', {
        plugins: props.plugins,
      });
    }
  }

  const handleError = () => {
    console.error('Error loading plugin');
  }

  return (
    <div class="relative h-full">
      <Show when={!loaded()}>
        <div>Loading...</div>
      </Show>
      
      <div classList={{ 'hidden': !loaded() }}>
        <iframe
          ref={iframeRef}
          src={import.meta.env.VITE_IFRAME_SRC ?? 'http://localhost:5174'}
          class="w-full h-full bg-transparent"
          allow="scripts allow-same-origin"
          onLoad={handleLoad}
          onError={handleError}
        />
      </div>
    </div>
  );
}

export { PCRFrame };
