console.log("Hello world plugin App.tsx loaded");

import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import { createPlugin } from 'plugin-sdk';
import { Counter } from './components/Counter';
import pluginManifest from './plugin.manifest.json';

const queryClient = new QueryClient()

const pluginContext = createPlugin({
  namespace: 'hello-world',
  parentOrigin: 'http://localhost:5173',
  manifest: pluginManifest
});

// async function getTheme() {
//   try {
//     const response = await pluginContext.request<Theme>('theme-toggle.getTheme')
//     return response;
//   } catch (error) {
//     pluginContext.logger.error('Request failed', error);
//     return 'dark' as Theme;
//   }
// }

// function ThemedText() {
//   const themeQuery = useQuery(() => ({
//     queryKey: ['theme'],
//     queryFn: getTheme,
//   }));

//   pluginContext.on('onThemeChange', (theme: any) => {
//     queryClient.setQueryData(['theme'], theme);
//   });

//   return (
//     <>
//       <Switch>
//         <Match when={themeQuery.isLoading}>
//           <div>Loading...</div>
//         </Match>
//         <Match when={themeQuery.isError}>
//           <div>Error: {themeQuery.error?.message}</div>
//         </Match>
//         <Match when={themeQuery.data}>
//           <p
//             class="px-4 py-2 rounded text-center"
//             classList={{
//               'bg-black text-white': themeQuery.data === 'dark',
//               'bg-white text-black': themeQuery.data === 'light'
//             }}
//           >
//             Theme text: {themeQuery.data}
//           </p>
//         </Match>
//       </Switch>

//       {/* <button class="px-4 py-2 bg-blue-500 text-white rounded" onClick={() => themeQuery.refetch()}>Refetch</button> */}
//     </>
//   )
// }

// function TimeLogger() {
//   const [times, setTimes] = createSignal<string[]>([]);

//   pluginContext.on('app.onReceiveTime', (time: any) => {
//     setTimes(prev => [...prev, time]);
//   });

//   return (
//     <div class="flex flex-col items-center justify-center gap-4">
//       <h1>Times from App</h1>
      
//       <div class="flex flex-col gap-2">
//         <For each={times()}>
//           {(time) => (
//             <time class="text-sm text-gray-500">{time}</time>
//           )}
//         </For>
//       </div>
//     </div>
//   )
// }

function RandomNumberSender() {
  const sendRandomNumber = () => {
    pluginContext.emit('randomNumberGenerated', Math.random());
  };

  return (
    <button class="px-4 py-2 bg-blue-500 text-white rounded" onClick={sendRandomNumber}>
      Send Random Number to App
    </button>
  )
}

function App() {
  console.log("Hello world App component setup");

  return (
    <QueryClientProvider client={queryClient}>
      <div class="flex flex-col items-center justify-center h-full gap-4 p-4 bg-white">
        {/* <ThemedText /> */}
        <RandomNumberSender />
        <Counter />
        {/* <TimeLogger /> */}
      </div>
    </QueryClientProvider>
  );
}

export default App
