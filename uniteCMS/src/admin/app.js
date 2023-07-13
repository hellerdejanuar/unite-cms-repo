
const lightThemeCustomColors = {
  alternative100: "#F3A5B3",
  alternative200: "#EF8195",
  alternative500: "#EA5D76",
  alternative600: "#E84A67",
  alternative700: "#E32649",
  buttonNeutral0: '#ffffff',
  buttonPrimary600: "#E53757",
  buttonPrimary500: "#E84A67",
  danger100: '#fcecea',
  danger200: '#f5c0b8',
  danger500: '#ee5e52',
  danger600: '#d02b20',
  danger700: '#b72b1a',
  neutral0: '#ffffff',
  neutral100: '#f6f6f9',
  neutral1000: '#222018',
  neutral150: '#F6F5F3',
  neutral200: '#E4E0DC',
  neutral300: '#CAC1BA',
  neutral400: '#B8ADA3',
  neutral500: '#90857a',
  neutral600: '#7a7066',
  neutral700: '#524B45',
  neutral800: '#2d2925',
  neutral900: '#161412',
  primary100: '#FBDAB1',
  primary200: '#F8BE77',
  primary500: '#F6AB51',
  primary600: '#F39016',
  primary700: '#E9850C',
  secondary100: '#F3A5B3',
  secondary200: '#EF8195',
  secondary500: '#EA5D76',
  secondary600: '#E84A67',
  secondary700: '#E32649',
  success100: '#eafbe7',
  success200: '#c6f0c2',
  success500: '#5cb176',
  success600: '#328048',
  success700: '#2f6846',
  warning100: '#fdf4dc',
  warning200: '#fae7b9',
  warning500: '#f29d41',
  warning600: '#d9822f',
  warning700: '#be5d01',
}

const darkThemeCustomColors = {
  alternative100: "#E32649",
  alternative200: "#E84A67",
  alternative500: "#EA5D76",
  alternative600: "#EF8195",
  alternative700: "#F3A5B3",
  buttonNeutral0: '#000000',
  buttonPrimary600: "#E84A67",
  buttonPrimary500: "#E53757",
  danger100: '#b72b1a',
  danger200: '#d02b20',
  danger500: '#ee5e52',
  danger600: '#f5c0b8',
  danger700: '#fcecea',
  neutral0: '#222018',
  neutral100: '#161412',
  neutral1000: '#ffffff',
  neutral150: '#2d2925',
  neutral200: '#524B45',
  neutral300: '#7a7066',
  neutral400: '#B8ADA3',
  neutral500: '#90857a',
  neutral600: '#CAC1BA',
  neutral700: '#E4E0DC',
  neutral800: '#F6F5F3',
  neutral900: '#f6f6f9',
  primary100: '#E9850C',
  primary200: '#F39016',
  primary500: '#F6AB51',
  primary600: '#F8BE77', // error displaying this color over card 
  primary700: '#FBDAB1',
  secondary100: '#E32649',
  secondary200: '#E84A67',
  secondary500: '#EA5D76',
  secondary600: '#EF8195',
  secondary700: '#F3A5B3',
  success100: '#eafbe7',
  success200: '#c6f0c2',
  success500: '#5cb176',
  success600: '#328048',
  success700: '#2f6846',
  warning100: '#fdf4dc',
  warning200: '#fae7b9',
  warning500: '#f29d41',
  warning600: '#d9822f',
  warning700: '#be5d01',
}


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