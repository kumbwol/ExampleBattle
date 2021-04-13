import * as PIXI from 'pixi.js';
import { FieldTypes } from "./fieldTypes";
import { FieldController } from "./controller/fieldController";
import { Easing, Tweener } from "pixi-tweener";
import { EffectEvent } from "../../skill/effect/event/effectEvent";
import { SkillEvent } from "../../skill/event/skillEvent";
import { FieldStatus } from "./fieldStatus";
import { FieldView } from "./fieldView";

export class Field extends FieldView
{
	private _fieldContainer: PIXI.Container;
	private _container: PIXI.Container;
	private _fieldController: FieldController;
	private _dispatcher: PIXI.Container;
	private _status: FieldStatus;
	private _poisonDmg = 0;

	constructor(dispatcher: PIXI.Container, container: PIXI.Container, x, y, gapBetweenFields: number)
	{
		super();

		this._poisonDmg = 0;
		this._dispatcher = dispatcher;
		this._fieldContainer = new PIXI.Container();
		this._container = container;
		this._status = new FieldStatus(false, false);
		this.createField(dispatcher, container, x, y, gapBetweenFields);
	}

	public createField(dispatcher: PIXI.Container, container: PIXI.Container, x: number, y: number, gapBetweenFields: number)
	{
		this.createRandomField();

		this._fieldContainer.x = (x) + x * (this._sprite.width + gapBetweenFields);
		this._fieldContainer.y = (y) + y * (this._sprite.height + gapBetweenFields);

		this._sprite.hitArea = new PIXI.Circle( Math.floor(this._sprite.width / 2),  Math.floor(this._sprite.width / 2), Math.floor(this._sprite.width / 2));

		this._sprite.interactive = true;
		this._sprite.buttonMode = true;

		this._fieldController = new FieldController(dispatcher, container, this._fieldContainer, this._sprite, this._status);

		this._fieldController.addPointerListeners(this._sprite);

		this._fieldContainer.addChild(this._sprite);

		this._fieldIcon.x = (this._sprite.width - this._fieldIcon.width) / 2;
		this._fieldIcon.y = (this._sprite.height - this._fieldIcon.height) / 2;

		this._fieldContainer.addChild(this._fieldIcon);

		container.addChild(this._fieldContainer);
	}

	private createRandomField()
	{
		let randomFieldType = Math.floor(Math.random() * 4);

		switch(randomFieldType)
		{
			case 0:
				this.makeField(FieldTypes.attack);
				break;

			case 1:
				this.makeField(FieldTypes.magic);
				break;

			case 2:
				this.makeField(FieldTypes.move);
				break;

			case 3:
				this.makeField(FieldTypes.defense);
				break;
		}
	}

	public createDroppingInField()
	{
		this.createRandomField();

		this._fieldContainer.alpha = 1;
		this._container.addChild(this._fieldContainer);
	}

