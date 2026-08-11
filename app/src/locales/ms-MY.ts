import type { LocaleMessages } from 'vue-i18n'

const locale: LocaleMessages<typeof import('vue-i18n').messages> = {
  'index': {
    // Panduan overlai penyemak imbas WeChat
    'wxGuide': {
      'back': '‹ Kembali',
      'clickMore': 'Klik "···"',
      'step1': 'Klik "···" di sudut kanan atas',
      'step2': 'Pilih "Buka dalam Penyemak Imbas"',
      'step3': 'Muat turun aplikasi seperti biasa',
      'gotIt': 'Saya faham',
    },
    // Tajuk bahagian
    'preview': 'Pratonton',
    'description': 'Penerangan',
    'collapse': 'Tutup',
    'expand': 'Kembangkan',
    'info': 'Maklumat',
    // Versi
    'version': 'Versi',
    // Pengaki
    'footer': {
      'copyright': '© {year} {company}. Hak cipta terpelihara.',
    },
    // Pautan pengaki
    'link': {
      'privacy': 'Dasar Privasi',
      'terms': 'Syarat Perkhidmatan',
      'support': 'Hubungi Kami',
    },
    // Label senarai maklumat
    'infoLabel': {
      'category': 'Kategori',
      'compatibility': 'Keserasian',
      'languages': 'Bahasa',
      'ageRating': 'Penarafan Umur',
      'copyright': 'Hak Cipta',
    },
    // Platform
    'platform': {
      'cross': 'Pelbagai Platform',
    },
    // Butang muat turun
    'btn': {
      'caption': {
        'ios': 'Versi iOS',
        'android': 'Versi Android',
        'default': 'Muat Turun Aplikasi',
      },
      'title': {
        'download': 'Muat Turun',
        'unavailable': 'Belum Tersedia',
      },
    },
    // Mesej Toast
    'toast': {
      'unavailableIos': 'Versi iOS belum tersedia',
      'unavailableAndroid': 'Versi Android belum tersedia',
      'linkError': 'Tidak dapat membuka pautan',
      'redirecting': 'Sedang dialihkan',
      'emptyData': 'Tiada data',
    },
  },
}

export default locale