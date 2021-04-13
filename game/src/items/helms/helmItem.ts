import { IItem, Item } from "../item";
import { ItemImages } from "../itemImages";
import * as PIXI from "pixi.js";
import { ItemTypes } from "../itemTypes";

export class HelmItem extends Item
{
	constructor(itemData: IItem)
	{
		super(itemData);

		this._itemType = ItemTypes.HELM;

		//this.createItemSkills(itemData.skills);
		//this.createRandomItemSkills(itemData.skills);
	}

	protected createRandomItemSkills(rank: number)
	{
		switch(rank)
		{
			case 1:
				/*this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.joker, FieldTypes.empty],
						[FieldTypes.joker, FieldTypes.joker, FieldTypes.joker],
						[FieldTypes.joker, FieldTypes.joker, FieldTypes.empty]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.damage, 10),"Sisak"));

				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.magic]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.shield, 5), "Katapult"));

				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.joker, FieldTypes.empty],
						[FieldTypes.joker, FieldTypes.joker, FieldTypes.joker],
						[FieldTypes.joker, FieldTypes.joker, FieldTypes.empty]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.damage, 5)));

				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.magic]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.shield, 5)));

				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.joker, FieldTypes.empty],
						[FieldTypes.joker, FieldTypes.joker, FieldTypes.joker],
						[FieldTypes.joker, FieldTypes.joker, FieldTypes.empty]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.damage, 5)));*/
				break;

			case 2:
				/*this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.defense, FieldTypes.empty, FieldTypes.defense],
						[FieldTypes.empty, FieldTypes.defense, FieldTypes.empty],
						[FieldTypes.defense, FieldTypes.empty, FieldTypes.defense]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.stun, 10)));

				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.move, FieldTypes.empty, FieldTypes.move],
						[FieldTypes.move, FieldTypes.empty, FieldTypes.move],
						[FieldTypes.move, FieldTypes.empty, FieldTypes.move]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.manaRegen, 5)));

				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.attack, FieldTypes.attack, FieldTypes.attack],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.attack, FieldTypes.attack, FieldTypes.attack]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.manaRegen, 5)));

				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.magic, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.manaRegen, 5)));

				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.magic, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.magic, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.magic, FieldTypes.empty]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.manaRegen, 5)));*/


				break;

			default:
				console.log("ERROR: UNKNOWN ITEM TYPE");
				break;
		}
	}

	protected addItemImage(itemImage: ItemImages)
	{
		switch(itemImage)
		{
			case ItemImages.LVL_1_HELM:
				this._itemTexture = PIXI.Texture.from("items/lvl_1/helm.png");
				break;

			case ItemImages.STARTING_HELM:
				this._itemTexture = PIXI.Texture.from("items/lvl_1/startingItems/startingDagger.png");
				break;

			default:
				console.log("ERROR: UNKNOWN ITEM IMAGE");
				break;
		}

		this._itemSprite = new PIXI.Sprite(this._itemTexture);
	}
}
