import * as PIXI from "pixi.js";
import { ItemImages } from "./itemImages";
import { IPlayerSkill, PlayerSkill } from "../skill/controller/playerSkill";
import { ItemTypes } from "./itemTypes";
import { ItemClass } from "./ItemClass";

export interface IItem
{
	rank: number;
	image: ItemImages;
	itemType: ItemTypes;
	itemClass: ItemClass;
	skills: IPlayerSkill[];
}

export class Item
{
	protected _itemSprite: PIXI.Sprite;
	protected _itemTexture: PIXI.Texture;
	protected _skill: PlayerSkill[];
	protected _image: ItemImages;
	protected _rank: number;
	protected _itemType: ItemTypes;
	protected _itemClass: ItemClass;
	protected _isItem: boolean;

	constructor(itemData: IItem)
	{
		this._skill = [];
		this._image = itemData.image;
		this._rank = itemData.rank;
		this._isItem = true;

		this.addItemImage(this._image);
		this.createSkill(itemData.skills);

		if(this._image !== ItemImages.NO_ITEM)
		{
			/*if(isRandom)
			{
				this.createRandomItemSkills(rank);
			}*/
		}
	}

	private createSkill(skills: IPlayerSkill[])
	{
		for(let i=0; i<skills.length; i++)
		{
			this._skill.push(new PlayerSkill(skills[i]));
		}
	}

	protected createRandomItemSkills(rank: number)
	{

	}

	protected addItemImage(itemImage: ItemImages)
	{
		this._isItem = false;
		this._itemTexture = PIXI.Texture.from("items/noItem.png");
		this._itemSprite = new PIXI.Sprite(this._itemTexture);
	}

	get isItem(): boolean
	{
		return this._isItem;
	}

	public get skill(): PlayerSkill[]
	{
		return this._skill;
	}

	public get imageSprite(): PIXI.Sprite
	{
		return this._itemSprite;
	}

	public get imageSpriteTexture(): PIXI.Texture
	{
		return this._itemTexture;
	}

	public get rank(): number
	{
		return this._rank;
	}

	public get itemType(): ItemTypes
	{
		return this._itemType;
	}

	public get itemClass(): ItemClass
	{
		return this._itemClass;
	}

	public get itemData(): IItem
	{
		const skills: IPlayerSkill[] = [];

		for(let i=0; i<this._skill.length; i++)
		{
			skills.push(this._skill[i].playerSkillData);
		}

		if(!this._itemType)
		{
			this._itemType = ItemTypes.NO_ITEM;
		}

		if(!this._itemClass)
		{
			this._itemClass = ItemClass.NO_CLASS;
		}

		return ({
			rank: this._rank,
			image: this._image,
			itemType: this._itemType,
			itemClass: this._itemClass,
			skills: skills
		});
	}
}
