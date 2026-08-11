import { createSSRApp } from "vue";
import App from "./App.vue";
import { bootstrap } from "@/smile/bootstrap";
import mixin from "@/utils/share";
export function createApp() {
  const app = createSSRApp(App);
  bootstrap(app)
  return {
    app,
  };
}