	public async transformSymbol(type: FieldTypes, isPrimary: boolean, lastTransform: boolean, isPlayer: boolean)
	{
		await Tweener.add
		(
			{
				target: this._fieldContainer,
				duration: 0.5,
				ease: Easing.linear
			},
			{
				alpha: 0
			}
		);

		switch(type)
		{
			case FieldTypes.attack:this._sprite.texture = this._attackFieldTexture; this._fieldIcon.texture = this._attackIconTexture; break;
			case FieldTypes.magic: this._sprite.texture = this._magicFieldTexture; this._fieldIcon.texture = this._magicIconTexture; break;
			case FieldTypes.joker: this._sprite.texture = this._jokerFieldTexture; this._fieldIcon.texture = this._jokerIconTexture; break;
			case FieldTypes.move: this._sprite.texture = this._moveFieldTexture; this._fieldIcon.texture = this._moveIconTexture; break;
			case FieldTypes.defense: this._sprite.texture = this._defenseFieldTexture; this._fieldIcon.texture = this._defenseIconTexture; break;
			case FieldTypes.poison: this._sprite.texture = this._poisonFieldTexture; this._fieldIcon.texture = this._poisonIconTexture; break;
		}

		if(this._status.isStunned)
		{
			this._sprite.texture = this._stunnedFieldTexture;
		}

		let alpha = 1;

		if(this._status.isParalyzed)
		{
			alpha = 0.35;
		}

		await Tweener.add
		(
			{
				target: this._fieldContainer,
				duration: 0.5,
				ease: Easing.linear
			},
			{
				alpha: alpha
			}
		);

		if(lastTransform)
		{
			if(isPrimary)
			{
				this._dispatcher.emit(EffectEvent.EV_PRIMARY_EFFECT_FINISHED);
			}
			else
			{
				if(isPlayer)
				{
					this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_FINISHED);
				}
				else
				{
					this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, isPlayer);
				}
			}
		}
	}

	public async stunSymbol(isPrimary: boolean, lastTransform: boolean, isPlayer: boolean)
	{
		await Tweener.add
		(
			{
				target: this._fieldContainer,
				duration: 0.5,
				ease: Easing.linear
			},
			{
				alpha: 0
			}
		);

		this._sprite.texture = this._stunnedFieldTexture;

		await Tweener.add
		(
			{
				target: this._fieldContainer,
				duration: 0.5,
				ease: Easing.linear
			},
			{
				alpha: 1
			}
		);

		if(lastTransform)
		{
			if(isPrimary)
			{
				this._dispatcher.emit(EffectEvent.EV_PRIMARY_EFFECT_FINISHED);
			}
			else
			{
				if(isPlayer)
				{
					this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_FINISHED);
				}
				else
				{
					this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, isPlayer);
				}
			}
		}
	}

	public async paralyzeSymbol(isPrimary: boolean, lastTransform: boolean, isPlayer: boolean)
	{
		await Tweener.add
		(
			{
				target: this._fieldContainer,
				duration: 0.5,
				ease: Easing.linear
			},
			{
				alpha: 0.35
			}
		);

		if(lastTransform)
		{
			if(isPrimary)
			{
				this._dispatcher.emit(EffectEvent.EV_PRIMARY_EFFECT_FINISHED);
			}
			else
			{
				if(isPlayer)
				{
					this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_FINISHED);
				}
				else
				{
					this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, isPlayer);
				}
			}
		}
	}

	public async removeParalyze()
	{
		await Tweener.add
		(
			{
				target: this._fieldContainer,
				duration: 0.5,
				ease: Easing.linear
			},
			{
				alpha: 1
			}
		);
	}

	public async removeStun()
	{
		await Tweener.add
		(
			{
				target: this._fieldContainer,
				duration: 0.5,
				ease: Easing.linear
			},
			{
				alpha: 0
			}
		);

		switch(this._fieldType)
		{
			case FieldTypes.attack: this._sprite.texture = this._attackFieldTexture; this._fieldIcon.texture = this._attackIconTexture; break;
			case FieldTypes.magic: this._sprite.texture = this._magicFieldTexture; this._fieldIcon.texture = this._magicIconTexture; break;
			case FieldTypes.joker: this._sprite.texture = this._jokerFieldTexture; this._fieldIcon.texture = this._jokerIconTexture; break;
			case FieldTypes.move: this._sprite.texture = this._moveFieldTexture; this._fieldIcon.texture = this._moveIconTexture; break;
			case FieldTypes.defense: this._sprite.texture = this._defenseFieldTexture; this._fieldIcon.texture = this._defenseIconTexture; break;
			case FieldTypes.poison: this._sprite.texture = this._poisonFieldTexture; this._fieldIcon.texture = this._poisonIconTexture; break;
		}

		await Tweener.add
		(
			{
				target: this._fieldContainer,
				duration: 0.5,
				ease: Easing.linear
			},
			{
				alpha: 1
			}
		);
	}

	public async noTransformSymbol(isPrimary: boolean, isPlayer: boolean)
	{
		await Tweener.add
		(
			{
				target: null,
				duration: 0.5,
			},
			{

			}
		);

		if(isPrimary)
		{
			this._dispatcher.emit(EffectEvent.EV_PRIMARY_EFFECT_FINISHED);
		}
		else
		{
			if(isPlayer)
			{
				this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_FINISHED);
			}
			else
			{
				this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, isPlayer);
			}
		}
	}

	public makeFieldEmpty()
	{
		this.fieldType = FieldTypes.empty;
		this.fieldContainer.alpha = 0;
		this.fieldContainer.y = -100;
		this.status.paralyze = false;
		this.status.stun = false;
	}

	public normalizeField()
	{
		this._fieldContainer.alpha = 1;
	}

	get fieldType(): FieldTypes
	{
		return this._fieldType;
	}

	get poisonDmg(): number
	{
		return this._poisonDmg;
	}

	set poisonDmg(poisonDmg: number)
	{
		this._poisonDmg = poisonDmg;
	}

	set fieldType(fieldType: FieldTypes)
	{
		this._fieldType = fieldType;
	}

	get fieldContainer(): PIXI.Container
	{
		return this._fieldContainer;
	}

	get fieldController(): FieldController
	{
		return this._fieldController;
	}

	get status(): FieldStatus
	{
		return this._status;
	}
}
