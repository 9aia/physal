import type { LoadedPlugin } from 'app-sdk';
import { loadPlugins } from 'app-sdk';
import { createSignal, onMount } from 'solid-js';
import { app } from './app';
import { Devtools } from './components/devtools/Devtools';
import { RandomNumbers } from './components/RandomNumbers';
import { PLUGINS_TO_INSTALL } from './data/plugins';
import { PluginManagerProvider } from 'app-sdk';
import { PluginFrames } from './components/devtools/PluginFrames';

function App() {
  const [plugins, setPlugins] = createSignal<LoadedPlugin[]>([]);
  
  onMount(async () => {
    await loadPlugins(PLUGINS_TO_INSTALL, {
      onLoadPluginJson: (pluginJson) => {
        app.logger.info(`${pluginJson.name} plugin.json loaded.`);
      },
      onLoadPlugin: (plugin) => {
        setPlugins(prev => [...prev, plugin]);
        app.logger.info(`${plugin.name} plugin loaded.`);

        app.registerPlugin(plugin.name, plugin.iframe.contentWindow!, plugin.url);        
      },
    });

    // TODO: emit app idle event when all plugins are loaded
    //app.emit('appIdle'); // all plugins are loaded
  });

  return (
    <PluginManagerProvider plugins={plugins}>
      <div class="flex flex-col gap-4 p-4 h-full">
        {/* TODO: add main frame? */}
        <h1>
          App (host) page
        </h1>
        <RandomNumbers />

        <PluginFrames plugins={plugins()} />
      </div>

      <Devtools />
    </PluginManagerProvider>
  )
}

export default App
