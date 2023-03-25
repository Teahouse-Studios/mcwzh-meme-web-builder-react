// This exports an fake API data on purpose to give the form a state to work with when the real API data is still loading.
// The last modified date is purposefully to be at 1919-08-10 11:45:14 UTC+8 (UNIX timestamp: 1566235054)

import type { MemeApi } from './types'

const fakeApiData = JSON.parse(
  '{"mods":["mods/Computronics.json","mods/adorn.json","mods/anc.json","mods/blockus.json","mods/buildcraft.json","mods/cloth-config2.json"],"enmods":["en-mods/betternether.json"],"je_modules":{"resource":[{"name":"bugjump","type":"resource","description":"1","author":["1"],"directory":"1"},{"name":"linus_minecraft_craps","type":"resource","description":"1","author":["Zh9c418"],"directory":"1"},{"name":"locusazzurro","type":"resource","description":"1","author":["1"],"directory":"LocusAzzurro"},{"name":"a_letter","type":"resource","description":"1","author":["1"],"directory":"1"},{"name":"a_piece_of_seriousness","type":"resource","description":"1","author":["1"],"directory":"1"}],"collection":[{"name":"choice_modules_default","type":"collection","description":"1","author":["1"],"contains":["a_piece_of_seriousness"],"directory":"1"}]},"je_modified":-1590354886000}',
) as MemeApi // use JSON.parse for better performance

export default fakeApiData
