import { Elysia, t } from 'elysia'

// const Skill = t.Object({
// 	id: t.Number(),
// 	name: t.Nullable(t.String()),
// 	slug: t.Nullable(t.String()),
// 	created_at: t.String()
// })

export const SkillModel = new Elysia({ name: 'Model.Skill' }).model({
	'skill.params.id': t.Object({
		id: t.Numeric()
	})
})

// export type SkillType = typeof Skill.static
