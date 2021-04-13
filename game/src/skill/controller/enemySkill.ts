import { ISkill, Skill } from "./skill";
import { IEffect } from "../effect/effect";
import { Chance } from "../../enemy/chance/chance";

export interface IEnemySkill
{
	chance: Chance;
	primaryEffect: IEffect;
	secondaryEffect: IEffect;
	name: string;
}

export class EnemySkill extends Skill
{
	private readonly _chance: Chance;
	private _active: boolean;

	constructor(enemySkillData: IEnemySkill)
	{
		const skillData: ISkill = ({
			primaryEffect: enemySkillData.primaryEffect,
			secondaryEffect: enemySkillData.secondaryEffect,
			name: enemySkillData.name
		});
		super(skillData);
		this._chance = enemySkillData.chance;
		this._active = false;
	}

	get active(): boolean
	{
		return this._active;
	}

	set active(isActive: boolean)
	{
		this._active = isActive;
	}

	get chance(): Chance
	{
		return this._chance;
	}
}
