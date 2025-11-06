import { toposortReverse } from "@n1ru4l/toposort";
import type { LoadedPlugin, PluginToInstall } from "../types";
import type { PluginJson } from "shared-sdk";

export interface LoadPluginsOptions {
  onLoadPluginJson?: (pluginJson: PluginJson) => void;
  onLoadPlugin?: (plugin: LoadedPlugin) => void;
}

const loadPlugins = async (pluginsToInstall: PluginToInstall[], options?: LoadPluginsOptions) => {
  const deps = new Map<string, Set<string>>();

  // Loaded plugin.json files
  const loadedPluginJsons = new Map<string, PluginJson & { url: string }>();

  for await (const plugin of pluginsToInstall) {
    const res = await fetch(`${plugin.url}/plugin.json`);
    const pluginJson = await res.json();
    loadedPluginJsons.set(pluginJson.name, { ...pluginJson, url: plugin.url });

    const depNames = Object.keys(pluginJson.dependencies || {});
    deps.set(pluginJson.name, new Set(depNames));

    options?.onLoadPluginJson?.(pluginJson);
  }

  // Load plugins in dependency order
  const sortedPlugins = toposortReverse(deps);
  
  for (const task of sortedPlugins) {
    const pluginsToLoad = task

    for (const pluginToLoad of pluginsToLoad) {
      const pluginJson = loadedPluginJsons.get(pluginToLoad);
      if (!pluginJson) {
        continue;
      }
      const { url, ...json } = pluginJson;

      const iframe = document.createElement('iframe');
      iframe.src = pluginJson.url;
      iframe.id = `iframe-plugin-${pluginJson.name}`;
      iframe.style.backgroundColor = 'transparent';
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.sandbox.add('allow-scripts');
      iframe.sandbox.add('allow-same-origin'); // TODO: remove this on production

      const plugin: LoadedPlugin = {
        name: pluginJson.name,
        url: pluginJson.url,
        json,
        iframe,
      };

      options?.onLoadPlugin?.(plugin);
    }
  }

  return { deps, loadedPluginJsons, sortedPlugins }
}

export { loadPlugins };
