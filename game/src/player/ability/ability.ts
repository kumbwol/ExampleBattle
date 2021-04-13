import { AbilityTypes } from "./abilityTypes";

export class Ability
{
	private _abilityType: AbilityTypes;
	private _manaCost: number;

	constructor(abilityType: AbilityTypes, manaCost: number)
	{
		this._abilityType = abilityType;
		this._manaCost = manaCost;
	}

	public get abilityType(): AbilityTypes
	{
		return this._abilityType;
	}

	public set abilityType(abilityType)
	{
		this._abilityType = abilityType;
	}

	public get manaCost(): number
	{
		return this._manaCost;
	}

	public set manaCost(manaCost: number)
	{
		this._manaCost = manaCost;
	}
}
