import "./app.css";
import App from "./app.svelte";
import { mount } from "svelte";

const target = document.querySelector("#app")!;

mount(App, { target });
