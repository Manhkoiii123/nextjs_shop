import { AbilityBuilder, Ability } from '@casl/ability'

export type Subjects = string
export type Actions = 'manage' | 'create' | 'read' | 'update' | 'delete'

export type AppAbility = Ability<[Actions, Subjects]> | undefined

export const AppAbility = Ability as any
export type ACLObj = {
  action: Actions
  subject: string
}

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (permission: string[], subject: string) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  if (permission.includes('ADMIN.GRANTED')) {
    can('manage', 'all')
  }

  return rules
}
//dùng để trả veef 1 instance của appAplity dựa vào per và subject đã cung cấp cho nó
// sau đó dựa vào defineRulesFor để tạo quyền cho nó
//nếu là can thì là có quyền còn cannot là ko có quyền
export const buildAbilityFor = (permission: string[], subject: string): AppAbility => {
  return new AppAbility(defineRulesFor(permission, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object!.type
  })
}

export const defaultACLObj: ACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
