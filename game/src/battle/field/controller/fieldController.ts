import * as PIXI from "pixi.js";
import { FieldEvent } from "../event/fieldEvent";
import { PatternEvent } from "../../panel/event/patternEvent";
import { Main } from "../../../main";
import { SkillEvent } from "../../../skill/event/skillEvent";
import { AbilityEvent } from "../../ability/event/abilityEvent";
import { EndTurnButtonEvent } from "../../endTurnButton/event/endTurnButtonEvent";
import { GameAlertEvent } from "../../../gameAlert/event/gameAlertEvent";
import { FieldStatus } from "../fieldStatus";

export class FieldController
{
	private readonly _fieldSelectedTexture: PIXI.Texture;
	private readonly _fieldSwappable: PIXI.Texture;
	private readonly _fieldSwappableWithAbility: PIXI.Texture;
	private readonly _selectSprite: PIXI.Sprite;
	private readonly _swappableSprite: PIXI.Sprite;
	private _allowSelection: boolean;
	private _haveAbility: boolean;
	private _selected: boolean;
	private _swipeSelected: boolean;
	private _patternSelected: boolean;
	private _fieldSelectedByPattern: boolean;
	private _swappable: boolean;
	private _allowCursorChange: boolean;
	private _container: PIXI.Container;
	private _dispatcher: PIXI.Container;
	private _fieldContainer: PIXI.Container;
	private _sprite: PIXI.Sprite;
	private _fieldStatus: FieldStatus;
	private static touchID: string;

	constructor(dispatcher: PIXI.Container, container: PIXI.Container, fieldContainer: PIXI.Container, sprite: PIXI.Sprite, fieldStatus: FieldStatus)
	{
		this._fieldSelectedTexture = PIXI.Texture.from("battle/fieldSelected.png");
		this._fieldSwappable = PIXI.Texture.from("battle/fieldSwappable.png");
		this._fieldSwappableWithAbility = PIXI.Texture.from("battle/fieldSwappableWithAbility.png");

		this._selected = false;
		this._haveAbility = true;
		this._swipeSelected = false;
		this._patternSelected = false;
		this._fieldSelectedByPattern = false;
		this._swappable = false;
		this._allowSelection = true;
		this._allowCursorChange = true;
		this._container = container;
		this._dispatcher = dispatcher;
		this._fieldContainer = fieldContainer;
		this._sprite = sprite;
		this._fieldStatus = fieldStatus;
		this._selectSprite = new PIXI.Sprite(this._fieldSelectedTexture);
		this._swappableSprite = new PIXI.Sprite(this._fieldSwappable);

		dispatcher.on(AbilityEvent.EV_NO_MORE_ABILITIES, () => this._haveAbility = false);
		dispatcher.on(AbilityEvent.EV_HAVE_MORE_ABILITIES, () => this._haveAbility = true);
		dispatcher.on(SkillEvent.EV_ENEMY_FINISHED_TURN, () => this._haveAbility = true);
		dispatcher.on(GameAlertEvent.EV_GAME_ALERT, () =>  this._allowCursorChange = false);
	}

