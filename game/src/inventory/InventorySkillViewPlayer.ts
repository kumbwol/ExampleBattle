import * as PIXI from "pixi.js";
import { SkillView } from "../skill/view/skillView";
import { PlayerSkill } from "../skill/controller/playerSkill";
import { AbilityTypes } from "../player/ability/abilityTypes";
import { RankButtonEvent } from "../skill/rank/event/rankButtonEvent";
import { FieldTypes } from "../battle/field/fieldTypes";
import { HitAreaCreator } from "../hitAreaCreator";
import { SkillEvent } from "../skill/event/skillEvent";
import { Main } from "../main";
import { Effect } from "../skill/effect/effect";

export class InventorySkillViewPlayer extends SkillView
{
	protected _allowSelection: boolean;
	protected _allowSkillSelectionWithAbility: boolean;
	protected _isSelected: boolean;
	protected _skill: PlayerSkill;
	protected _fullSkill: PlayerSkill[];
	protected _abilityType: AbilityTypes;
	protected static _lastTimeUsedAbilityID: number;
	protected static _lastActivatedSkillID: number;
	protected _lastTimeUsedAbilityType: AbilityTypes;
	protected readonly _position: number;
	protected _rank: number;

	constructor(dispatcher: PIXI.Container, container: PIXI.Container, position: number, skill: PlayerSkill[], rank: number = 0)
	{
		super(dispatcher, container, position, skill, rank);
		this._rank = 0;
		this._fullSkill = skill;
		this._allowSelection = true;
		this._allowSkillSelectionWithAbility = false;
		this._position = position;

		this._dispatcher.on(RankButtonEvent.EV_RANK_BUTTON_CLICK, () =>
		{
			this._allowCursorChange = false;
			this.disableSkill();
		});
	}

	get skillHolder(): PIXI.Container
	{
		return this._skillHolder;
	}

	get rank(): number
	{
		return this._rank;
	}

	protected createSkill(container: PIXI.Container, position: number, skill: PlayerSkill)
	{
		super.createSkill(container, position, skill);

		if(skill !== undefined)
		{
			let miniPattern = this.createPattern(skill);
			this._skillHolder.addChild(miniPattern);
		}
	}

	public updateSkill(skill: PlayerSkill)
	{
		super.updateSkill(skill);

		if(this._skillHolder.children.length > 4)
		{
			this._skillHolder.removeChildren(4);
		}

		if(skill !== undefined)
		{
			let miniPattern = this.createPattern(skill);
			this._skillHolder.addChild(miniPattern);
		}
	}

	protected createMiniField(borderSize: number, type: FieldTypes): PIXI.Graphics
	{
		let field = new PIXI.Graphics;
		let color;

		switch(type)
		{
			case FieldTypes.magic: color = 0x0000ff; break;
			case FieldTypes.attack: color = 0xff0000; break;
			case FieldTypes.joker: color = 0xa34aa2; break;
			case FieldTypes.move: color = 0x22b14c; break;
			case FieldTypes.defense: color = 0xefe4b0; break;
			case FieldTypes.empty: field.alpha = 0; break;
		}

		field.beginFill(0x000000);
		field.drawRect(0, 0,28,28);
		field.endFill();
		field.beginFill(color);
		field.drawRect(borderSize, borderSize,26,26);
		field.endFill();

		return field;
	}

	protected createPattern(skill: PlayerSkill): PIXI.Container
	{
		let container = new PIXI.Container;
		const pattern = skill.pattern;
		const offsetX = 235;
		const offsetY = 3;
		const borderSize = 1;

		let miniFieldWidth;
		let miniFieldHeight;

		for(let i=0; i<pattern.pattern.length; i++)
		{
			for(let j=0; j<pattern.pattern[i].length; j++)
			{
				let miniField = this.createMiniField(borderSize, pattern.pattern[i][j]);
				miniField.x = j * miniField.width - j;
				miniField.y = i * miniField.height - i;

				if(pattern.pattern.length === 1)
				{
					miniField.y += miniField.height - 1;
				}
				else if(pattern.pattern.length === 2)
				{
					miniField.y += Math.floor(miniField.height / 2);
				}

				if(pattern.pattern[i].length === 1)
				{
					miniField.x += miniField.width - 1;
				}
				else if(pattern.pattern[i].length === 2)
				{
					miniField.x += Math.floor(miniField.width / 2);
				}

				miniFieldWidth = miniField.width;
				miniFieldHeight = miniField.height;
				container.addChild(miniField);
			}
		}

		container.x = offsetX;
		container.y = offsetY;

		let hitArea = new HitAreaCreator().hitAreaRectangle(0, 0, miniFieldWidth * 3 - 2, miniFieldHeight * 3 - 2);
		this.addPatternSelectEvent(hitArea, skill);
		//hitArea.interactive = true;
		container.addChild(hitArea);

		return container;
	}

	protected addPatternSelectEvent(hitArea: PIXI.Graphics, skill: PlayerSkill)
	{

	}

	protected removePattern()
	{
		if(this._skillHolder.children.length > 3)
		{
			this._skillHolder.removeChildAt(4);
			this._skillHolder.addChild(this.createPattern(this._skill));
		}
	}

	protected addSkillExplainerEvent(effect: Effect,  hitArea: PIXI.Graphics)
	{
		hitArea.on("pointerdown", () =>
		{
			if(this._allowSelection)
			{
				this._dispatcher.emit(SkillEvent.EV_SHOW_EFFECT_EXPLAINER, effect);
			}
		});

		hitArea.on("pointerover", () =>
		{
			if(this._allowSelection)
			{
				Main.cursor.pointerCursor();
			}
		});

		hitArea.on("pointerout", () =>
		{
			if(this._allowSelection)
			{
				Main.cursor.changeCursor();
			}
		});
	}

	public disableSkill()
	{
		this._allowSelection = false;
		if(this._primaryEffectHitArea) this._primaryEffectHitArea.interactive = false;
		if(this._secondaryEffectHitArea) this._secondaryEffectHitArea.interactive = false;
		this.disableAnim(this._disabler);
	}

	protected disableAnim(element)
	{

	}

	public enableSkill()
	{
		this._allowSelection = true;
		if(this._primaryEffectHitArea) this._primaryEffectHitArea.interactive = true;
		if(this._secondaryEffectHitArea) this._secondaryEffectHitArea.interactive = true;
		this.enableAnim(this._disabler);
	}

	protected enableAnim(element)
	{

	}

	set isSelected(isSelected)
	{
		this._isSelected = isSelected;
	}

	get isSelected()
	{
		return this._isSelected;
	}
}
