'use client'

import { memo } from 'react'
import { FormattedMessage } from 'react-intl'

interface I18nTextProps {
	path: LocaleMessageId
	values?: Record<string, string>
}

export const I18nText = memo(({ path, values }: I18nTextProps) => (
	<FormattedMessage
		id={path}
		values={values}
	/>
))

I18nText.displayName = 'I18nText'
