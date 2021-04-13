import { ISkill, Skill } from "./skill";
import { Pattern } from "../pattern/pattern";
import { IEffect } from "../effect/effect";
import { AbilityTypes } from "../../player/ability/abilityTypes";
import { FieldTypes } from "../../battle/field/fieldTypes";

export interface IPlayerSkill
{
	pattern: FieldTypes[][];
	primaryEffect: IEffect;
	secondaryEffect: IEffect;
	name: string;
}

export class PlayerSkill extends Skill
{
	private readonly _pattern: Pattern;

	constructor(playerSkillData: IPlayerSkill)
	{
		const skillData: ISkill = ({
			primaryEffect: playerSkillData.primaryEffect,
			secondaryEffect: playerSkillData.secondaryEffect,
			name: playerSkillData.name
		});
		super(skillData);
		this._pattern = new Pattern(playerSkillData.pattern);
	}

	get pattern(): Pattern
	{
		return this._pattern;
	}

	public rotate(abilityType: AbilityTypes)
	{
		return this._pattern.rotate(abilityType);
	}

	public mirror(abilityType: AbilityTypes)
	{
		return this._pattern.mirror(abilityType);
	}

	public get playerSkillData(): IPlayerSkill
	{
		return ({
			pattern: this._pattern.pattern,
			primaryEffect: this._primaryEffect.effectData,
			secondaryEffect: this._secondaryEffect.effectData,
			name: this._name
		});
	}
}
