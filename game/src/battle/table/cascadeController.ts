import { Field } from "../field/field";
import { FieldTypes } from "../field/fieldTypes";
import { Easing, Tweener } from "pixi-tweener";
import { TableEvent } from "./event/tableEvent";
import { EffectEvent } from "../../skill/effect/event/effectEvent";
import { EndTurnButtonEvent } from "../endTurnButton/event/endTurnButtonEvent";

export class CascadeController
{
	private _table: Field[][];
	private _drops: number;
	private _gapBetweenFields: number;
	private _dispatcher: PIXI.Container;
	private _container: PIXI.Container;
	private _newFields: Field[];
	private _dropHeights: number[];
	private _isSkillActivision: boolean;
	private _isTurnFinished: boolean;

	private _isFrozen: boolean;

	constructor(dispatcher: PIXI.Container, container: PIXI.Container, table: Field[][], gapBetweenFields: number)
	{
		this._table = table;
		this._drops = 0;
		this._gapBetweenFields = gapBetweenFields;
		this._dispatcher = dispatcher;
		this._container = container;
		this._newFields = [];
		this._dropHeights = [];
		this.addEventListener(dispatcher);
	}

	private async helper(skillActivision: boolean, turnFinished: boolean = false)
	{
		await Tweener.add
		(
			{
				target: null,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{

			}
		);

		this._dispatcher.emit(TableEvent.EV_FINISHED_CASCADE_CHECK_POISONS, skillActivision, turnFinished);
	}

	private addEventListener(dispatcher: PIXI.Container)
	{
		dispatcher.on(TableEvent.EV_START_CASCADE, (skillActivision: boolean, turnFinished: boolean = false) =>
		{
			this._isSkillActivision = skillActivision;
			this._isTurnFinished = turnFinished;
			if(this._isFrozen)
			{
				this.helper(skillActivision, turnFinished);
			}
			else
			{
				this.dropFields();
			}
		});

		dispatcher.on(EffectEvent.EV_FREEZE_TABLE,() =>
		{
			this._isFrozen = true;
		});

		dispatcher.on(EndTurnButtonEvent.EV_END_TURN,() =>
		{
			this._isFrozen = false;
		});
	}

	private dropFields()
	{
		let drops: number[][] = [];
		let numberOfDrops: number = 0;

		for(let i=0; i<this._table.length; i++)
		{
			drops[i] = [];
			for(let j=0; j<this._table[i].length; j++)
			{
				drops[i][j] = 0;
			}
		}

		for(let j=0; j<this._table[0].length; j++)
		{
			let height = 0;
			for(let i=this._table.length - 1; i>=0; i--)
			{
				if(this._table[i][j].fieldType === FieldTypes.empty)
				{
					height++;
				}
				else
				{
					drops[i][j] = height;
					numberOfDrops++;
				}
			}
		}

		let paralyzedFields = 0;
		let nonParalyzedFields = 0;
		for(let i=0; i<this._table.length; i++)
		{
			for (let j=0; j<this._table[i].length; j++)
			{
				if(this._table[i][j].status.isParalyzed)
				{
					paralyzedFields++;
				}
				else
				{
					nonParalyzedFields++;
				}
			}
		}

		this._dispatcher.emit(TableEvent.EV_FIELDS_REMOVED, paralyzedFields, nonParalyzedFields);

		for(let i=0; i<this._table.length; i++)
		{
			for(let j=0; j<this._table[i].length; j++)
			{
				this.drop(this._table[i][j].fieldContainer, drops[i][j], numberOfDrops);
			}
		}
	}

	public start()
	{
		for(let i=0; i<this._table.length; i++)
		{
			for(let j=0; j<this._table[i].length; j++)
			{
				this.startingDrop(this._table[i][j].fieldContainer, (j * 0.5) + 9, j/18);
			}
		}
	}

	private async startingDrop(element: PIXI.Container, height: number, time: number)
	{
		await Tweener.add
		(
			{
				target: element,
				duration: 0.60 + time, ease: Easing.easeInCubic
			},
			{
				y: (element.y + (element.height * height) + this._gapBetweenFields + height + (height-1)) + 30
			}
		);
		await Tweener.add
		(
			{
				target: element,
				duration: 0.15 + time / 50, ease: Easing.easeOutCubic
			},
			{
				y: (element.y - 70)
			}
		);
		await Tweener.add
		(
			{
				target: element,
				duration: 0.15 + time / 100, ease: Easing.easeInCubic
			},
			{
				y: (element.y + 50)
			}
		);
		await Tweener.add
		(
			{
				target: element,
				duration: 0.1 + time / 100, ease: Easing.easeOutCubic
			},
			{
				y: (element.y - 15)
			}
		);
		await Tweener.add
		(
			{
				target: element,
				duration: 0.1 + time / 100, ease: Easing.easeInCubic
			},
			{
				y: (element.y + 5)
			}
		);
	}

	private async drop(element: PIXI.Container, height: number, numberOfDrops: number)
	{
		await Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				y: (element.y + (element.height * height) + this._gapBetweenFields + height + (height-1))
			}
		);
		this._drops++;
		if(this._drops === numberOfDrops)
		{
			this.bubbleUpEmptyField();
			this.createNewFields();
			for(let i=0; i<this._newFields.length; i++)
			{
				this.dropDownNewFields(this._newFields[i].fieldContainer, this._dropHeights[i], i);
			}
			this._drops = 0;
		}
	}

	private bubbleUpEmptyField()
	{
		//this.logFields();

		for(let j=0; j<this._table[0].length; j++)
		{
			for(let i=0; i<this._table.length; i++)
			{
				if(this._table[i][j].fieldType === FieldTypes.empty)
				{
					for(let k=i-1; k>=0; k--)
					{
						let f1: Field[];
						let f2: Field[];

						f1 = this._table[k].splice(j, 1);
						f2 = this._table[k+1].splice(j, 1);

						this._table[k].splice(j, 0, f2[0]);
						this._table[k+1].splice(j, 0, f1[0]);
					}
				}
			}
		}
	}

	private createNewFields()
	{
		for(let j=0; j<this._table[0].length; j++)
		{
			for(let i=0; i<this._table.length; i++)
			{
				if(this._table[i][j].fieldType === FieldTypes.empty)
				{
					this._table[i][j].fieldContainer.y += (i-5) + (i-5) * (88 + this._gapBetweenFields);
					this._table[i][j].createDroppingInField();
					this._table[i][j].normalizeField();

					this._newFields.push(this._table[i][j]);
					this._dropHeights.push(i);
					//console.log("magassag: " + this._table[i][j].fieldContainer.y);
					/*this._table[i][j].fieldContainer.y -= (this._table[j].length - i) * this._table[i][j].fieldContainer.height;
					this._table[i][j].fieldContainer.alpha = 1;
					this._table[i][j].fieldType = FieldTypes.blue;*/
				}
			}
		}

		this._dispatcher.emit(TableEvent.EV_NEW_FIELDS_CREATED);
	}

	private async dropDownNewFields(field: PIXI.Container, height: number, numberOfDrops: number)
	{
		await Tweener.add
		(
			{
				target: field,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				y: height + height * (field.height + this._gapBetweenFields)
			}
		);
		if(numberOfDrops === this._newFields.length - 1)
		{
			this._newFields = [];
			this._dropHeights = [];
			if(!this._isTurnFinished)
			{
				this._dispatcher.emit(TableEvent.EV_FINISHED_CASCADE_CHECK_POISONS, this._isSkillActivision);
			}
			//this._dispatcher.emit(TableEvent.EV_FINISHED_CASCADE, this._isSkillActivision);
			//this.logFields();
		}
	}

	/*private resolveAfter2Seconds()
	{
		return new Promise(resolve =>
		{
			setTimeout(() =>
			{
				resolve('resolved');
			}, 10);
		});
	}

	private async move()
	{
		console.log("eses kezdet");
		var result = await this.resolveAfter2Seconds();
		console.log("eses vege");
	}*/


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
				string += this._table[i][j].fieldType;
				//string += this._table[i][j].fieldController.fieldSelectedByPattern;
				string += " ";
			}
			console.log(string);
			console.log("\n");
		}
	}
}
