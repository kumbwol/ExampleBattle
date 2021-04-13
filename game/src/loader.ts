import * as PIXI from 'pixi.js';

export class Loader
{
	constructor(loader: PIXI.Loader, callback: any)
	{
		loader
			.add("successAnimJSON", "./game/anim/successAnim/spritesheet.json")
			.add("cursedAmuletAnimJSON", "./game/anim/cursedAmulet/cursedAmulet.json")
			.add('./game/images/texturePacker/main-0.json')
			.add('./game/images/texturePacker/main-1.json')
			.add('./game/images/texturePacker/main-2.json')
			.load(() => callback.setup());
	}
}
