import { createSSRApp } from "vue";
import App from "./App.vue";
import { bootstrap } from "@/smile/bootstrap";
import i18n from "@/locales";
import mixin from "@/utils/share";
export function createApp() {
  const app = createSSRApp(App);
  bootstrap(app)
  app.use(i18n)
  return {
    app,
  };
}