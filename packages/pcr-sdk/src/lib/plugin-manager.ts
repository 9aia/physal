import { toposortReverse } from "@n1ru4l/toposort";

  // const loadPlugins = () => {
  //   import('../../../plugins/hello-world/src/index').then((module) => {
  //     console.log('Hello world plugin loaded');
  //   })
  // }

function loadPlugins(plugins: PluginToInstall[]) {

  // Load plugins in dependency order
  const sortedPlugins = toposortReverse(deps);

  for(const plugin of plugins) {
    import(plugin.url).then((module) => {
      console.log('Plugin loaded', plugin.name);
    });
  }
}

// import { toposortReverse } from "@n1ru4l/toposort";
// import type { LoadedPlugin, PluginToInstall } from "../types";
// import type { PluginManifest } from "shared-sdk";

// export interface LoadPluginsOptions {
//   onLoadPluginJson?: (pluginJson: PluginManifest) => void;
//   onLoadPlugin?: (plugin: LoadedPlugin) => void;
// }

// const loadPlugins = async (pluginsToInstall: PluginToInstall[], options?: LoadPluginsOptions) => {
//   const deps = new Map<string, Set<string>>();

//   // Loaded plugin.json files
//   const loadedPluginJsons = new Map<string, PluginManifest & { url: string }>();

//   for await (const plugin of pluginsToInstall) {
//     const res = await fetch(`${plugin.url}/plugin.json`);
//     const pluginJson = await res.json();
//     loadedPluginJsons.set(pluginJson.name, { ...pluginJson, url: plugin.url });

//     const depNames = Object.keys(pluginJson.dependencies || {});
//     deps.set(pluginJson.name, new Set(depNames));

//     options?.onLoadPluginJson?.(pluginJson);
//   }

//   // Load plugins in dependency order
//   const sortedPlugins = toposortReverse(deps);
  
//   for (const task of sortedPlugins) {
//     const pluginsToLoad = task

//     for (const pluginToLoad of pluginsToLoad) {
//       const pluginJson = loadedPluginJsons.get(pluginToLoad);
//       if (!pluginJson) {
//         continue;
//       }
//       const { url, ...json } = pluginJson;

//       const plugin: LoadedPlugin = {
//         name: pluginJson.name,
//         url: pluginJson.url,
//         json,
//       };

//       options?.onLoadPlugin?.(plugin);
//     }
//   }

//   return { deps, loadedPluginJsons, sortedPlugins }
// }

