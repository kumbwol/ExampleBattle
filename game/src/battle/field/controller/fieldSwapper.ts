import { Field } from "../field";
import { Tweener } from "pixi-tweener";
import { Easing } from "pixi-tweener";
import { FieldEvent } from "../event/fieldEvent";
import { TableEvent } from "../../table/event/tableEvent";
import { BooleanClass } from "../../../booleanClass";

export class FieldSwapper
{
	private _table: Field[][];
	private _field1: Field;
	private _field2: Field;
	private _fixIDsOnce: boolean;
	private _container: PIXI.Container;
	private _dispatcher: PIXI.Container;
	private _selectedX: number[];
	private _selectedY: number[];

	constructor(dispatcher: PIXI.Container, table: Field[][], container: PIXI.Container)
	{
		this._table = table;
		this._fixIDsOnce = false;
		this._container = container;
		this._dispatcher = dispatcher;
		this._selectedX = [];
		this._selectedY = [];
		this.addEventListener();
	}

	private addEventListener()
	{
		this._dispatcher.on(FieldEvent.EV_FIELD_SELECTED, () =>
		{
			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					if(this.canSwap())
					{
						this.swapFields(false);
					}
				}
			}
		});

		this._dispatcher.on(FieldEvent.EV_FIELD_RESWAP, (redoAbility: BooleanClass) =>
		{
			if(!redoAbility.boolean)
			{
				for(let i=0; i<this._table.length; i++)
				{
					for(let j=0; j<this._table[i].length; j++)
					{
						this._table[i][j].fieldController.fieldSelectedByPattern = false;
						this._table[i][j].fieldController.removeSelection();
						this._table[i][j].fieldController.removePossibleSwap();
					}
				}

				this._table[this._selectedY[0]][this._selectedX[0]].fieldController.selected = true;
				this._table[this._selectedY[1]][this._selectedX[1]].fieldController.selected = true;

				this.swapFields(true);
			}
		});
	}

	private canSwap()
	{
		let selections = 0;

		for(let i=0; i<this._table.length; i++)
		{
			for(let j=0; j<this._table[i].length; j++)
			{
				if(this._table[i][j].fieldController.selected)
				{
					selections++;
				}
			}
		}

		return selections === 2;
	}

	private swapFields(isReswap: boolean)
	{
		for(let i=0; i<this._table.length; i++)
		{
			for(let j=0; j<this._table[i].length; j++)
			{
				this._table[i][j].fieldController.allowSelection = false;
			}
		}

		this._dispatcher.emit(TableEvent.EV_START_SWAP);
		this._dispatcher.emit(FieldEvent.EV_FIELD_REMOVE_SELECTION);

		let field1: Field;
		let field2: Field;
		let x1: number;
		let y1: number;
		let x2: number;
		let y2: number;

		for(let i=0; i<this._table.length; i++)
		{
			for(let j=0; j<this._table[i].length; j++)
			{
				if(this._table[i][j].fieldController.selected)
				{
					if(field1 === undefined)
					{
						field1 = this._table[i][j];
						x1 = j;
						y1 = i;
					}
					else
					{
						field2 = this._table[i][j];
						x2 = j;
						y2 = i;
					}
				}
			}
		}

		if(this.isDiagonalSwap(x1, y1, x2, y2))
		{
			this._dispatcher.emit(FieldEvent.EV_DIAGONAL_SWAP, isReswap);
		}

		this._selectedX[0] = x1;
		this._selectedY[0] = y1;
		this._selectedX[1] = x2;
		this._selectedY[1] = y2;

		this._field1 = field1;
		this._field2 = field2;

		this._field1.fieldController.removeSelection();
		this._field2.fieldController.removeSelection();

		this.moveField(field1.fieldContainer, field2.fieldContainer.x, field2.fieldContainer.y);
		this.moveField(field2.fieldContainer, field1.fieldContainer.x, field1.fieldContainer.y).then(() => this._dispatcher.emit(FieldEvent.EV_FIELD_SWAPPED, isReswap));

		this.fixIDs(x1, y1, x2, y2);
	}

	private isDiagonalSwap(x1: number, y1: number, x2: number, y2: number)
	{
		return (x1 !== x2 && y1 !== y2);
	}

	private async moveField(element: PIXI.Container, x: number, y: number)
	{
		await Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				x: x,
				y: y
			}
		);
	}

	private fixIDs(x1: number, y1: number, x2: number, y2: number)
	{
		let f1: Field[];
		let f2: Field[];

		if(y1 === y2)
		{
			f1 = this._table[y1].splice(x1, 1);
			f2 = this._table[y2].splice(x2 - 1, 1);
		}
		else
		{
			f1 = this._table[y1].splice(x1, 1);
			f2 = this._table[y2].splice(x2, 1);
		}

		this._table[y1].splice(x1, 0, f2[0]);
		this._table[y2].splice(x2, 0, f1[0]);
	}

	private logFields()
	{
		console.log("\n");
		console.log("\n");
		console.log("\n");
		for(let i=0; i<this._table.length; i++)
		{
			let string = "";
			for(let j=0; j<this._table[i].length; j++)
			{
				string += this._table[i][j].fieldController.allowSelection;
				//string += this._table[i][j].fieldController.selected;
				string += " ";
			}
			console.log(string);
			console.log("\n");
		}
	}
}
