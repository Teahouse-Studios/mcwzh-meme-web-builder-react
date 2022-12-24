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

export interface BuildLog {
  status: 'error' | 'success'
  log: string
  platform: 'java' | 'bedrock'
  downloadUrl?: string
  time: number
  expanded: boolean
}
