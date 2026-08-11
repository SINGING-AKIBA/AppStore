import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useUserStore } from '@/stores/user'
import App from './App.vue';
import router from './router';
import useComponent from './core/use';
import './core/bootstrap';
import 'virtual:svg-icons-register';
import i18n from './locales';
const app = createApp(App)
app.use(i18n);
app.use(createPinia());
const userStore = useUserStore();
userStore.syncStorage();
app.use(useComponent)
app.use(router)
app.mount('#app')


