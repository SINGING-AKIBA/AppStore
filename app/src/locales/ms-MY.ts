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
    'detailTitle': 'Butiran aplikasi',
    'detailBack': 'Kembali',
    'ratingCount': '{count} penilaian',
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
  'apps': {
    'title': 'Senarai Aplikasi',
    'subtitle': 'Temui aplikasi pilihan yang berbaloi disimpan.',
    'subtitleShort': 'Pilihan untuk anda',
    'search': 'Cari aplikasi, pembangun atau kategori',
    'count': '{count} aplikasi',
    'defaultTagline': 'Aplikasi pilihan untuk diterokai',
    'categoryFallback': 'Aplikasi',
    'emptyTitle': 'Belum ada aplikasi tersedia',
    'emptyDesc': 'Tiada aplikasi yang diterbitkan buat masa ini. Sila datang lagi nanti.',
    'noResultsTitle': 'Tiada aplikasi sepadan',
    'noResultsDesc': 'Cuba kata kunci lain atau cari menggunakan nama aplikasi.',
    'errorTitle': 'Senarai aplikasi gagal dimuatkan',
    'errorDesc': 'Semak sambungan anda dan cuba lagi.',
    'retry': 'Cuba lagi',
    'loadingMore': 'Memuatkan lebih banyak aplikasi…',
    'loadMore': 'Ketik untuk memuatkan lagi',
    'allLoaded': 'Anda sudah melihat semuanya',
    'loadFailed': 'Tidak dapat memuatkan aplikasi. Sila cuba lagi.',
  },
}

export default locale