import { z } from 'zod'

export interface MemeApi {
  be_modified: number
  be_modules: {
    collection: MemeModule[]
    resource: MemeModule[]
  }
  enmods: string[]
  je_modified: number
  je_modules: {
    collection: MemeModule[]
    resource: MemeModule[]
  }
  mods: string[]
}

export interface MemeModule {
  author: string[]
  contains?: string[]
  description: string
  directory: string
  incompatible_with?: string[]
  name: string
  type: string
}

export const schema = z.object({
  v: z.literal(1).default(1),
  platform: z.enum(['java', 'bedrock']).default('java'),
  format: z.enum(['mcpack', 'zip']).default('zip'),
  collection: z.string().array().default(['choice_modules_default']),
  resource: z.string().array().default([]),
  language: z.string().array().default([]),
  mod: z.string().array().default([]),
  gameVersion: z.number().default(18),
  compatible: z.boolean().default(false),
  sfw: z.number().default(2),
})

export type SchemaType = z.infer<typeof schema>

export interface BuildLog {
  status: 'error' | 'success'
  log: string
  platform: 'java' | 'bedrock'
  downloadUrl?: string
  time: number
  size?: number
  expanded: boolean
  share?: Partial<SchemaType>
}
