import { type LoadedPlugin } from "app-sdk";
import { createSignal, For, onCleanup, onMount, Show } from "solid-js";

function PluginFrame(props: { plugin: LoadedPlugin }) {
  const [loaded, setLoaded] = createSignal(false);

  const handleLoad = () => {
    setLoaded(true);
  }

  onMount(() => {
    const iframe = props.plugin.iframe;
    
    iframe.addEventListener('load', handleLoad);
  })

  onCleanup(() => {
    const iframe = props.plugin.iframe;
    iframe.removeEventListener('load', handleLoad);
  })

  return (
    <div class="relative h-full">
      <Show when={!loaded()}>
        <div>Loading...</div>
      </Show>
      
      <div classList={{ 'hidden': !loaded() }} class="z-0 h-128">
        {props.plugin.iframe}
      </div>
    </div>
  );
}

function PluginFrames(props: { plugins: LoadedPlugin[] }) {
  return (
    <div class="flex flex-col gap-4 border p-4 h-full">
      <h3 class="text-lg font-bold">Plugin Frames</h3>

      <For each={props.plugins}>
        {(plugin) => (
           <div class="relative w-full h-full border-2 border-gray-300 rounded-md">
           <PluginFrame plugin={plugin} />
         </div>
        )}
      </For>
    </div>
  );
}

export { PluginFrames };
