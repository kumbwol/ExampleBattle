import * as PIXI from "pixi.js";
import { FieldTypes } from "./fieldTypes";

export class FieldView
{
	protected readonly _attackFieldTexture: PIXI.Texture;
	protected readonly _magicFieldTexture: PIXI.Texture;
	protected readonly _jokerFieldTexture: PIXI.Texture;
	protected readonly _moveFieldTexture: PIXI.Texture;
	protected readonly _defenseFieldTexture: PIXI.Texture;
	protected readonly _poisonFieldTexture: PIXI.Texture;
	protected readonly _stunnedFieldTexture: PIXI.Texture;

	protected readonly _attackIconTexture: PIXI.Texture;
	protected readonly _magicIconTexture: PIXI.Texture;
	protected readonly _jokerIconTexture: PIXI.Texture;
	protected readonly _moveIconTexture: PIXI.Texture;
	protected readonly _defenseIconTexture: PIXI.Texture;
	protected readonly _poisonIconTexture: PIXI.Texture;

	protected _fieldType: FieldTypes;
	protected _sprite: PIXI.Sprite;
	protected _fieldIcon: PIXI.Sprite;

	constructor()
	{
		this._sprite = new PIXI.Sprite;
		this._fieldIcon = new PIXI.Sprite;

		this._attackFieldTexture = PIXI.Texture.from("battle/attack.png");
		this._magicFieldTexture = PIXI.Texture.from("battle/magic.png");
		this._jokerFieldTexture = PIXI.Texture.from("battle/joker.png");
		this._moveFieldTexture = PIXI.Texture.from("battle/move.png");
		this._defenseFieldTexture = PIXI.Texture.from("battle/defense.png");
		this._stunnedFieldTexture = PIXI.Texture.from("battle/stun.png");
		this._poisonFieldTexture = PIXI.Texture.from("battle/poison.png");

		this._attackIconTexture = PIXI.Texture.from("battle/fieldMiniIcon/attack.png");
		this._magicIconTexture = PIXI.Texture.from("battle/fieldMiniIcon/magic.png");
		this._jokerIconTexture = PIXI.Texture.from("battle/fieldMiniIcon/joker.png");
		this._moveIconTexture = PIXI.Texture.from("battle/fieldMiniIcon/move.png");
		this._defenseIconTexture = PIXI.Texture.from("battle/fieldMiniIcon/defense.png");
		this._poisonIconTexture = PIXI.Texture.from("battle/fieldMiniIcon/poison.png");
	}

	protected makeField(fieldType: FieldTypes)
	{
		switch(fieldType)
		{
			case FieldTypes.attack:
				this._sprite.texture = this._attackFieldTexture;
				this._fieldIcon.texture = this._attackIconTexture;
				this._fieldType = FieldTypes.attack;
				break;

			case FieldTypes.magic:
				this._sprite.texture = this._magicFieldTexture;
				this._fieldIcon.texture = this._magicIconTexture;
				this._fieldType = FieldTypes.magic;
				break;

			case FieldTypes.move:
				this._sprite.texture = this._moveFieldTexture;
				this._fieldIcon.texture = this._moveIconTexture;
				this._fieldType = FieldTypes.move;
				break;

			case FieldTypes.defense:
				this._sprite.texture = this._defenseFieldTexture;
				this._fieldIcon.texture = this._defenseIconTexture;
				this._fieldType = FieldTypes.defense;
				break;

			case FieldTypes.joker:
				this._sprite.texture = this._jokerFieldTexture;
				this._fieldIcon.texture = this._jokerIconTexture;
				this._fieldType = FieldTypes.joker;
				break;

			case FieldTypes.poison:
				this._sprite.texture = this._poisonFieldTexture;
				this._fieldIcon.texture = this._poisonIconTexture;
				this._fieldType = FieldTypes.poison;
				break;
		}
	}
}
