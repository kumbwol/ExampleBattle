import { ItemImages } from "../itemImages";
import * as PIXI from "pixi.js";
import { WeaponItem } from "../weapons/WeaponItem";
import { IItem } from "../item";

export class ShieldItem extends WeaponItem
{
	constructor(itemData: IItem)
	{
		super(itemData);

		//this._itemType = ItemTypes.SHIELD;
	}

	protected createRandomItemSkills(rank: number)
	{
		switch(rank)
		{
			case 1:
				/*this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.magic, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
				), new Effect(EffectTypes.attackform, 10), new Effect(EffectTypes.attackform, 30)));

				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.magic, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
				), new Effect(EffectTypes.noEffect, 30), new Effect(EffectTypes.shield, 30)));*/
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
			case ItemImages.LVL_1_SHIELD:
				this._itemTexture = PIXI.Texture.from("items/lvl_1/shield.png");
				break;

			default:
				console.log("ERROR: UNKNOWN ITEM IMAGE");
				break;
		}

		this._itemSprite = new PIXI.Sprite(this._itemTexture);
	}
}
