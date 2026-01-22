type Locale = 'en' | 'ru'
type MessagePath = keyof typeof import('../locales/en.json')

namespace FormatjsIntl {
  interface IntlConfig {
    locale: Locale
  }
  interface Message {
    ids: MessagePath
  }
}
