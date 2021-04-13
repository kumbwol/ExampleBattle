import { ChanceTypes } from "./chanceTypes";

export class Chance
{
	private _chanceType: ChanceTypes;
	private _value: number;

	constructor(chanceType: ChanceTypes, value: number)
	{
		this._chanceType = chanceType;
		this._value = value;
	}

	public calculateConfidenceChances(playerShield: number, enemyShield: number)
	{
		if(playerShield < enemyShield)
		{
			this._value = 100;
		}
		else
		{
			this._value = 0;
		}
	}

	public calculateStuckChances(nonParalyzedFields: number, paralyzedFields: number)
	{
		this._value = Math.floor(100 * paralyzedFields/(nonParalyzedFields + paralyzedFields));
	}

	public calculateRageChances(hp: number, maxHp: number)
	{
		this._value = 100 - Math.floor(100 * hp/maxHp);
	}

	public calculateSpellChances(mp: number, cost: number)
	{
		if(mp >= cost)
		{
			this._value = 100;
		}
		else
		{
			this._value = 0;
		}
	}

	get chanceType(): ChanceTypes
	{
		return this._chanceType;
	}

	get value(): number
	{
		return this._value;
	}
}
