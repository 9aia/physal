/* @refresh reload */
console.log("App Plugin System index.tsx loaded");

import type { PluginToInstall } from 'shared-sdk';
import { loadPlugins } from 'p'cr-sdk';
import './index.css'
import { pcr } from './pcr';

pcr.on('runtimeReady', ({ plugins }: { plugins: PluginToInstall[] }) => {
  pcr.logger.info('Runtime ready', plugins);
  loadPlugins(plugins);
})
