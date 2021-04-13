export class NumberClass
{
	private _number: number;

	constructor(x: number)
	{
		this._number = x;
	}

	get number(): number
	{
		return this._number;
	}

	set number(x: number)
	{
		this._number = x;
	}
}
