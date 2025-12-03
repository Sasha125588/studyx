import defaultMessages from '../../../../locales/en.json' with { type: 'json' }

export type Messages = Record<LocaleMessageId, string>

export const getMessagesByLocale = (locale: string) => {
	try {
		// eslint-disable-next-line @typescript-eslint/no-require-imports
		return require(`../../../../locales/${locale}.json`) as Messages
	} catch (error: unknown) {
		console.error('Error loading messages for locale', locale, error)

		return defaultMessages
	}
}
