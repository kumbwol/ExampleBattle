import { Field } from "../field";
import { FieldEvent } from "../event/fieldEvent";
import { AbilityEvent } from "../../ability/event/abilityEvent";

export class FieldPossibleSwaps
{
	private _table: Field[][];
	private _container: PIXI.Container;
	private _dispatcher: PIXI.Container;

	private _diagonalSwapSelected: boolean;
	private _knightSwapSelected: boolean;
	private _fieldSelected: boolean;

	constructor(dispatcher: PIXI.Container, table: Field[][], container: PIXI.Container)
	{
		this._table = table;
		this._container = container;
		this._dispatcher = dispatcher;
		this._diagonalSwapSelected = false;
		this._knightSwapSelected = false;
		this._fieldSelected = false;
		this.addSelectEventListener();
		this.addRemoveSelectEventListener();
		this.addSwipeSelectEventListener();

		dispatcher.on(AbilityEvent.EV_KNIGHT_SWAP_SELECTED, ()=>
		{
			this._knightSwapSelected = true;
			if(this._fieldSelected)
			{
				this.showPossibleSwaps();
			}
		});

		dispatcher.on(AbilityEvent.EV_DIAGONAL_SWAP_SELECTED, ()=>
		{
			this._diagonalSwapSelected = true;
			if(this._fieldSelected)
			{
				this.showPossibleSwaps();
			}
		});

		dispatcher.on(AbilityEvent.EV_DIAGONAL_SWAP_STOPPED, ()=>
		{
			this._diagonalSwapSelected = false;
			if(this._fieldSelected)
			{
				this.showPossibleSwaps();
			}
		});

		dispatcher.on(AbilityEvent.EV_KNIGHT_SWAP_STOPPED, ()=>
		{
			this._knightSwapSelected = false;
			if(this._fieldSelected)
			{
				this.showPossibleSwaps();
			}
		});
	}

