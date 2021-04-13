import { IItem, Item } from "../item";
import { ItemImages } from "../itemImages";
import * as PIXI from "pixi.js";
import { ItemTypes } from "../itemTypes";

export class ArmorItem extends Item
{
	constructor(itemData: IItem)
	{
		super(itemData);

		this._itemType = ItemTypes.ARMOR;
	}

	protected createRandomItemSkills(rank: number)
	{
		switch(rank)
		{
			case 1:
				/*this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.defense, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
				), new Effect(EffectTypes.freeze, 25), new Effect(EffectTypes.stun, 10)));*/
				break;

			case 2:
				/*this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.defense, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
				), new Effect(EffectTypes.poison, 3), new Effect(EffectTypes.paralyze, 9)));*/
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
			case ItemImages.LVL_1_ARMOR:
				this._itemTexture = PIXI.Texture.from("items/lvl_1/armor.png");
				break;

			case ItemImages.STARTING_ARMOR:
				this._itemTexture = PIXI.Texture.from("items/lvl_1/startingItems/startingArmor.png");
				break;

			default:
				console.log("ERROR: UNKNOWN ITEM IMAGE");
				break;
		}

		this._itemSprite = new PIXI.Sprite(this._itemTexture);
	}
}
