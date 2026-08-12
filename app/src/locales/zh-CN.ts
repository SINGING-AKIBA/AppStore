import type { LocaleMessages } from 'vue-i18n'

const locale: LocaleMessages<typeof import('vue-i18n').messages> = {
  'index': {
    // 微信浏览器引导浮层
    'wxGuide': {
      'back': '‹ 返回',
      'clickMore': '点击"···"',
      'step1': '点击右上角"···"',
      'step2': '选择"在浏览器打开"',
      'step3': '正常下载应用',
      'gotIt': '我知道了',
    },
    // 区块标题
    'preview': '预览',
    'description': '简介',
    'collapse': '收起',
    'expand': '展开',
    'info': '信息',
    // 版本
    'version': '版本',
    // 页脚
    'footer': {
      'copyright': '© {year} {company} 版权所有。',
    },
    // 页脚链接
    'link': {
      'privacy': '隐私政策',
      'terms': '服务条款',
      'support': '联系我们',
    },
    // 信息列表标签
    'infoLabel': {
      'category': '分类',
      'compatibility': '兼容性',
      'languages': '语言',
      'ageRating': '年龄分级',
      'copyright': '版权',
    },
    // 平台
    'platform': {
      'cross': '跨平台',
    },
    // 下载按钮
    'btn': {
      'caption': {
        'ios': 'iOS 版本',
        'android': 'Android 版本',
        'default': '下载应用',
      },
      'title': {
        'download': '下载',
        'unavailable': '暂不可用',
      },
    },
    // Toast 提示
    'toast': {
      'unavailableIos': 'iOS 版本暂未上线',
      'unavailableAndroid': 'Android 版本暂未上线',
      'linkError': '无法打开链接',
      'redirecting': '正在跳转',
      'emptyData': '暂无数据',
    },
  },
}

export default locale