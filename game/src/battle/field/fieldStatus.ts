export class FieldStatus
{
	private _stunned: boolean;
	private _paralyzed: boolean;

	constructor(stunned: boolean, paralyzed: boolean)
	{
		this._stunned = stunned;
		this._paralyzed = paralyzed;
	}

	set paralyze(paralyzed: boolean)
	{
		this._paralyzed = paralyzed;
	}

	set stun(stun: boolean)
	{
		this._stunned = stun;
	}

	get isParalyzed()
	{
		return this._paralyzed;
	}

	get isStunned()
	{
		return this._stunned;
	}
}
