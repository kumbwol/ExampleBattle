import { LootTypes } from "./LootTypes";

export class Loot
{
	private _loot: LootTypes[];

	constructor()
	{
		this._loot = [];
	}

	public get loot(): LootTypes[]
	{
		return this._loot;
	}

	public addLoot(lootType: LootTypes)
	{
		this._loot.push(lootType);
	}
}
