import { ItemImages } from "../itemImages";
import * as PIXI from "pixi.js";
import { PlayerSkill } from "../../skill/controller/playerSkill";
import { Pattern } from "../../skill/pattern/pattern";
import { FieldTypes } from "../../battle/field/fieldTypes";
import { Effect } from "../../skill/effect/effect";
import { EffectTypes } from "../../skill/effect/effectTypes";
import { WeaponItem } from "../weapons/WeaponItem";
import { IItem } from "../item";
import { ItemTypes } from "../itemTypes";

export class SwordItem extends WeaponItem
{
	constructor(itemData: IItem)
	{
		super(itemData);
	}

	protected createRandomItemSkills(rank: number)
	{
		switch(rank)
		{
			/*case 1:
				this._skill.push(new PlayerSkill(new Pattern(
					[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.magic, FieldTypes.empty],
						[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]]
				), new Effect(EffectTypes.noEffect, 0), new Effect(EffectTypes.damage, 5), "Kard"));
				break;*/

			default:
				console.log("ERROR: UNKNOWN ITEM TYPE");
				break;
		}
	}

	protected addItemImage(itemImage: ItemImages)
	{
		switch(itemImage)
		{
			case ItemImages.LVL_1_SWORD:
				this._itemTexture = PIXI.Texture.from("items/lvl_1/sword.png");
				break;

			case ItemImages.STARTING_DAGGER:
				this._itemTexture = PIXI.Texture.from("items/lvl_1/startingItems/startingDagger.png");
				break;

			default:
				console.log("ERROR: UNKNOWN ITEM IMAGE");
				break;
		}

		this._itemSprite = new PIXI.Sprite(this._itemTexture);
	}
}
