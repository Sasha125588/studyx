import 'server-only'

import type enMessage from '../../../../../locales/en.json'

type Message = typeof enMessage

const dictionaries = {
	en: () => import('../../../../../locales/en.json').then(module => module.default),
	uk: () => import('../../../../../locales/uk.json').then(module => module.default)
} as unknown as Record<string, () => Promise<Message>>

export const getDictionary = async (locale: Locale) => dictionaries[locale]!()
