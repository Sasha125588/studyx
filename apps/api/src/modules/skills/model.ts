import { Elysia, t } from 'elysia'

const Skill = t.Object({
	id: t.Number(),
	name: t.Nullable(t.String()),
	slug: t.Nullable(t.String()),
	created_at: t.String()
})

export const SkillModel = new Elysia({ name: 'Model.Skill' }).model({
	'skill.base': Skill,
	'skill.params.id': t.Object({
		id: t.Numeric()
	}),
	'skill.params.slug': t.Object({
		slug: t.String()
	})
})

export type SkillType = typeof Skill.static
