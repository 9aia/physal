/* @refresh reload */
console.log("Hello world plugin index.tsx loaded");

import { render } from 'solid-js/web'
import './index.css'
import App from './App.tsx'

const root = document.getElementById('root')

render(() => <App />, root!)
