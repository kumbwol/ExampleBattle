export class GameEvent
{
	private readonly _name: string;
	private readonly _args: any;
	private readonly _args2: any;

	constructor(name: string, args: any, args2: any = null)
	{
		this._name = name;
		this._args = args;
		this._args2 = args2;
	}

	public get name(): string
	{
		return this._name;
	}

	public get args(): any
	{
		return this._args;
	}

	public get args2(): any
	{
		return this._args2;
	}
}