	public addPointerListeners(hitArea: PIXI.Sprite)
	{
		hitArea.on('pointerdown', () =>
		{
			if(this.canSelect())
			{
				FieldController.touchID = "null";
				this.selectField();
			}
		});

		hitArea.on('pointerup', (e) =>
		{
			if(this._patternSelected)
			{
				this._fieldSelectedByPattern = true;
				this._dispatcher.emit(FieldEvent.EV_FIELD_PATTERN_ACTIVATING, e);
			}
			else if(this._swipeSelected)
			{
				this.selectField();
			}

			this._dispatcher.emit(PatternEvent.EV_PATTERN_DELETE);
		});

		hitArea.on('pointerover', () =>
		{
			if(this._allowSelection && !this._fieldStatus.isParalyzed && !this._fieldStatus.isStunned)
			{
				Main.cursor.pointerCursor();
			}
			this.swipeSelectField();
		});

		hitArea.on('pointermove', (e) =>
		{
			let radius = (Math.floor(hitArea.getBounds().width / 2));
			let centerPointX = hitArea.getBounds().x + radius;
			let centerPointY = hitArea.getBounds().y + radius;
			let id = String(centerPointX) + String(centerPointY);

			if((e.data.global.x - centerPointX) * (e.data.global.x - centerPointX) + (e.data.global.y - centerPointY) * (e.data.global.y - centerPointY) <= radius * radius)
			{
				if(FieldController.touchID != id)
				{
					if(this._allowSelection && this._allowCursorChange && !this._fieldStatus.isParalyzed && !this._fieldStatus.isStunned)
					{
						Main.cursor.pointerCursor();
					}
				}
			}
			else if(FieldController.touchID === id) //pointerout
			{
				Main.cursor.changeCursor();
			}
		});

		hitArea.on('touchmove', (e) => //pointerover
		{
			let radius = (Math.floor(hitArea.getBounds().width / 2));
			let centerPointX = hitArea.getBounds().x + radius;
			let centerPointY = hitArea.getBounds().y + radius;
			let id = String(centerPointX) + String(centerPointY);

			if((e.data.global.x - centerPointX) * (e.data.global.x - centerPointX) + (e.data.global.y - centerPointY) * (e.data.global.y - centerPointY) <= radius * radius)
			{
				if(FieldController.touchID != id)
				{
					this._dispatcher.emit(FieldEvent.EV_FIELD_SWIPE_SELECTION);
					this.swipeSelectField();
					FieldController.touchID = id;
				}
			}
			else if(FieldController.touchID === id) //pointerout
			{
				this._dispatcher.emit(FieldEvent.EV_FIELD_SWIPE_SELECTION);
				FieldController.touchID = "null";
			}
		});

		hitArea.on('pointerout', () =>
		{
			Main.cursor.changeCursor();
			if(this._swappable)
			{
				this._dispatcher.emit(FieldEvent.EV_FIELD_SWIPE_SELECTION);
			}
		});

		this._dispatcher.on(SkillEvent.EV_SKILL_SELECTED, () =>
		{
			this._patternSelected = true;
		});

		this._dispatcher.on(PatternEvent.EV_PATTERN_DELETE, () =>
		{
			this._patternSelected = false;
		});
	}

	private canSelect()
	{
		if(!this._haveAbility && this._allowSelection)
		{
			this._dispatcher.emit(EndTurnButtonEvent.EV_ALERT_END_TURN_BUTTON);
		}
		return this._allowSelection && this._haveAbility && !this._fieldStatus.isParalyzed && !this._fieldStatus.isStunned;
	}

	private swipeSelectField()
	{
		this._dispatcher.emit(FieldEvent.EV_FIELD_SWIPE_SELECTION);
		if(this._swappable)
		{
			this._swipeSelected = true;

			this._selectSprite.x = this._sprite.x;
			this._selectSprite.y = this._sprite.y;

			this._fieldContainer.addChild(this._selectSprite);
		}
	}

	private selectField()
	{
		if(!this._selected)
		{
			this._selected = true;

			this._selectSprite.x = this._sprite.x;
			this._selectSprite.y = this._sprite.y;

			this._fieldContainer.addChild(this._selectSprite);
			this._dispatcher.emit(FieldEvent.EV_FIELD_SELECTED);
		}
		else
		{
			this.removeSelectedField();
			this._dispatcher.emit(FieldEvent.EV_FIELD_REMOVE_SELECTION);
		}
	}

	public removeSelectedField()
	{
		this._selected = false;
		this._fieldContainer.removeChild(this._selectSprite);
	}

	public removePossibleSwap()
	{
		this._swappable = false;
		this._fieldContainer.removeChild(this._swappableSprite);
	}

	public showSwappableField(swappableWithAbility: boolean)
	{
		this._swappable = true;
		this._swappableSprite.x = this._sprite.x;
		this._swappableSprite.y = this._sprite.y;
		if(swappableWithAbility)
		{
			this._swappableSprite.texture = this._fieldSwappableWithAbility;
		}
		else
		{
			this._swappableSprite.texture = this._fieldSwappable;
		}
		this._fieldContainer.addChild(this._swappableSprite);
	}

	set selected(isSelected: boolean)
	{
		this._selected = isSelected;
	}

	get selected(): boolean
	{
		return this._selected;
	}

	get swipeSelected(): boolean
	{
		return this._swipeSelected;
	}

	set fieldSelectedByPattern(value: boolean)
	{
		this._fieldSelectedByPattern = value;
	}

	get fieldSelectedByPattern(): boolean
	{
		return this._fieldSelectedByPattern;
	}

	set allowSelection(allow: boolean)
	{
		this._allowSelection = allow;
	}

	get allowSelection(): boolean
	{
		return this._allowSelection;
	}

	public removeSelection()
	{
		this._swipeSelected = false;
		this._selected = false;
		this._fieldContainer.removeChild(this._selectSprite);
	}
}
