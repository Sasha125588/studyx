'use client'

import { GlobeIcon } from 'lucide-react'

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@/components/animate-ui/radix/dropdown-menu'
import { Button } from '@/components/ui/button'

import { setLocale } from '@/shared/helpers/i18n/setLocale'
import { useI18n } from '@/shared/providers/i18n/useI18n'

const languages = [
	{ code: 'en', label: 'EN', name: 'English' },
	{ code: 'uk', label: 'UA', name: 'Українська' }
]

export const LanguageSwitcher = () => {
	const i18n = useI18n()
	const locale = i18n.locale ?? 'en'
	const currentLanguage = languages.find(l => l.code === locale)?.label ?? locale.toUpperCase()

	const handleChange = (lang: string) => {
		if (lang !== locale) {
			setLocale(lang)
		}
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='relative cursor-pointer'
				>
					<GlobeIcon size={18} />
					<span className='bg-primary text-primary-foreground absolute -right-0.5 -bottom-0.5 flex size-4 items-center justify-center rounded-full text-[9px] font-semibold'>
						{currentLanguage}
					</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				{languages.map(lang => (
					<DropdownMenuItem
						key={lang.code}
						onClick={() => handleChange(lang.code)}
						disabled={lang.code === locale}
						className='cursor-pointer gap-3'
					>
						<span className='font-medium'>{lang.label}</span>
						<span className='text-muted-foreground text-xs'>{lang.name}</span>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