	private addSwipeSelectEventListener()
	{
		this._dispatcher.on(FieldEvent.EV_FIELD_SWIPE_SELECTION, () =>
		{
			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					if(this._table[i][j].fieldController.swipeSelected)
					{
						this._table[i][j].fieldController.removeSelection();
					}
				}
			}
		});
	}

	private addSelectEventListener()
	{
		this._dispatcher.on(FieldEvent.EV_FIELD_SELECTED, () =>
		{
			this.showPossibleSwaps();
		});
	}

	private addRemoveSelectEventListener()
	{
		this._dispatcher.on(FieldEvent.EV_FIELD_REMOVE_SELECTION, () =>
		{
			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					this._fieldSelected = false;
					this._table[i][j].fieldController.allowSelection = true;
					this._table[i][j].fieldController.removePossibleSwap();
				}
			}
		});
	}

	private showPossibleSwaps()
	{
		for(let i=0; i<this._table.length; i++)
		{
			for (let j = 0; j < this._table[i].length; j++)
			{
				if(this._table[i][j].fieldController.selected)
				{
					this._fieldSelected = true;
				}
				this._table[i][j].fieldController.allowSelection = false;
			}
		}

		if(this._fieldSelected)
		{
			for(let i=0; i<this._table.length; i++)
			{
				for (let j = 0; j < this._table[i].length; j++)
				{
					this._table[i][j].fieldController.allowSelection = true;
				}
			}
		}

		for(let i=0; i<this._table.length; i++)
		{
			for(let j=0; j<this._table[i].length; j++)
			{
				if(this._table[i][j].fieldController.selected)
				{
					this._table[i][j].fieldController.allowSelection = true;

					if(i>0)
					{
						if(!this._table[i - 1][j].status.isParalyzed && !this._table[i - 1][j].status.isStunned)
						{
							this._table[i - 1][j].fieldController.showSwappableField(false);
							this._table[i - 1][j].fieldController.allowSelection = true;
						}
					}

					if(i<this._table.length - 1)
					{
						if(!this._table[i + 1][j].status.isParalyzed && !this._table[i + 1][j].status.isStunned)
						{
							this._table[i + 1][j].fieldController.showSwappableField(false);
							this._table[i + 1][j].fieldController.allowSelection = true;
						}
					}

					if(j>0)
					{
						if(!this._table[i][j - 1].status.isParalyzed && !this._table[i][j - 1].status.isStunned)
						{
							this._table[i][j - 1].fieldController.showSwappableField(false);
							this._table[i][j - 1].fieldController.allowSelection = true;
						}
					}

					if(j<this._table[i].length - 1)
					{
						if(!this._table[i][j + 1].status.isParalyzed && !this._table[i][j + 1].status.isStunned)
						{
							this._table[i][j + 1].fieldController.showSwappableField(false);
							this._table[i][j + 1].fieldController.allowSelection = true;
						}
					}

					if(this._diagonalSwapSelected)
					{
						this.allowDiagonalSwap(i, j, true);
					}
					else
					{
						this.allowDiagonalSwap(i, j, false);
					}

					if(this._knightSwapSelected)
					{
						this.allowKnightSwap(i, j, true);
					}
					else
					{
						this.allowKnightSwap(i, j, false);
					}
				}
			}
		}
	}

	private allowDiagonalSwap(y: number, x: number, isSelect: boolean)
	{
		const field: Field[] = [];

		if(y>0 && x>0)
		{
			field.push(this._table[y-1][x-1]);
		}

		if(y-1>0 && x-1 > 0)
		{
			field.push(this._table[y-2][x-2]);
		}

		if(y>0 && x+1<this._table[y].length)
		{
			field.push(this._table[y-1][x+1]);
		}

		if(y-1>0 && x+2<this._table[y].length)
		{
			field.push(this._table[y-2][x+2]);
		}

		if(y+1<this._table.length && x>0)
		{
			field.push(this._table[y+1][x-1]);
		}

		if(y+2<this._table.length && x-1 > 0)
		{
			field.push(this._table[y+2][x-2]);
		}

		if(y+1<this._table.length && x+1<this._table[y].length)
		{
			field.push(this._table[y+1][x+1]);
		}

		if(y+2<this._table.length && x+2<this._table[y].length)
		{
			field.push(this._table[y+2][x+2]);
		}


		if(isSelect)
		{
			for(let i=0; i<field.length; i++)
			{
				if(!field[i].status.isParalyzed && !field[i].status.isStunned)
				{
					field[i].fieldController.showSwappableField(true);
					field[i].fieldController.allowSelection = true;
				}
			}
		}
		else
		{
			for(let i=0; i<field.length; i++)
			{
				field[i].fieldController.removePossibleSwap();
				field[i].fieldController.allowSelection = false;
			}
		}
	}

	private allowKnightSwap(y: number, x: number, isSelect: boolean)
	{
		const field: Field[] = [];

		if(y>0 && x-1>0)
		{
			field.push(this._table[y-1][x-2]);
		}

		if(y-1>0 && x>0)
		{
			field.push(this._table[y-2][x-1]);
		}

		if(y>0 && x+2<this._table[y].length)
		{
			field.push(this._table[y-1][x+2]);
		}

		if(y-1>0 && x+1<this._table[y].length)
		{
			field.push(this._table[y-2][x+1]);
		}

		if(y+1<this._table.length && x-1>0)
		{
			field.push(this._table[y+1][x-2]);
		}

		if(y+2<this._table.length && x > 0)
		{
			field.push(this._table[y+2][x-1]);
		}

		if(y+1<this._table.length && x+2<this._table[y].length)
		{
			field.push(this._table[y+1][x+2]);
		}

		if(y+2<this._table.length && x+1<this._table[y].length)
		{
			field.push(this._table[y+2][x+1]);
		}


		if(isSelect)
		{
			for(let i=0; i<field.length; i++)
			{
				if(!field[i].status.isParalyzed && !field[i].status.isStunned)
				{
					field[i].fieldController.showSwappableField(true);
					field[i].fieldController.allowSelection = true;
				}
			}
		}
		else
		{
			for(let i=0; i<field.length; i++)
			{
				field[i].fieldController.removePossibleSwap();
				field[i].fieldController.allowSelection = false;
			}
		}
	}
}
