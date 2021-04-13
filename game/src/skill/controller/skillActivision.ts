import { FieldEvent } from "../../battle/field/event/fieldEvent";
import { Field } from "../../battle/field/field";
import { PatternField } from "../../battle/pattern/patternField";
import { TableEvent } from "../../battle/table/event/tableEvent";
import { FieldTypes } from "../../battle/field/fieldTypes";
import { PatternEvent } from "../../battle/panel/event/patternEvent";
import { SkillEvent } from "../event/skillEvent";
import { PlayerSkill } from "./PlayerSkill";
import { EffectTypes } from "../effect/effectTypes";

export class SkillActivision
{
	private _dispatcher: PIXI.Container;
	private _pattern: FieldTypes[][];
	private _waitCascadeBeforeActivision: boolean;

	constructor(dispatcher: PIXI.Container, table: Field[][], pattern: PatternField[][])
	{
		this._dispatcher = dispatcher;
		this._waitCascadeBeforeActivision = false;
		this.addEventListener(dispatcher, table, pattern);
	}

	private addEventListener(dispatcher: PIXI.Container, table: Field[][], pattern: PatternField[][])
	{
		dispatcher.on(SkillEvent.EV_SKILL_SELECTED, (e, skill: PlayerSkill) =>
		{
			this._waitCascadeBeforeActivision = (skill.primaryEffect.effectType === EffectTypes.jokerform || (skill.secondaryEffect.effectType === EffectTypes.jokerform && skill.primaryEffect.effectType === EffectTypes.noEffect) ||
				skill.primaryEffect.effectType === EffectTypes.attackform || (skill.secondaryEffect.effectType === EffectTypes.attackform && skill.primaryEffect.effectType === EffectTypes.noEffect) ||
				skill.primaryEffect.effectType === EffectTypes.magicform || (skill.secondaryEffect.effectType === EffectTypes.magicform && skill.primaryEffect.effectType === EffectTypes.noEffect) ||
				skill.primaryEffect.effectType === EffectTypes.moveform || (skill.secondaryEffect.effectType === EffectTypes.moveform && skill.primaryEffect.effectType === EffectTypes.noEffect) ||
				skill.primaryEffect.effectType === EffectTypes.defenseform || (skill.secondaryEffect.effectType === EffectTypes.defenseform && skill.primaryEffect.effectType === EffectTypes.noEffect) ||
				skill.primaryEffect.effectType === EffectTypes.paralyze || (skill.secondaryEffect.effectType === EffectTypes.paralyze && skill.primaryEffect.effectType === EffectTypes.noEffect) ||
				skill.primaryEffect.effectType === EffectTypes.poison || (skill.secondaryEffect.effectType === EffectTypes.poison && skill.primaryEffect.effectType === EffectTypes.noEffect) ||
				skill.primaryEffect.effectType === EffectTypes.stun || (skill.secondaryEffect.effectType === EffectTypes.stun && skill.primaryEffect.effectType === EffectTypes.noEffect));
			this._pattern = skill.pattern.pattern;
		});

		dispatcher.on(FieldEvent.EV_FIELD_PATTERN_ACTIVATING, () =>
		{
			this.canActivateSkill(table, this._pattern);
		});

		dispatcher.on(TableEvent.EV_FINISHED_CASCADE, (isSkillActivision: boolean) =>
		{
			if(isSkillActivision)
			{
				this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_STARTED);
			}
		});
	}

	private canActivateSkill(table: Field[][], pattern: FieldTypes[][]): boolean
	{
		for(let i=0; i<table.length; i++)
		{
			for(let j=0; j<table[i].length; j++)
			{
				if(table[i][j].fieldController.fieldSelectedByPattern)
				{
					for(let k=0; k<pattern.length; k++)
					{
						for(let l=0; l<pattern[k].length; l++)
						{
							if(!this.insideTheTable(i, j, pattern, table))
							{
								table[i][j].fieldController.fieldSelectedByPattern = false;
								this._dispatcher.emit(PatternEvent.EV_ALLOW_PATTERN_SELECTION);
								return false;
							}
							else if(table[i+k][j+l].status.isStunned && pattern[k][l] !== FieldTypes.empty)
							{
								table[i][j].fieldController.fieldSelectedByPattern = false;
								this._dispatcher.emit(PatternEvent.EV_ALLOW_PATTERN_SELECTION);
								return false;
							}
							else if(table[i+k][j+l].fieldType !== pattern[k][l] && pattern[k][l] !== FieldTypes.empty)
							{
								if((pattern[k][l] !== FieldTypes.joker || table[i+k][j+l].fieldType === FieldTypes.empty) && table[i+k][j+l].fieldType !== FieldTypes.joker)
								{
									table[i][j].fieldController.fieldSelectedByPattern = false;
									this._dispatcher.emit(PatternEvent.EV_ALLOW_PATTERN_SELECTION);
									return false;
								}
							}
						}
					}
				}
			}
		}

		this.removeFields(table, pattern);
		this._dispatcher.emit(TableEvent.EV_START_CASCADE, this._waitCascadeBeforeActivision);
		if(!this._waitCascadeBeforeActivision)
		{
			this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_STARTED);
		}
		return true;
	}

	private insideTheTable(patternY: number, patternX: number, pattern: FieldTypes[][], table: Field[][]): boolean
	{
		return (patternY + pattern.length <= table.length && patternX + pattern[0].length <= table[0].length)
	}

	private removeFields(table: Field[][], pattern: FieldTypes[][])
	{
		for(let i=0; i<table.length; i++)
		{
			for(let j=0; j<table[i].length; j++)
			{
				if(table[i][j].fieldController.fieldSelectedByPattern)
				{
					table[i][j].fieldController.fieldSelectedByPattern = false;
					for(let k=0; k<pattern.length; k++)
					{
						for(let l=0; l<pattern[k].length; l++)
						{
							if(pattern[k][l] !== FieldTypes.empty)
							{
								table[i+k][j+l].makeFieldEmpty();
							}
						}
					}
				}
			}
		}
	}

	private logFields(table: Field[][])
	{
		console.log("\n");
		console.log("\n");
		console.log("\n");
		for(let i=0; i<9; i++)
		{
			let string = "";
			for(let j=0; j<9; j++)
			{
				string += table[i][j].fieldType;
				string += " ";
			}
			console.log(string);
			console.log("\n");
		}
	}
}
