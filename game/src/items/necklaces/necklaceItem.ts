import { IItem, Item } from "../item";
import { ItemImages } from "../itemImages";
import * as PIXI from "pixi.js";
import { ItemTypes } from "../itemTypes";

export class NecklaceItem extends Item
{
	constructor(itemData: IItem)
	{
		super(itemData);

		this._itemType = ItemTypes.NECKLACE;
	}

	protected createRandomItemSkills(rank: number)
	{
		switch(rank)
		{
			case 1:
				/*this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.magic]]
				), new Effect(EffectTypes.poison, 10, 10), new Effect(EffectTypes.poisonDamage, 10)));*/
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
			case ItemImages.LVL_1_NECKLACE:
				this._itemTexture = PIXI.Texture.from("items/lvl_1/necklace.png");
				break;

			default:
				console.log("ERROR: UNKNOWN ITEM IMAGE");
				break;
		}

		this._itemSprite = new PIXI.Sprite(this._itemTexture);
	}
}
