import { EffectTypes } from "./effectTypes";
import { EffectView } from "./view/effectView";

export interface IEffect
{
	effectType: EffectTypes;
	effectValue: number;
	poisonDamage?: number;
}

export class Effect
{
	private readonly _effectType: EffectTypes;
	private readonly _effectValue: number;
	private readonly _poisonDamage: number;
	private readonly _effectView: EffectView;

	constructor(effectData: IEffect)
	{
		this._effectType = effectData.effectType;
		this._effectValue = effectData.effectValue;
		this._poisonDamage = effectData.poisonDamage;
		this._effectView = new EffectView(effectData.effectType)
	}

	get effectView(): EffectView
	{
		return this._effectView;
	}

	get effectType(): EffectTypes
	{
		return this._effectType;
	}

	get effectValue(): number
	{
		return this._effectValue;
	}

	get poisonDamage(): number
	{
		return this._poisonDamage;
	}

	get effectData(): IEffect
	{
		return ({
			effectType: this._effectType,
			effectValue: this._effectValue,
			poisonDamage: this._poisonDamage
		});
	}
}
