import { lightThemeCustomColors } from "./themes/lightThemeCustomColors"
import { darkThemeCustomColors } from "./themes/darkThemeCustomColors"

const config = {
  locales: [
    // 'ar',
    // 'fr',
    // 'cs',
    // 'de',
    // 'dk',
    // 'es',
    // 'he',
    // 'id',
    // 'it',
    // 'ja',
    // 'ko',
    // 'ms',
    // 'nl',
    // 'no',
    // 'pl',
    // 'pt-BR',
    // 'pt',
    // 'ru',
    // 'sk',
    // 'sv',
    // 'th',
    // 'tr',
    // 'uk',
    // 'vi',
    // 'zh-Hans',
    // 'zh',
  ],
  translations: {
    en: {
      'app.components.LeftMenu.navbrand.title': 'Unite CMS'
    }
  },
  head: {
  },
  theme: {
    light: {
      colors: lightThemeCustomColors
    },
    dark: {
      colors: darkThemeCustomColors
    }
  }
}


const bootstrap = (app) => {
  console.log(app)
}

export default {
  config,
  bootstrap
}