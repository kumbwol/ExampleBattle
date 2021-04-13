export class BooleanClass
{
	private _boolean: boolean;

	constructor(x: boolean)
	{
		this._boolean = x;
	}

	get boolean(): boolean
	{
		return this._boolean;
	}

	set boolean(x: boolean)
	{
		this._boolean = x;
	}
}
