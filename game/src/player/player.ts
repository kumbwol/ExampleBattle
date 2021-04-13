import * as PIXI from "pixi.js";
import { PlayerSkill } from "../skill/controller/playerSkill";
import { Ability } from "./ability/ability";
import { AbilityTypes } from "./ability/abilityTypes";
import { IItem, Item } from "../items/item";
import { ItemTypes } from "../items/itemTypes";
import { BootsItem } from "../items/boots/bootsItem";
import { WeaponItem } from "../items/weapons/WeaponItem";
import { ArmorItem } from "../items/armors/armorItem";
import { NecklaceItem } from "../items/necklaces/necklaceItem";
import { HelmItem } from "../items/helms/helmItem";
import { PlaceTypes } from "./placeTypes";
import { ItemClass } from "../items/ItemClass";
import { SwordItem } from "../items/swords/swordItem";
import { Loot } from "./loot/Loot";
import { LootTypes } from "./loot/LootTypes";

export interface IPlayer
{
	maxMP: number;
	maxHP: number;
	mp: number;
	hp: number;
	activeItems: IItem[];
}

export class Player
{
	private _skills: PlayerSkill[][];
	private readonly _abilities: Ability[];
	private _portrait: PIXI.Texture;
	private _shield: number;
	private _hp: number;
	private _maxHp: number;
	private _mp: number;
	private _maxMp: number;
	private _abilityPoint: number;
	private _maxAbilityPoint: number;

	private _activeItems: Item[];

	private _place: PlaceTypes;

	private _loot: Loot;

	constructor(playerData: IPlayer)
	{
		this._mp = playerData.mp;
		this._maxMp = playerData.maxMP;
		this._shield = 0;
		this._hp = playerData.hp;
		this._maxHp = playerData.maxHP;
		this._maxAbilityPoint = 3;
		this._abilityPoint = 3;
		this._skills = [];
		this._activeItems = [];
		this._loot = new Loot();

		for(let i=0; i<6; i++)
		{
			this._skills[i] = [];
		}

		this._abilities = [];


		this._portrait = PIXI.Texture.from("portrait/player/player.png");

		this._abilities.push(new Ability(AbilityTypes.rotateLeft, 2));
		this._abilities.push(new Ability(AbilityTypes.mirrorVertically, 2));
		this._abilities.push(new Ability(AbilityTypes.rotateRight, 2));
		this._abilities.push(new Ability(AbilityTypes.knightSwap, 6));
		this._abilities.push(new Ability(AbilityTypes.diagonalSwap, 6));
		this._abilities.push(new Ability(AbilityTypes.mirrorHorizontally, 11));

		/*this._activeItems.push(new HelmItem(1, ItemImages.LVL_1_HELM));
		this._activeItems.push(new NecklaceItem(1, ItemImages.LVL_1_NECKLACE));
		this._activeItems.push(new ArmorItem(1, ItemImages.LVL_1_ARMOR));
		this._activeItems.push(new ShieldItem(1, ItemImages.LVL_1_SHIELD));
		this._activeItems.push(new SwordItem(1, ItemImages.LVL_1_SWORD));
		this._activeItems.push(new BootsItem(1, ItemImages.LVL_1_BOOTS));*/

		/*this._activeItems.push(new HelmItem(1, ItemImages.LVL_1_HELM));
		this._activeItems.push(new SwordItem(1, ItemImages.LVL_1_SWORD));
		this._activeItems.push(new HelmItem(1, ItemImages.LVL_1_HELM));
		this._activeItems.push(new HelmItem(1, ItemImages.LVL_1_HELM));
		this._activeItems.push(new ShieldItem(1, ItemImages.LVL_1_SHIELD));
		this._activeItems.push(new HelmItem(1, ItemImages.LVL_1_HELM));*/

		//console.log(playerData.activeItems);

		this._activeItems.push(this.addItem(playerData.activeItems[0]));
		this._activeItems.push(this.addItem(playerData.activeItems[1]));
		this._activeItems.push(this.addItem(playerData.activeItems[2]));
		this._activeItems.push(this.addItem(playerData.activeItems[3]));
		this._activeItems.push(this.addItem(playerData.activeItems[4]));
		this._activeItems.push(this.addItem(playerData.activeItems[5]));

		for(let i=0; i < 6; i++)
		{
			if(this._activeItems[i])
			{
				for(let j=0; j<this._activeItems[i].skill.length; j++)
				{
					this._skills[i].push(new PlayerSkill({pattern: this._activeItems[i].skill[j].playerSkillData.pattern, primaryEffect: this._activeItems[i].skill[j].playerSkillData.primaryEffect, secondaryEffect: this._activeItems[i].skill[j].playerSkillData.secondaryEffect, name: this._activeItems[i].skill[j].playerSkillData.name}));
				}
			}
		}

		//console.log("start");
		//console.log(this._activeItems);
		//console.log(this._skills);
		//console.log("end");

		/*this._skills[0].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.joker, FieldTypes.empty],
				[FieldTypes.joker, FieldTypes.joker, FieldTypes.joker],
				[FieldTypes.joker, FieldTypes.joker, FieldTypes.empty]]
		), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.damage, 10)));

		this._skills[0].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.magic]]
		), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.shield, 5)));

		this._skills[0].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.joker, FieldTypes.empty],
				[FieldTypes.joker, FieldTypes.joker, FieldTypes.joker],
				[FieldTypes.joker, FieldTypes.joker, FieldTypes.empty]]
		), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.damage, 5)));

		this._skills[0].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.magic]]
		), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.shield, 5)));

		this._skills[0].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.joker, FieldTypes.empty],
				[FieldTypes.joker, FieldTypes.joker, FieldTypes.joker],
				[FieldTypes.joker, FieldTypes.joker, FieldTypes.empty]]
		), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.damage, 5)));

		this._skills[0].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.magic]]
		), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.shield, 5)));*/

		/*this._skills[1].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.magic]]
		), new Effect(EffectTypes.poison, 10, 10), new Effect(EffectTypes.poisonDamage, 10)));

		this._skills[2].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.defense, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
		), new Effect(EffectTypes.freeze, 25), new Effect(EffectTypes.stun, 10)));

		this._skills[3].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.magic, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
		), new Effect(EffectTypes.attackform, 10), new Effect(EffectTypes.attackform, 30)));

		this._skills[3].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.magic, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
		), new Effect(EffectTypes.noEffect, 30), new Effect(EffectTypes.shield, 30)));

		this._skills[4].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.magic, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
		), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.damage, 5)));

		this._skills[5].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.attack, FieldTypes.attack],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
		), new Effect(EffectTypes.sacrifice, 8), new Effect(EffectTypes.noEffect, 5)));

		this._skills[5].push(new PlayerSkill(new Pattern(
			[[FieldTypes.empty, FieldTypes.attack, FieldTypes.attack],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
				[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
		), new Effect(EffectTypes.heal, 8), new Effect(EffectTypes.noEffect, 5)));*/
	}

