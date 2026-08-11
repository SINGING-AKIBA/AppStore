import type { LocaleMessages } from 'vue-i18n'

const locale: LocaleMessages<typeof import('vue-i18n').messages> = {
  'index': {
    // WeChat browser guide overlay
    'wxGuide': {
      'back': '‹ Back',
      'clickMore': 'Tap "···"',
      'step1': 'Tap "···" at top right',
      'step2': 'Select "Open in Browser"',
      'step3': 'Download the app normally',
      'gotIt': 'Got it',
    },
    // Section titles
    'preview': 'Preview',
    'description': 'Description',
    'collapse': 'Collapse',
    'expand': 'Expand',
    'info': 'Info',
    // Version
    'version': 'Version',
    // Footer
    'footer': {
      'copyright': '© {year} {company}. All rights reserved.',
    },
    // Footer links
    'link': {
      'privacy': 'Privacy Policy',
      'terms': 'Terms of Service',
      'support': 'Contact Us',
    },
    // Info list labels
    'infoLabel': {
      'category': 'Category',
      'compatibility': 'Compatibility',
      'languages': 'Languages',
      'ageRating': 'Age Rating',
      'copyright': 'Copyright',
    },
    // Platform
    'platform': {
      'cross': 'Cross-platform',
    },
    // Download button
    'btn': {
      'caption': {
        'ios': 'iOS Version',
        'android': 'Android Version',
        'default': 'Download App',
      },
      'title': {
        'download': 'Download',
        'unavailable': 'Not Available',
      },
    },
    // Toast messages
    'toast': {
      'unavailableIos': 'iOS version not available yet',
      'unavailableAndroid': 'Android version not available yet',
      'linkError': 'Unable to open link',
      'redirecting': 'Redirecting',
      'emptyData': 'No data available',
    },
  },
}

export default locale