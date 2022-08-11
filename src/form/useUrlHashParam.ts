import { parse, stringify } from 'query-string'

export function useUrlHashParam() {
  const res = parse(location.hash, {
    arrayFormat: 'comma',
    parseNumbers: true,
    parseBooleans: true,
  }) as Record<string, unknown>

  Object.keys(res).forEach((key) => {
    if (
      key in
      ['collections', 'modules', 'resourceModules', 'languageModules', 'mods']
    ) {
      res[key] = new Array(res[key])
    }
  })

  return res as never as UrlHashParam
}

export function generateUrlHashParam(params: Record<string, never>) {
  return `${location.href}#${stringify(params, {
    arrayFormat: 'comma',
    encode: false,
  })}`
}

export interface UrlHashParam {
  v?: number
  edition?: 'java' | 'bedrock'
  collections?: string[]
  modules?: string[]
  resourceModules?: string[]
  languageModules?: string[]
  extType?: 'zip' | 'mcpack'
  compatible?: boolean
  sfw?: 1 | 2 | 3
  gameVersion?: number
  mods?: string[]
}
