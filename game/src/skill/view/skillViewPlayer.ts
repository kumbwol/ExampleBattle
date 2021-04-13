import * as PIXI from "pixi.js";
import { Main } from "../../main";
import { Easing, Tweener } from "pixi-tweener";
import { TableEvent } from "../../battle/table/event/tableEvent";
import { SkillEvent } from "../event/skillEvent";
import { PlayerSkill } from "../controller/playerSkill";
import { EndTurnButtonEvent } from "../../battle/endTurnButton/event/endTurnButtonEvent";
import { LogicEvent } from "../../battle/logic/event/logicEvent";
import { AbilityTypes } from "../../player/ability/abilityTypes";
import { RankButtonEvent } from "../rank/event/rankButtonEvent";
import { InventorySkillViewPlayer } from "../../inventory/InventorySkillViewPlayer";

export class SkillViewPlayer extends InventorySkillViewPlayer
{
	constructor(dispatcher: PIXI.Container, container: PIXI.Container, position: number, skill: PlayerSkill[], rank: number = 0)
	{
		super(dispatcher, container, position, skill, rank);

		this._dispatcher.on(TableEvent.EV_START_CASCADE, () =>
		{
			this.disableSkill();
		});

		this._dispatcher.on(EndTurnButtonEvent.EV_END_TURN, () =>
		{
			this.disableSkill();
		});

		this._dispatcher.on(LogicEvent.EV_ENABLE_SPECIAL_SKILL_SELECTION, (abilityType: AbilityTypes) =>
		{
			this._abilityType = abilityType;
			this._allowSkillSelectionWithAbility = true;
			this._allowSelection = false;
		});

		this._dispatcher.on(LogicEvent.EV_DISABLE_SPECIAL_SKILL_SELECTION, () =>
		{
			this._allowSkillSelectionWithAbility = false;
			this._allowSelection = true;
		});
	}

	public upgradeSkill()
	{
		if(this._rank + 1 < this._fullSkill.length)
		{
			this._rank++;
		}
		else
		{
			this._rank = 0;
		}

		this._dispatcher.emit(RankButtonEvent.EV_RANK_UPDATED, this._position, this._rank + 1);

		this._skillHolder.removeChildAt(3);
		this.updateSkill(this._fullSkill[this._rank]);
	}

	public activate()
	{
		if(!this._skill.pattern.isOriginalPattern())
		{
			this._skill.pattern.reset();
			this.removePattern();
		}
	}

	protected addPatternSelectEvent(hitArea: PIXI.Graphics, skill: PlayerSkill)
	{
		hitArea.interactive = true;
		hitArea.on("pointerdown", (e) =>
		{
			this._skill = skill;
			this._isSelected = true;

			if(this._allowSelection)
			{
				SkillViewPlayer._lastActivatedSkillID = this._position;
				this._dispatcher.emit(SkillEvent.EV_SKILL_SELECTED, e, skill);
			}
			else if(this._allowSkillSelectionWithAbility)
			{
				if(this._abilityType === AbilityTypes.rotateLeft || this._abilityType === AbilityTypes.rotateRight)
				{
					if(skill.rotate(this._abilityType))
					{
						SkillViewPlayer._lastTimeUsedAbilityID = this._position;
						this._lastTimeUsedAbilityType = this._abilityType;
						this.removePattern();
						this._dispatcher.emit(SkillEvent.EV_SKILL_SELECTED_WITH_ABILITY, skill);
					}
				}
				else if(this._abilityType === AbilityTypes.mirrorVertically || this._abilityType === AbilityTypes.mirrorHorizontally)
				{
					if(skill.mirror(this._abilityType))
					{
						SkillViewPlayer._lastTimeUsedAbilityID = this._position;
						this._lastTimeUsedAbilityType = this._abilityType;
						this.removePattern();
						this._dispatcher.emit(SkillEvent.EV_SKILL_SELECTED_WITH_ABILITY, skill);
					}
				}
			}
		});

		hitArea.on("pointermove", (e) =>
		{
			if(e.data.global.x > hitArea.getGlobalPosition().x && e.data.global.x < (hitArea.getGlobalPosition().x + hitArea.width) && e.data.global.y > hitArea.getGlobalPosition().y && e.data.global.y < (hitArea.getGlobalPosition().y + hitArea.height))
			{
				if(this._allowCursorChange)
				{
					Main.cursor.pointerCursor();
				}
			}
		});

		hitArea.on("pointerover", (e) =>
		{
			if(this._allowSelection)
			{
				Main.cursor.pointerCursor();
			}
		});

		hitArea.on("pointerout", (e) =>
		{
			if(this._allowSelection)
			{
				Main.cursor.changeCursor();
			}
		});
	}

	public redoAbility()
	{
		switch(this._lastTimeUsedAbilityType)
		{
			case AbilityTypes.rotateLeft:
				this._skill.rotate(AbilityTypes.rotateRight);
				this.removePattern();
				break;

			case AbilityTypes.rotateRight:
				this._skill.rotate(AbilityTypes.rotateLeft);
				this.removePattern();
				break;

			case AbilityTypes.mirrorVertically:
				this._skill.mirror(AbilityTypes.mirrorVertically);
				this.removePattern();
				break;

			case AbilityTypes.mirrorHorizontally:
				this._skill.mirror(AbilityTypes.mirrorHorizontally);
				this.removePattern();
				break;
		}
	}

	get lastTimeUsedAbilityID(): number
	{
		return SkillViewPlayer._lastTimeUsedAbilityID;
	}

	get lastTimeActivatedSkillID(): number
	{
		return SkillViewPlayer._lastActivatedSkillID;
	}

	protected disableAnim(element)
	{
		Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 0.6
			}
		)
	}

	protected enableAnim(element)
	{
		Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 0
			}
		)
	}
}
