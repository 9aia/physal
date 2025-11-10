import type { LoadedPlugin } from "app-sdk";
import { For } from "solid-js";

import { usePluginManager } from "app-sdk";
import type { RegisteredPluginContext } from "app-sdk";

function Devtools() {
  const pluginManager = usePluginManager();

  return (
    <div class="flex flex-col gap-4 p-4">
      <h2>Devtools</h2>

      <InstalledPlugins plugins={pluginManager.plugins()} />

      <div class="flex flex-col gap-4 border p-4 h-128">
        <h3 class="text-lg font-bold">From-app Emissions</h3>

        <div class="flex gap-x-4 space-x-4 h-full">
          <For each={pluginManager.plugins()}>
            {(plugin) => (
              <PluginFrameCard
                url={plugin.url}
                name={plugin.name}
                registeredPluginContext={pluginManager.getLoadedPluginContext(plugin.name)}
              />
            )}
          </For>
        </div>
      </div>
    </div>
  );
}

interface InstalledPluginsProps {
  plugins: LoadedPlugin[];
}

function InstalledPlugins(props: InstalledPluginsProps) {
  return (
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">Installed Plugins</h3>
      <For each={props.plugins}>
        {(plugin) => <PluginCard plugin={plugin} />}
      </For>
    </div>
  );
}

function PluginCard(props: { plugin: LoadedPlugin }) {
  const dependencies = Object.keys(props.plugin.json.dependencies || {});

  return (
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">{props.plugin.json.name} v{props.plugin.json.version}</h3>
      <p class="text-sm text-gray-500">{props.plugin.json.description}</p>
      {dependencies.length > 0 && (
        <p class="text-sm text-gray-500">Dependencies: {dependencies.join(', ')}</p>
      )}
    </div>
  );
}

function PluginCard(props: { plugin: LoadedPlugin }) {
  const dependencies = Object.keys(props.plugin.json.dependencies || {});

  return (
    <div class="flex flex-col gap-2">
      <h3 class="text-lg font-bold">{props.plugin.json.name} v{props.plugin.json.version}</h3>
      <p class="text-sm text-gray-500">{props.plugin.json.description}</p>
      {dependencies.length > 0 && (
        <p class="text-sm text-gray-500">Dependencies: {dependencies.join(', ')}</p>
      )}
    </div>
  );
}

interface PluginFrameProps {
  url: string;
  name: string;
  registeredPluginContext: RegisteredPluginContext;
}

function PluginFrameCard(props: PluginFrameProps) {
  const sendTime = () => {
    const pluginContext = props.registeredPluginContext;
    if(!pluginContext) return;

    pluginContext.emit('app.onReceiveTime', new Date().toISOString());
  }

  return (
    <div class="flex flex-col gap-2 border-2 border-gray-300 rounded-md p-4">
      <div class="flex flex-col gap-2">
        <h3 class="text-lg font-bold">{props.name}</h3>
        <p class="text-sm text-gray-500">{props.url}</p>
      </div>

      <button class="px-4 py-2 bg-green-500 text-white rounded" onClick={sendTime}>
        Send Time to {props.name}
      </button>
    </div>
  );
}

export { Devtools, InstalledPlugins, PluginCard, PluginFrameCard };
