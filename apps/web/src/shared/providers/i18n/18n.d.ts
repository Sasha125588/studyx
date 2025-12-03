type LocaleMessageId = keyof typeof import('../../../../locales/en.json')
type Locale = 'en'

declare global {
	namespace FormatjsItnl {
		interface IntlConfig {
			locale: Locale
		}

		interface Messages {
			ids: LocaleMessageId
		}
	}
}
