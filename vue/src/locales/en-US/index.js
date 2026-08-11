import antDesign from 'ant-design-vue/es/locale/en_US';
import 'dayjs/locale/en'
const modules = import.meta.glob('./*.js', { eager: true })
const locales = Object.entries(modules).reduce((acc, [key, mod]) => {
    if (key === './index.js') return acc
    return { ...acc, ...mod.default }
}, {})
export default {
    ...locales,
    antDesign,
    momentKey:'en',
}