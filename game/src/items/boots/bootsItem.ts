import { IItem, Item } from "../item";
import { ItemImages } from "../itemImages";
import * as PIXI from "pixi.js";
import { ItemTypes } from "../itemTypes";

export class BootsItem extends Item
{
	constructor(itemData: IItem)
	{
		super(itemData);

		this._itemType = ItemTypes.BOOTS;
	}

	protected createRandomItemSkills(rank: number)
	{
		switch(rank)
		{
			case 1:
				/*this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.attack, FieldTypes.attack],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
				), new Effect(EffectTypes.sacrifice, 8), new Effect(EffectTypes.noEffect, 5)));

				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.attack, FieldTypes.attack],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
				), new Effect(EffectTypes.heal, 8), new Effect(EffectTypes.noEffect, 5)));*/
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
			case ItemImages.LVL_1_BOOTS:
				this._itemTexture = PIXI.Texture.from("items/lvl_1/boots.png");
				break;

			case ItemImages.STARTING_BOOTS:
				this._itemTexture = PIXI.Texture.from("items/lvl_1/startingItems/startingBoots.png");
				break;

			default:
				console.log("ERROR: UNKNOWN ITEM IMAGE");
				break;
		}

		this._itemSprite = new PIXI.Sprite(this._itemTexture);
	}
}
