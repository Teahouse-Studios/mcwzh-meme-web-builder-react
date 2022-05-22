export interface MemeApi {
  be_modified: number
  be_modules: {
    collection: MemeCollection[]
    resource: MemeResource[]
  }
  enmods: string[]
  je_modified: number
  je_modules: {
    collection: MemeCollection[]
    resource: MemeResource[]
  }
  mods: string[]
}

export interface MemeCollection {
  author: string[]
  contains: string[]
  description: string
  directory: string
  incompatible_with: string[]
  name: string
  type: string
}

export interface MemeResource {
  author: string[]
  description: string
  directory: string
  incompatible_with: string[]
  name: string
  type: string
}