	public get loot(): LootTypes[]
	{
		return this._loot.loot;
	}

	public addLoot(lootType: LootTypes)
	{
		this._loot.addLoot(lootType);
	}

	public addItem(itemData: IItem): Item
	{
		switch(itemData.itemType)
		{
			case ItemTypes.BOOTS:
				return new BootsItem(itemData);

			case ItemTypes.WEAPON:
				if(itemData.itemClass === ItemClass.SWORD)
				{
					return new SwordItem(itemData);
				}
				return new WeaponItem(itemData);

			case ItemTypes.ARMOR:
				return new ArmorItem(itemData);

			case ItemTypes.NECKLACE:
				return new NecklaceItem(itemData);

			case ItemTypes.HELM:
				return new HelmItem(itemData);

			case ItemTypes.NO_ITEM:
				return new Item(itemData);
		}
	}

	get skills(): PlayerSkill[][]
	{
		return this._skills;
	}

	public updateWeapons(id: number, item: Item)
	{
		this._activeItems[id] = item;

		for(let i=0; i<this._skills.length; i++)
		{
			this._skills[i] = this._activeItems[i].skill;
		}
	}

	get abilities(): Ability[]
	{
		return this._abilities;
	}

	get portrait(): PIXI.Texture
	{
		return this._portrait;
	}

	get shield(): number
	{
		return this._shield;
	}

	set shield(shield: number)
	{
		this._shield = shield;
	}

	get hp(): number
	{
		return this._hp;
	}

	set hp(hp: number)
	{
		this._hp = hp;
	}

	get maxHp(): number
	{
		return this._maxHp;
	}

	get mp(): number
	{
		return this._mp;
	}

	set mp(mp: number)
	{
		this._mp = mp;
	}

	get maxMp(): number
	{
		return this._maxMp;
	}

	get abilityPoint(): number
	{
		return this._abilityPoint;
	}

	set abilityPoint(value)
	{
		this._abilityPoint = value;
	}

	get maxAbilityPoint(): number
	{
		return this._maxAbilityPoint;
	}

	get activeItems(): Item[]
	{
		return this._activeItems;
	}

	public set place(place: PlaceTypes)
	{
		this._place = place;
	}

	public get place(): PlaceTypes
	{
		return this._place;
	}

	public get playerData(): IPlayer
	{
		const activeItems: IItem[] = [];

		for(let i=0; i<this._activeItems.length; i++)
		{
			activeItems.push(this._activeItems[i].itemData);
		}

		return ({
			maxMP: this._maxMp,
			maxHP: this._maxHp,
			hp: this._hp,
			mp: this._mp,
			activeItems: activeItems
		});
	}
}
