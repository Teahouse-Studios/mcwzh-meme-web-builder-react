const fakeApiData = JSON.parse(
  '{"mods":["mods/Computronics.json","mods/adorn.json","mods/anc.json","mods/blockus.json","mods/buildcraft.json","mods/cloth-config2.json","mods/corail_woodcutter.json","mods/craftingpp.json","mods/create.json","mods/diggusmaximus.json","mods/durabilityviewer.json","mods/dynamicfps.json","mods/expandedstorage.json","mods/glassdoor.json","mods/hwyla.json","mods/illuminations.json","mods/immersive_engineering.json","mods/immersive_portals.json","mods/inventoryprofiles.json","mods/inventorysorter.json","mods/itemscroller.json","mods/ivrench.json","mods/justmap.json","mods/lightoverlay.json","mods/litematica.json","mods/minihud.json","mods/modmenu.json","mods/mousewheelie.json","mods/mycommands.json","mods/opencomputers.json","mods/optifine.lang","mods/orderly.json","mods/raa.json","mods/roughlyenoughitems.json","mods/simplevoidworld.json","mods/simplexterrain.json","mods/slimefunction.json","mods/sodium.json","mods/sweet_potato.json","mods/techreborn.json","mods/terrestria.json","mods/torcherino.json","mods/traverse.json","mods/tweakeroo.json","mods/vanilla_hammers.json","mods/voxelmap.json"],"enmods":["en-mods/betternether.json","en-mods/craftpresence.json","en-mods/extraalchemy.json","en-mods/shulkerboxtooltip.json","en-mods/tdnf.json"],"je_modules":{"resource":[{"name":"bugjump","type":"resource","description":"啥？这个公司不是叫Bugjump吗？（需要OptiFine）","author":["CR-019"],"directory":"BUGJUMP"},{"name":"linus_minecraft_craps","type":"resource","description":"加拿大某位张口闭眼科技产品免费拿的男人向您诚意推荐：lttstore.com以及其他的西方迷惑meme","author":["Zh9c418"],"incompatible_with":["famous_scene"],"directory":"Linus_Minecraft_Craps"},{"name":"locusazzurro","type":"resource","description":"鸡，蓝色，聪明，会建筑","author":["Dianliang233","LocusAzzurro","最亮的信标"],"incompatible_with":["fake_multitool"],"directory":"LocusAzzurro"},{"name":"a_letter","type":"resource","description":"一封信，也许打完龙会出现","author":["梗体中文内容组"],"incompatible_with":["a_piece_of_seriousness"],"directory":"a_letter"},{"name":"a_piece_of_seriousness","type":"resource","description":"一份取代终末之诗的文章。","author":["siiftun1857"],"incompatible_with":["a_letter"],"directory":"a_piece_of_seriousness"},{"name":"anniversary","type":"resource","description":"我们两周年啦！","author":["Lakejason0","Dianliang233"],"incompatible_with":["reverse_cake_model"],"directory":"anniversary"},{"name":"annoying_sounds","type":"resource","description":"烦人的音效","author":["Lakejason0","Neubulae"],"directory":"annoying_sounds"},{"name":"april_fools_snapshots","type":"resource","description":"提供对愚人节快照的有限支持","author":["梗体中文内容组"],"directory":"april_fools_snapshots"},{"name":"author_zombies","type":"resource","description":"让僵尸随机变成各个作者的亚子","author":["Gu_ZT"],"directory":"author_zombies"},{"name":"bagify","type":"resource","description":"帮你把所有粉末装到袋子里","author":["SkyEye_FAST","DoroWolf"],"directory":"bagify"},{"name":"bagify_incompatible","type":"resource","description":"从原bagify分离以解决兼容性问题","author":["DoroWolf"],"incompatible_with":["jinkela","fursuit"],"directory":"bagify_incompatible"},{"name":"baguette","type":"resource","description":"真·法国面包","author":["DoroWolf","Lakejason0"],"directory":"baguette"},{"name":"bee_pickaxe","type":"resource","description":"镐蜂了！","author":["SkyEye_FAST"],"incompatible_with":["fake_multitool"],"directory":"bee_pickaxe"},{"name":"bell_sound","type":"resource","description":"噔 噔 咚（钟声）","author":["DoroWolf"],"directory":"bell_sound"},{"name":"block_animation_reverse","type":"resource","description":"倒序播放方块纹理动画。","author":["siiftun1857"],"directory":"block_animation_reverse"},{"name":"brewing_stand_model","type":"resource","description":"将炼药台变成手办","author":["Lakejason0","Gu_ZT"],"directory":"brewing_stand_model"},{"name":"chicken_soup","type":"resource","description":"喝！为什么不喝？","author":["Zh9c418"],"directory":"chicken_soup"},{"name":"disco_ball","type":"resource","description":"红石灯球，有动态材质的那种","author":["Gu_ZT","Zh9c418","DoroWolf"],"directory":"disco_ball"},{"name":"dorowolf_texture","type":"resource","description":"超可爱的多洛洛狼！","author":["DoroWolf"],"directory":"dorowolf_texture"},{"name":"enable_compliancies","type":"resource","description":"为一些地区（包括两岸三地）启用防沉迷警告。","author":["Dianliang233"],"incompatible_with":["too_much_compliancies"],"directory":"enable_compliancies"},{"name":"fake_multitool","type":"resource","description":"工具的用途被模糊。","author":["siiftun1857"],"incompatible_with":["bee_pickaxe","locusazzurro"],"directory":"fake_multitool"},{"name":"famous_scene","type":"resource","description":"世 界 名 画","author":["DoroWolf"],"incompatible_with":["linus_minecraft_craps"],"directory":"famous_scene"},{"name":"firework_sound","type":"resource","description":"专 业 配 音 员","author":["DoroWolf"],"directory":"firework_sound"},{"name":"fursuit","type":"resource","description":"奇怪的南瓜？","author":["ZH9c418"],"incompatible_with":["bagify_incompatible"],"directory":"fursuit"},{"name":"glyph_sizes_fix","type":"resource","description":"修复全角标点周围没有空隙的问题","author":["Lakejason0"],"directory":"glyph_sizes_fix"},{"name":"goat_horn_sound","type":"resource","description":"山羊角的音效（音量注意）","author":["DoroWolf"],"directory":"goat_horn_sound"},{"name":"grass_enchanted","type":"resource","description":"草（附魔）","author":["MiemieMethod"],"incompatible_with":["real_grass"],"directory":"grass_enchanted"},{"name":"jinkela","type":"resource","description":"阿妹你看，上帝压狗","author":["DoroWolf"],"incompatible_with":["bagify_incompatible"],"directory":"jinkela"},{"name":"lang_achievements_1.11-1.11.2","type":"resource","description":"17w13a之前的成就字符串","author":["梗体中文内容组"],"directory":"lang_achievements_1.11-1.11.2"},{"name":"lang_attributes_1.12.2-1.15.2","type":"resource","description":"1.12.2至1.15.2间的属性名称","author":["梗体中文内容组"],"directory":"lang_attributes_1.12.2-1.15.2"},{"name":"lang_backupworld_1.12.2-1.16.5","type":"resource","description":"1.12.2至1.16.5间的备份世界提醒","author":["梗体中文内容组"],"directory":"lang_backupworld_1.12.2-1.16.5"},{"name":"lang_combat_test_6","type":"resource","description":"提供对Combat Test 6快照的梗体中文有限支持","author":["梗体中文内容组"],"directory":"lang_combat_test_6"},{"name":"lang_enchantment_level_extend","type":"resource","description":"附魔等级扩展","author":["DoroWolf"],"directory":"lang_enchantment_level_extend"},{"name":"lang_extra_strings","type":"resource","description":"提供额外字符串支持","author":["梗体中文内容组"],"directory":"lang_extra_strings"},{"name":"lang_grass_path_1.12.2-1.16.5","type":"resource","description":"20w45a以前的草径方块","author":["梗体中文内容组"],"directory":"lang_grass_path_1.12.2-1.16.5"},{"name":"lang_multiplayer_1.12.2-1.16.3","type":"resource","description":"1.16.4-pre1以前不兼容的客户端与服务端信息","author":["梗体中文内容组"],"directory":"lang_multiplayer_1.12.2-1.16.3"},{"name":"lang_nether_biome_1.12.2-1.15.2","type":"resource","description":"20w06a以前的下界生物群系","author":["梗体中文内容组"],"directory":"lang_nether_biome_1.12.2-1.15.2"},{"name":"lang_old_biomes_1.12.2-1.17.1","type":"resource","description":"1.18前的生物群系","author":["梗体中文内容组"],"directory":"lang_old_biomes_1.12.2-1.17.1"},{"name":"lang_old_realms_strings","type":"resource","description":"旧版本领域的各种字符串","author":["梗体中文内容组"],"directory":"lang_old_realms_strings"},{"name":"lang_old_strings","type":"resource","description":"旧版本的各种字符串","author":["梗体中文内容组"],"directory":"lang_old_strings"},{"name":"lang_replaceitem_1.12.2-1.16.5","type":"resource","description":"20w46a以前的replaceitem命令","author":["梗体中文内容组"],"directory":"lang_replaceitem_1.12.2-1.16.5"},{"name":"lang_selectworld_gui_1.12.2-1.16.1","type":"resource","description":"20w28a以前的生成世界字符串","author":["梗体中文内容组"],"directory":"lang_selectworld_gui_1.12.2-1.16.1"},{"name":"lang_selectworld_gui_1.16.2-1.16.5","type":"resource","description":"21w03a以前的生成世界字符串","author":["梗体中文内容组"],"directory":"lang_selectworld_gui_1.16.2-1.16.5"},{"name":"lang_serious_dedication_1.12.2-1.15.2","type":"resource","description":"20w20a以前版本的“终极奉献”进度","author":["梗体中文内容组"],"directory":"lang_serious_dedication_1.12.2-1.15.2"},{"name":"lang_sfc","type":"resource","description":"适用于严格审查的文本替换。注：看破别说破。","author":["梗体中文内容组"],"incompatible_with":["fake_multitool"],"directory":"lang_sfc"},{"name":"lang_sfw","type":"resource","description":"适用于工作场合的文本替换","author":["梗体中文内容组"],"directory":"lang_sfw"},{"name":"lang_sleep_impossible_1.12.2-1.16.5","type":"resource","description":"21w03a以前的无法入睡字符串","author":["梗体中文内容组"],"directory":"lang_sleep_impossible_1.12.2-1.16.5"},{"name":"lang_spawnpoint_1.12.2-1.15.2","type":"resource","description":"20w12a以前版本的重生信息的替换","author":["梗体中文内容组"],"directory":"lang_spawnpoint_1.12.2-1.15.2"},{"name":"lang_spawnpoint_1.16-1.16.1","type":"resource","description":"20w29a以前版本的重生信息的替换","author":["梗体中文内容组"],"directory":"lang_spawnpoint_1.16-1.16.1"},{"name":"lang_trapdoor_1.12.2-1.15.2","type":"resource","description":"对20w14a以前版本的活板门字幕更正","author":["梗体中文内容组"],"directory":"lang_trapdoor_1.12.2-1.15.2"},{"name":"lang_world_generation_1.12.2-1.18.2","type":"resource","description":"1.19前的世界生成","author":["梗体中文内容组"],"directory":"lang_world_generation_1.12.2-1.18.2"},{"name":"lang_worldborder_1.12.2-1.16.5","type":"resource","description":"对21w18a以前版本的世界边界过大提示的替换","author":["梗体中文内容组"],"directory":"lang_worldborder_1.12.2-1.16.5"},{"name":"latiao","type":"resource","description":"一起恰辣条","author":["DoroWolf"],"directory":"latiao"},{"name":"map_override","type":"resource","description":"在地图上展示我们的Slogan","author":["Lakejason0"],"directory":"map_override"},{"name":"mcbbs","type":"resource","description":"修改了物品名和生物名，还有一些其他的。","author":["ZX夏夜之风"],"directory":"mcbbs"},{"name":"meme_splashes","type":"resource","description":"闪烁标语","author":["梗体中文内容组"],"directory":"meme_splashes"},{"name":"minecart_helmet","type":"resource","description":"？你怎么把矿车倒过来了","author":["最亮的信标"],"directory":"minecart_helmet"},{"name":"mooncake","type":"resource","description":"恰月饼！","author":["IcyPhantom","电量量"],"incompatible_with":["reverse_cake_texture"],"directory":"mooncake"},{"name":"mopemope","type":"resource","description":"儿 童 金 曲","author":["DoroWolf","Zh9c418"],"directory":"mopemope"},{"name":"netease","type":"resource","description":"网易版专用模块","author":["Dianliang233"],"directory":"netease"},{"name":"observer_think","type":"resource","description":"思辩者.jpg","author":["ZCYF","Lakejason0"],"directory":"observer_think"},{"name":"open_close_sound","type":"resource","description":"关掉，关掉，一定要关掉...","author":["DoroWolf"],"directory":"open_close_sound"},{"name":"questioning_totem","type":"resource","description":"在？您怎么又死了？","author":["DoroWolf"],"incompatible_with":["totem_model"],"directory":"questioning_totem"},{"name":"rainbow_enchanting","type":"resource","description":"彩虹附魔","author":["Iron_noob_73"],"directory":"rainbow_enchanting"},{"name":"real_grass","type":"resource","description":"大草","author":["Zh9c418"],"incompatible_with":["grass_enchanted"],"directory":"reAL_GrAsS"},{"name":"red_leaf_valley","type":"resource","description":"红叶谷，让白桦变为红枫（需要OptiFine)","author":["Gu_ZT"],"directory":"red_leaf_valley"},{"name":"reverse_cake_model","type":"resource","description":"上面放三个小麦，下面放三个牛奶...（模型适配版）","author":["DoroWolf"],"incompatible_with":["anniversary","reverse_cake_texture"],"directory":"reverse_cake_model"},{"name":"reverse_cake_texture","type":"resource","description":"上面放三个小麦，下面放三个牛奶...（纹理适配版）","author":["DoroWolf"],"incompatible_with":["mooncake","reverse_cake_model"],"directory":"reverse_cake_texture"},{"name":"sculk_sound","type":"resource","description":"带有奇怪音效的幽匿系列方块","author":["DoroWolf"],"directory":"sculk_sound"},{"name":"strange_meme_background","type":"resource","description":"这菜单背景真的怪","author":["ZH9c418"],"directory":"strange_meme_background"},{"name":"too_much_compliancies","type":"resource","description":"超级防沉迷。","author":["Dianliang233"],"incompatible_with":["enable_compliancies"],"directory":"too_much_compliancies"},{"name":"totem_model","type":"resource","description":"把不死图腾变成手办","author":["Lakejason0","Gu_ZT"],"incompatible_with":["questioning_totem"],"directory":"totem_model"},{"name":"vulpes_ferrilata","type":"resource","description":"张辰亮，又称藏狐，是网络热门生物","author":["ZH9c418"],"directory":"vulpes_ferrilata"}],"collection":[{"name":"choice_modules_netease","type":"collection","description":"中国版的预设打包。","author":["电量量","ff98sha"],"incompatible_with":["gameplay_confuser"],"contains":["a_piece_of_seriousness","anniversary","annoying_sounds","author_zombies","bagify","baguette","bee_pickaxe","bell_sound","brewing_stand_model","disco_ball","dorowolf_texture","reverse_cake_texture","famous_scene","firework_sound","glyph_sizes_fix","locusazzurro","map_override","minecart_helmet","mopemope","netease","observer_think","open_close_sound","questioning_totem","sculk_sound","vulpes_ferrilata"],"directory":"choice_module_netease"},{"name":"choice_modules_1","type":"collection","description":"精选模块集合·一","author":["梗体中文内容组"],"incompatible_with":["gameplay_confuser"],"contains":["a_piece_of_seriousness","anniversary","bagify","enable_compliancies","glyph_sizes_fix","goat_horn_sound","locusazzurro","map_override","meme_splashes","observer_think"],"directory":"choice_modules_1"},{"name":"gameplay_confuser","type":"collection","description":"一系列改变游戏体验并引发困惑和障碍的无梗模块集合","author":["siiftun1857"],"incompatible_with":["choice_modules_1","choice_modules_netease","strange_item_modules"],"contains":["block_animation_reverse","fake_multitool"],"directory":"gameplay_confuser"},{"name":"sounds_modules","type":"collection","description":"奇怪声音模块集合","author":["DoroWolf"],"contains":["annoying_sounds","bell_sound","firework_sound","goat_horn_sound","open_close_sound","sculk_sound"],"directory":"sounds_modules"},{"name":"strange_item_modules","type":"collection","description":"奇怪物品模块集合","author":["DoroWolf"],"incompatible_with":["gameplay_confuser"],"contains":["baguette","bee_pickaxe","disco_ball","reverse_cake_texture","jinkela","latiao","minecart_helmet"],"directory":"strange_item_modules"},{"name":"version_1.12.2-1.15.2","type":"collection","description":"适用于1.12至1.15.2版本的模块集合","author":["梗体中文内容组"],"contains":["lang_achievements_1.11-1.11.2","lang_attributes_1.12.2-1.15.2","lang_extra_strings","lang_grass_path_1.12.2-1.16.5","lang_multiplayer_1.12.2-1.16.3","lang_nether_biome_1.12.2-1.15.2","lang_old_realms_strings","lang_old_strings","lang_replaceitem_1.12.2-1.16.5","lang_selectworld_gui_1.12.2-1.16.1","lang_serious_dedication_1.12.2-1.15.2","lang_sleep_impossible_1.12.2-1.16.5","lang_spawnpoint_1.12.2-1.15.2","lang_trapdoor_1.12.2-1.15.2","lang_worldborder_1.12.2-1.16.5","lang_old_biomes_1.12.2-1.17.1","lang_world_generation_1.12.2-1.18.2"],"directory":"version_1.12.2-1.15.2"},{"name":"version_1.16.5","type":"collection","description":"适用于1.16.5版本的模块集合","author":["梗体中文内容组"],"contains":["lang_grass_path_1.12.2-1.16.5","lang_old_realms_strings","lang_old_strings","lang_replaceitem_1.12.2-1.16.5","lang_sleep_impossible_1.12.2-1.16.5","lang_worldborder_1.12.2-1.16.5","lang_old_biomes_1.12.2-1.17.1","lang_world_generation_1.12.2-1.18.2"],"directory":"version_1.16.5"},{"name":"version_1.17.1","type":"collection","description":"适用于1.17.1版本的模块集合","author":["梗体中文内容组"],"contains":["lang_old_realms_strings","lang_old_strings","lang_old_biomes_1.12.2-1.17.1","lang_world_generation_1.12.2-1.18.2"],"directory":"version_1.17.1"},{"name":"version_1.18.2","type":"collection","description":"适用于1.18.2版本的模块集合","author":["梗体中文内容组"],"contains":["lang_old_realms_strings","lang_old_strings","lang_world_generation_1.12.2-1.18.2"],"directory":"version_1.18.2"}]},"be_modules":{"resource":[{"name":"LocusAzzurro","type":"resource","description":"鸡，蓝色，聪明，会建筑","author":["Dianliang233","locusazzurro","Light Beacon"],"incompatible_with":["fake_multitool"],"directory":"LocusAzzurro"},{"name":"a_letter","type":"resource","description":"一封信。也许打完龙会出现。","author":["梗体中文内容组"],"incompatible_with":["a_piece_of_seriousness"],"directory":"a_letter"},{"name":"a_piece_of_seriousness","type":"resource","description":"一份取代终末之诗的文章。","author":["siiftun1857"],"incompatible_with":["a_letter"],"directory":"a_piece_of_seriousness"},{"name":"bagify","type":"resource","description":"帮你把所有粉末和碎屑装进袋子里。","author":["SkyEye_FAST"],"incompatible_with":["fursuit"],"directory":"bagify"},{"name":"bagify_incompatible","type":"resource","description":"从原bagify分离以解决兼容性问题","author":["DoroWolf"],"incompatible_with":["jinkela","fursuit"],"directory":"bagify_incompatible"},{"name":"baguette","type":"resource","description":"真·法国面包","author":["DoroWolf","Lakejason0"],"directory":"baguette"},{"name":"bedrock_logo","type":"resource","description":"基岩版就是基岩版，还我副标题来","author":["SkyEye_FAST"],"directory":"bedrock_logo"},{"name":"bee_pickaxe","type":"resource","description":"镐蜂了！","author":["SkyEye_FAST"],"incompatible_with":["fake_multitool"],"directory":"bee_pickaxe"},{"name":"bell_sound","type":"resource","description":"噔 噔 咚（钟声）","author":["DoroWolf"],"directory":"bell_sound"},{"name":"chicken_soup","type":"resource","description":"喝！为什么不喝？","author":["Zh9c418"],"directory":"chicken_soup"},{"name":"disco_ball","type":"resource","description":"红石灯球，有动态材质的那种","author":["Gu_ZT","Zh9c418","DoroWolf"],"directory":"disco_ball"},{"name":"dorowolf_texture","type":"resource","description":"超可爱的多洛洛狼！","author":["DoroWolf"],"directory":"dorowolf_texture"},{"name":"fake_multitool","type":"resource","description":"工具的用途被模糊。","author":["siiftun1857"],"incompatible_with":["bee_pickaxe","locusazzurro"],"directory":"fake_multitool"},{"name":"firework_sound","type":"resource","description":"专 业 配 音 员","author":["DoroWolf"],"directory":"firework_sound"},{"name":"fursuit","type":"resource","description":"奇怪的南瓜？","author":["ZH9c418"],"incompatible_with":["bagify_incompatible"],"directory":"fursuit"},{"name":"goat_horn_sound","type":"resource","description":"山羊角的音效（音量注意）","author":["DoroWolf"],"directory":"goat_horn_sound"},{"name":"grass_enchanted","type":"resource","description":"草（附魔）","author":["MiemieMethod"],"incompatible_with":["real_grass"],"directory":"grass_enchanted"},{"name":"jinkela","type":"resource","description":"阿妹你看，上帝压狗","author":["DoroWolf"],"incompatible_with":["bagify_incompatible"],"directory":"jinkela"},{"name":"lang_sfc","type":"resource","description":"适用于严格审查的文本替换","author":["梗体中文内容组"],"directory":"lang_sfc"},{"name":"lang_sfw","type":"resource","description":"适用于工作场合的文本替换","author":["梗体中文内容组"],"directory":"lang_sfw"},{"name":"latiao","type":"resource","description":"一起恰辣条","author":["DoroWolf"],"directory":"latiao"},{"name":"map_override","type":"resource","description":"在地图上展示我们的Slogan","author":["Lakejason0"],"directory":"map_override"},{"name":"mcbbs","type":"resource","description":"修改了物品名和生物名，还有一些其他的。","author":["ZX夏夜之风"],"directory":"mcbbs"},{"name":"meme_splashes","type":"resource","description":"闪烁标语","author":["梗体中文内容组"],"directory":"meme_splashes"},{"name":"minecart_helmet","type":"resource","description":"？你怎么把矿车倒过来了","author":["Light Beacon"],"directory":"minecart_helmet"},{"name":"mooncake","type":"resource","description":"恰月饼！","author":["IcyPhantom","电量量"],"incompatible_with":["reverse_cake"],"directory":"mooncake"},{"name":"mopemope","type":"resource","description":"儿 童 金 曲","author":["DoroWolf"],"directory":"mopemope"},{"name":"observer_think","type":"resource","description":"思辩者.png","author":["Lakejason0","ZCYF"],"directory":"observer_think"},{"name":"open_close_sound","type":"resource","description":"关掉，关掉，一定要关掉...","author":["DoroWolf"],"directory":"open_close_sound"},{"name":"questioning_totem","type":"resource","description":"在？您怎么又死了？","author":["DoroWolf"],"directory":"questioning_totem"},{"name":"rainbow_enchanting","type":"resource","description":"彩虹附魔","author":["Iron_noob_73"],"directory":"rainbow_enchanting"},{"name":"real_grass","type":"resource","description":"大草","author":["Zh9c418"],"incompatible_with":["grass_enchanted"],"directory":"reAL_GrAsS"},{"name":"red_leaf_valley","type":"resource","description":"红叶谷","author":["Gu_ZT"],"directory":"red_leaf_valley"},{"name":"reverse_cake","type":"resource","description":"上面放三个小麦，下面放三个牛奶...","author":["DoroWolf"],"incompatible_with":["mooncake"],"directory":"reverse_cake"},{"name":"sculk_sound","type":"resource","description":"带有奇怪音效的幽匿系列方块","author":["DoroWolf"],"directory":"sculk_sound"},{"name":"strange_meme_background","type":"resource","description":"这菜单背景真的怪","author":["ZH9c418"],"directory":"strange_meme_background"},{"name":"technical_fix","type":"resource","description":"技术性方块相关的修复","author":["DoroWolf"],"directory":"technical_fix"},{"name":"trident_model","type":"resource","description":"现在可以把作者丢来丢去啦！","author":["AddonsCommandResource","Lakejason0"],"directory":"trident_model"},{"name":"visible_hunger_value","type":"resource","description":"修改了物品名以显示可恢复的饥饿值。","author":["SkyEye_FAST"],"incompatible_with":["baguette","chicken_soup","latiao","locusazzurro","mooncake","reverse_cake"],"directory":"visible_hunger_value"},{"name":"vulpes_ferrilata","type":"resource","description":"张辰亮，又称藏狐，是网络热门生物","author":["ZH9c418"],"directory":"vulpes_ferrilata"},{"name":"warm_blue_ui","type":"resource","description":"把原版的目害绿色替换为温和的蓝色","author":["SkyEye_FAST"],"directory":"warm_blue_ui"}],"collection":[{"name":"choice_modules_1","type":"collection","description":"模块精选合集·一","author":["梗体中文内容组"],"contains":["a_piece_of_seriousness","bagify","bedrock_logo","bee_pickaxe","dorowolf_texture","goat_horn_sound","grass_enchanted","locusazzurro","map_override","meme_splashes","mopemope","observer_think","questioning_totem","rainbow_enchanting","technical_fix","trident_model"],"directory":"choice_modules_1"},{"name":"choice_modules_netease","type":"collection","description":"中国版的预设打包。","author":["电量量"],"contains":["a_piece_of_seriousness","baguette","bee_pickaxe","bell_sound","dorowolf_texture","firework_sound","locusazzurro","minecart_helmet","mopemope","observer_think","open_close_sound","questioning_totem","reverse_cake","trident_model","sculk_sound","vulpes_ferrilata"],"directory":"choice_modules_netease"},{"name":"sounds_modules","type":"collection","description":"奇怪声音模块集合","author":["DoroWolf"],"contains":["bell_sound","open_close_sound","firework_sound","goat_horn_sound","sculk_sound"],"directory":"sounds_modules"},{"name":"strange_item_modules","type":"collection","description":"奇怪物品模块集合","author":["DoroWolf"],"contains":["baguette","jinkela","latiao","minecart_helmet","reverse_cake"],"directory":"strange_item_modules"}]},"je_modified":1654785988918,"be_modified":1654870954705}'
) // use JSON.parse for better performance

export default fakeApiData