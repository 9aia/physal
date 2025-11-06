console.log("Theme toggle plugin App.tsx loaded");

import { createEffect, createSignal } from 'solid-js';
import { createPlugin } from 'plugin-sdk';

export const [theme, setTheme] = createSignal<'dark' | 'light'>('light');

const plugin = createPlugin({ namespace: 'theme-toggle', parentOrigin: 'http://localhost:5173' });

plugin.handle('getTheme', () => {
  return theme();
});

plugin.handle('setTheme', (theme: 'dark' | 'light') => {
  setTheme(theme);
});

function App() {
  createEffect(() => {
    plugin.emit('onThemeChange', theme());
  });

  return (
    <div class="flex flex-col items-center justify-center h-screen gap-4 bg-yellow-500/20">
      <h1 class="text-2xl font-bold">
        Theme: {theme()}
      </h1>
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setTheme(theme() === 'light' ? 'dark' : 'light')}
      >
        Toggle Theme
      </button>
    </div>
  );
}

export default App
