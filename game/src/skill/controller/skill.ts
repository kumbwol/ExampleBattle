import { Effect, IEffect } from "../effect/effect";

export interface ISkill
{
	primaryEffect: IEffect;
	secondaryEffect: IEffect;
	name: string;
}

export class Skill
{
	protected readonly _primaryEffect: Effect;
	protected readonly _secondaryEffect: Effect;
	protected readonly _name: string;

	constructor(skillData: ISkill)
	{
		this._name = skillData.name;
		this._primaryEffect = new Effect(skillData.primaryEffect);
		this._secondaryEffect = new Effect(skillData.secondaryEffect);
	}

	get name(): string
	{
		return this._name;
	}

	get primaryEffect(): Effect
	{
		return this._primaryEffect;
	}

	get secondaryEffect(): Effect
	{
		return this._secondaryEffect;
	}

	get skillData(): ISkill
	{
		return ({
			primaryEffect: this._primaryEffect.effectData,
			secondaryEffect: this._secondaryEffect.effectData,
			name: this._name
		});
	}
}
