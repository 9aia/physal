console.log("App bootloader loaded");

import { createBootloader } from "bootloader-sdk";
import PLUGINS_INSTALLED from '../public/plugins-installed.json';
import { PCRFrame } from "./components/pcr-frame";

export const bootloader = createBootloader();

bootloader.on('randomNumberGenerated', (number: number) => {
  console.log(number)
});

function App() {
  return (
    <PCRFrame plugins={PLUGINS_INSTALLED} />
  )
}

export default App;
