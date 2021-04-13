import { IItem, Item } from "../item";
import { ItemImages } from "../itemImages";
import { ItemTypes } from "../itemTypes";

export class WeaponItem extends Item
{
	constructor(itemData: IItem)
	{
		super(itemData);

		this._itemType = ItemTypes.WEAPON;
	}

	protected createRandomItemSkills(rank: number)
	{

	}

	protected addItemImage(itemImage: ItemImages)
	{

	}
}
