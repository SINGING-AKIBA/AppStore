import antDesign from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn'
const modules = import.meta.glob('./*.js', { eager: true })
const locales = Object.entries(modules).reduce((acc, [key, mod]) => {
    if (key === './index.js') return acc
    return { ...acc, ...mod.default }
}, {})
export default {
    ...locales,
    antDesign,
    momentKey:'zh-cn',
}