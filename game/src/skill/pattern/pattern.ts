import { FieldTypes } from "../../battle/field/fieldTypes";
import { AbilityTypes } from "../../player/ability/abilityTypes";

export class Pattern
{
	private _pattern: FieldTypes[][];
	private _originalPattern: FieldTypes[][];

	constructor(pattern: FieldTypes[][])
	{
		this._originalPattern = JSON.parse(JSON.stringify(pattern));
		this._pattern = pattern;
		this.trimEmptyRowsFromPattern(pattern);
		this.trimEmptyColumnsFromPattern(pattern);

		this.trimEmptyRowsFromPattern(this._originalPattern);
		this.trimEmptyColumnsFromPattern(this._originalPattern);
	}

	private trimEmptyRowsFromPattern(pattern: FieldTypes[][])
	{
		for(let i=0; i<pattern.length; i++)
		{
			let canRemoveRow = true;
			for(let j=0; j<pattern[i].length; j++)
			{
				if(i === 1 && pattern.length === 3)
				{
					canRemoveRow = false;
				}
				else
				{
					if(pattern[i][j] !== FieldTypes.empty) canRemoveRow = false;
				}
			}
			if(canRemoveRow)
			{
				pattern.splice(i, 1);
				i--;
				this.trimEmptyRowsFromPattern(pattern);
			}
		}
	}

	private trimEmptyColumnsFromPattern(pattern: FieldTypes[][])
	{
		for(let i=0; i<pattern[0].length; i++)
		{
			let canRemoveColumn = true;
			for(let j=0; j<pattern.length; j++)
			{
				if(i === 1 && pattern[0].length === 3)
				{
					canRemoveColumn = false;
				}
				else
				{
					if(pattern[j][i] !== FieldTypes.empty) canRemoveColumn = false;
				}
			}
			if(canRemoveColumn)
			{
				for(let j=0; j<pattern.length; j++)
				{
					pattern[j].splice(i, 1);
				}
				i--;
				this.trimEmptyColumnsFromPattern(pattern);
			}
		}
	}

	get pattern(): FieldTypes[][]
	{
		return this._pattern;
	}

	public reset()
	{
		this._pattern = JSON.parse(JSON.stringify(this._originalPattern));
	}

	public isOriginalPattern()
	{
		if(this.pattern.length !== this._originalPattern.length)
		{
			return false;
		}

		for(let i=0; i<this.pattern.length; i++)
		{
			if(this.pattern[i].length !== this._originalPattern[i].length)
			{
				return false;
			}

			for(let j=0; j<this.pattern[i].length; j++)
			{
				if(this.pattern[i][j] !== this._originalPattern[i][j])
				{
					return false
				}
			}
		}
		return true;
	}

	private expandPatternTo3By3()
	{
		for(let i=this.pattern.length; i<3; i++)
		{
			this.pattern.push([FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]);
		}

		for(let i=0; i<this.pattern.length; i++)
		{
			for(let j=this.pattern[i].length; j<3; j++)
			{
				this.pattern[i].push(FieldTypes.empty);
			}
		}
	}

	public mirror(abilityType: AbilityTypes): boolean
	{
		this.expandPatternTo3By3();

		let new_pattern = JSON.parse(JSON.stringify(this.pattern));

		if(abilityType === AbilityTypes.mirrorVertically)
		{
			new_pattern[0][0] = this.pattern[0][2];
			new_pattern[1][0] = this.pattern[1][2];
			new_pattern[2][0] = this.pattern[2][2];

			new_pattern[0][2] = this.pattern[0][0];
			new_pattern[1][2] = this.pattern[1][0];
			new_pattern[2][2] = this.pattern[2][0];
		}
		else if(abilityType === AbilityTypes.mirrorHorizontally)
		{
			new_pattern[0][0] = this.pattern[2][0];
			new_pattern[0][1] = this.pattern[2][1];
			new_pattern[0][2] = this.pattern[2][2];

			new_pattern[2][0] = this.pattern[0][0];
			new_pattern[2][1] = this.pattern[0][1];
			new_pattern[2][2] = this.pattern[0][2];
		}

		this.trimEmptyRowsFromPattern(new_pattern);
		this.trimEmptyColumnsFromPattern(new_pattern);

		this.trimEmptyRowsFromPattern(this.pattern);
		this.trimEmptyColumnsFromPattern(this.pattern);

		let same = true;

		for(let i=0; i<new_pattern.length; i++)
		{
			for(let j=0; j<this.pattern[i].length; j++)
			{
				if(new_pattern[i][j] !== this.pattern[i][j])
				{
					same = false;
				}
			}
		}

		if(same)
		{
			return false;
		}
		else
		{
			this._pattern = JSON.parse(JSON.stringify(new_pattern));
			return true;
		}
	}

	public rotate(abilityType: AbilityTypes): boolean
	{
		this.expandPatternTo3By3();

		let new_pattern = JSON.parse(JSON.stringify(this.pattern));

		if(abilityType === AbilityTypes.rotateRight)
		{
			new_pattern[0][0] = this.pattern[2][0];
			new_pattern[0][2] = this.pattern[0][0];
			new_pattern[2][2] = this.pattern[0][2];
			new_pattern[2][0] = this.pattern[2][2];

			new_pattern[0][1] = this.pattern[1][0];
			new_pattern[1][2] = this.pattern[0][1];
			new_pattern[2][1] = this.pattern[1][2];
			new_pattern[1][0] = this.pattern[2][1];
		}
		else if(abilityType === AbilityTypes.rotateLeft)
		{
			new_pattern[0][0] = this.pattern[0][2];
			new_pattern[0][2] = this.pattern[2][2];
			new_pattern[2][2] = this.pattern[2][0];
			new_pattern[2][0] = this.pattern[0][0];

			new_pattern[0][1] = this.pattern[1][2];
			new_pattern[1][2] = this.pattern[2][1];
			new_pattern[2][1] = this.pattern[1][0];
			new_pattern[1][0] = this.pattern[0][1];
		}

		this.trimEmptyRowsFromPattern(new_pattern);
		this.trimEmptyColumnsFromPattern(new_pattern);

		this.trimEmptyRowsFromPattern(this.pattern);
		this.trimEmptyColumnsFromPattern(this.pattern);

		let same = true;

		if(new_pattern.length !== this.pattern.length)
		{
			same = false;
		}
		else
		{
			for(let i=0; i<new_pattern.length; i++)
			{
				if(new_pattern[i].length !== this.pattern[i].length)
				{
					same = false;
					break;
				}
				for(let j=0; j<new_pattern[i].length; j++)
				{
					if(new_pattern[i][j] !== this.pattern[i][j])
					{
						same = false;
					}
				}
			}
		}

		if(same)
		{
			return false;
		}
		else
		{
			this._pattern = JSON.parse(JSON.stringify(new_pattern));
			return true;
		}
	}
}
