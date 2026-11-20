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
    'detailTitle': 'App details',
    'detailBack': 'Back',
    'ratingCount': '{count} ratings',
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
  'apps': {
    'title': 'Apps',
    'subtitle': 'Discover apps worth keeping.',
    'subtitleShort': 'Curated for you',
    'search': 'Search apps, developers or categories',
    'count': '{count} apps',
    'defaultTagline': 'A thoughtfully selected app',
    'categoryFallback': 'App',
    'emptyTitle': 'No apps available yet',
    'emptyDesc': 'There are no published apps to show right now. Please check back soon.',
    'noResultsTitle': 'No matching apps',
    'noResultsDesc': 'Try another keyword or search by app name.',
    'errorTitle': 'Could not load apps',
    'errorDesc': 'Check your connection and try again.',
    'retry': 'Try again',
    'loadingMore': 'Loading more apps…',
    'loadMore': 'Tap to load more',
    'allLoaded': 'You’re all caught up',
    'loadFailed': 'Unable to load apps. Please try again.',
    'detailUnavailable': 'This app is missing its detail identifier.',
    'navigationFailed': 'Could not open app details. Please try again.',
  },
}

export default locale