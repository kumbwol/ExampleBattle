import { Field } from "../field/field";
import * as PIXI from "pixi.js";
import { CascadeController } from "./cascadeController";
import { FieldEvent } from "../field/event/fieldEvent";
import { EffectEvent } from "../../skill/effect/event/effectEvent";
import { FieldTypes } from "../field/fieldTypes";
import { LogicEvent } from "../logic/event/logicEvent";
import { TableEvent } from "./event/tableEvent";
import { EndTurnButtonEvent } from "../endTurnButton/event/endTurnButtonEvent";
import { SkillEvent } from "../../skill/event/skillEvent";
import { Effect } from "../../skill/effect/effect";
import { EffectTypes } from "../../skill/effect/effectTypes";
import { Easing, Tweener } from "pixi-tweener";

export class TableCreator
{
	private readonly _table: Field[][];
	private readonly _width: number;
	private readonly _height: number;
	private readonly _gatBetweenField: number;
	private _cascadeController: CascadeController;
	private _dispatcher: PIXI.Container;

	private _frozenTableSprite: PIXI.Sprite;
	private _tableFrozen: boolean;

	constructor(dispatcher: PIXI.Container, container: PIXI.Container, width: number, height: number)
	{
		this._table = [];
		this._width = width;
		this._height = height;
		this._gatBetweenField = 1;
		this._dispatcher = dispatcher;
		this._tableFrozen = false;

		this.createTable(container, dispatcher);

		this._cascadeController = new CascadeController(dispatcher, container, this._table, this._gatBetweenField);
		this._cascadeController.start();

		dispatcher.on(LogicEvent.EV_DISABLE_FIELD_SELECTION, () =>
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
		});

		dispatcher.on(FieldEvent.EV_FIELD_PATTERN_ACTIVATING, () =>
		{
			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					this._table[i][j].fieldController.allowSelection = false;
				}
			}
		});

		dispatcher.on(LogicEvent.EV_ENABLE_SWAP, () =>
		{
			let allDisabled = true;

			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					if(this._table[i][j].fieldController.allowSelection)
					{
						allDisabled = false;
					}
				}
			}

			if(allDisabled)
			{
				for(let i=0; i<this._table.length; i++)
				{
					for(let j=0; j<this._table[i].length; j++)
					{
						this._table[i][j].fieldController.allowSelection = true;
					}
				}
			}
		});

		dispatcher.on(LogicEvent.EV_DISABLE_SWAP, () =>
		{
			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					this._table[i][j].fieldController.allowSelection = false;
				}
			}
		});

		dispatcher.on(EffectEvent.EV_FIELD_TRANSFORM, (transformToType: FieldTypes, chance: number, isPrimary: boolean, isPlayer: boolean) =>
		{
			const transformingFields: Field[] = [];
			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					let random = (Math.floor(Math.random() * 100) + 1);
					if(random <= chance)
					{
						if(this._table[i][j].fieldType !== FieldTypes.empty)
						{
							this._table[i][j].fieldType = transformToType;
							transformingFields.push(this._table[i][j]);
						}
					}
				}
			}

			if(transformingFields.length > 0)
			{
				for(let i=0; i<transformingFields.length; i++)
				{
					transformingFields[i].transformSymbol(transformToType, isPrimary, (i === transformingFields.length - 1), isPlayer);
				}
			}
			else
			{
				this._table[0][0].noTransformSymbol(isPrimary, isPlayer); //still have to wait cascade to finish, maybe refactor...
			}
		});

		dispatcher.on(EndTurnButtonEvent.EV_END_TURN, () =>
		{
			let poisonsCleared = false;
			let poisonDamage = 0;

			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					if(this._table[i][j].fieldType === FieldTypes.poison)
					{
						poisonDamage += this._table[i][j].poisonDmg;
						this._table[i][j].makeFieldEmpty();
						poisonsCleared = true;
					}

					if(this._table[i][j].status.isParalyzed)
					{
						this._table[i][j].removeParalyze();
						this._table[i][j].status.paralyze = false;
					}
					else if(this._table[i][j].status.isStunned)
					{
						this._table[i][j].removeStun();
						this._table[i][j].status.stun = false;
					}
				}
			}

			if(this._tableFrozen)
			{
				this.meltTable();
				this._tableFrozen = false;
				if(!poisonsCleared)
				{
					this._dispatcher.emit(TableEvent.EV_START_CASCADE, false, true);
				}
			}

			if(poisonsCleared)
			{
				this._dispatcher.emit(EffectEvent.EV_POISON_DAMAGE, new Effect({effectType: EffectTypes.damage, poisonDamage: poisonDamage, effectValue: 0}));
				this._dispatcher.emit(TableEvent.EV_START_CASCADE, false, true);
			}
		});

		dispatcher.on(TableEvent.EV_NEW_FIELDS_CREATED, () =>
		{
			this.fixFrozenTablePosition(container);
		});

		dispatcher.on(EffectEvent.EV_FREEZE_TABLE, (amount: number, isPrimary: boolean, isPlayer: boolean) =>
		{
			this._tableFrozen = true;
			this.freezeTable().then(() =>
			{
				if(isPrimary)
				{
					this._dispatcher.emit(EffectEvent.EV_PRIMARY_EFFECT_FINISHED);
				}
				else
				{
					if(isPlayer)
					{
						this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_FINISHED);
					}
					else
					{
						this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, isPlayer);
					}
				}
			});
		});

		dispatcher.on(EffectEvent.EV_FIELD_PARALYZE, (amount: number, isPrimary: boolean, isPlayer: boolean) =>
		{
			const paralyzingFields: Field[] = [];

			let nonParalyzedFields = 0;
			let paralyzedFields = 0;
			let stunnedFields = 0;

			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					if(!this._table[i][j].status.isParalyzed && !this._table[i][j].status.isStunned)
					{
						nonParalyzedFields++;
					}
					else if(this._table[i][j].status.isParalyzed)
					{
						paralyzedFields++;
					}
					else if(this._table[i][j].status.isStunned)
					{
						stunnedFields++;
					}
				}
			}

			if(nonParalyzedFields < amount)
			{
				amount = nonParalyzedFields;
			}

			while(amount !== 0)
			{
				let y = Math.floor(Math.random() * this._table.length);
				let x = Math.floor(Math.random() * this._table[y].length);

				if(!this._table[y][x].status.isParalyzed && !this._table[y][x].status.isStunned)
				{
					if(paralyzingFields.length === 0)
					{
						if(isPlayer) dispatcher.emit(TableEvent.EV_FIELDS_PARALYZED, paralyzedFields + amount, nonParalyzedFields - amount + stunnedFields)
					}
					amount--;
					this._table[y][x].status.paralyze = true;
					paralyzingFields.push(this._table[y][x]);
				}
			}

			if(paralyzingFields.length > 0)
			{
				for(let i=0; i<paralyzingFields.length; i++)
				{
					paralyzingFields[i].paralyzeSymbol(isPrimary, (i === paralyzingFields.length - 1), isPlayer);
				}
			}
			else
			{
				this._table[0][0].noTransformSymbol(isPrimary, isPlayer); //still have to wait cascade to finish, maybe refactor...
			}
		});

		dispatcher.on(SkillEvent.EV_ENEMY_FINISHED_TURN, () =>
		{
			let nonParalyzedFields = 0;
			let paralyzedFields = 0;

			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					if(!this._table[i][j].status.isParalyzed)
					{
						nonParalyzedFields++;
					}
					else
					{
						paralyzedFields++;
					}
				}
			}

			dispatcher.emit(TableEvent.EV_FIELDS_PARALYZED, paralyzedFields, nonParalyzedFields);
		});

		dispatcher.on(EffectEvent.EV_FIELD_POISON, (amount: number, poisonDamage: number, isPrimary: boolean, isPlayer: boolean) =>
		{
			const poisonFields: Field[] = [];

			let nonPoisonedFields = 0;

			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					if(this._table[i][j].fieldType !== FieldTypes.poison)
					{
						nonPoisonedFields++;
					}
				}
			}

			if(nonPoisonedFields < amount)
			{
				amount = nonPoisonedFields;
			}

			let tries = 0;

			while(amount !== 0 && tries !==5000)
			{
				let y = Math.floor(Math.random() * this._table.length);
				let x = Math.floor(Math.random() * this._table[y].length);

				if(this._table[y][x].fieldType !== FieldTypes.poison && this.poisonPlaceAllowed(y, x))
				{
					amount--;
					this._table[y][x].fieldType = FieldTypes.poison;
					this._table[y][x].poisonDmg = poisonDamage;
					poisonFields.push(this._table[y][x]);
				}
				else
				{
					tries++;
				}
			}

			if(poisonFields.length > 0)
			{
				for(let i=0; i<poisonFields.length; i++)
				{
					poisonFields[i].transformSymbol(FieldTypes.poison, isPrimary, (i === poisonFields.length - 1), isPlayer);
				}
			}
			else
			{
				this._table[0][0].noTransformSymbol(isPrimary, isPlayer); //still have to wait cascade to finish, maybe refactor...
			}
		});

		dispatcher.on(EffectEvent.EV_FIELD_STUN, (amount: number, isPrimary: boolean, isPlayer: boolean) =>
		{
			const stunningFields: Field[] = [];

			let nonStunnedFields = 0;

			for(let i=0; i<this._table.length; i++)
			{
				for(let j=0; j<this._table[i].length; j++)
				{
					if(!this._table[i][j].status.isParalyzed && !this._table[i][j].status.isStunned)
					{
						nonStunnedFields++;
					}
				}
			}

			if(nonStunnedFields < amount)
			{
				amount = nonStunnedFields;
			}

			while(amount !== 0)
			{
				let y = Math.floor(Math.random() * this._table.length);
				let x = Math.floor(Math.random() * this._table[y].length);

				if(!this._table[y][x].status.isStunned && !this._table[y][x].status.isParalyzed)
				{
					amount--;
					this._table[y][x].status.stun = true;
					stunningFields.push(this._table[y][x]);
				}
			}

			if(stunningFields.length > 0)
			{
				for(let i=0; i<stunningFields.length; i++)
				{
					stunningFields[i].stunSymbol(isPrimary, (i === stunningFields.length - 1), isPlayer);
				}
			}
			else
			{
				this._table[0][0].noTransformSymbol(isPrimary, isPlayer); //still have to wait cascade to finish, maybe refactor...
			}
		});

		dispatcher.on(FieldEvent.EV_FIELD_SWAPPED, (isReswap) =>
		{
			if(this.needPoisonClear())
			{
				this.clearPoisons(false);
			}
			else
			{
				dispatcher.emit(FieldEvent.EV_FIELD_REMOVE_SELECTION);
				dispatcher.emit(FieldEvent.EV_ALLOW_RESWAP, isReswap);
			}
		});

		dispatcher.on(TableEvent.EV_FINISHED_CASCADE_CHECK_POISONS, (event) =>
		{
			if(this.needPoisonClear())
			{
				this.clearPoisons(event);
			}
			else
			{
				dispatcher.emit(TableEvent.EV_FINISHED_CASCADE, event);
			}
		});
	}

	private fixFrozenTablePosition(container: PIXI.Container)
	{
		let x;

		for(let i = container.children.length; i > 1; i--)
		{
			if(container.children[i-1].isSprite)
			{
				x = container.removeChildAt(i-1);
			}
		}

		if(x !== undefined)
		{
			container.addChild(x);
		}
	}

	private async freezeTable()
	{
		Tweener.add
		(
			{
				target: this._frozenTableSprite,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 0.3
			}
		);
	}

	private async meltTable()
	{
		Tweener.add
		(
			{
				target: this._frozenTableSprite,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 0
			}
		);
	}

	private clearPoisons(event)
	{
		for(let i=0; i<this._table.length; i++)
		{
			for(let j=0; j<this._table[i].length; j++)
			{
				if(this._table[i][j].fieldType === FieldTypes.antiPoison)
				{
					this._table[i][j].makeFieldEmpty();
				}
			}
		}

		this._dispatcher.emit(TableEvent.EV_START_CASCADE, event);
	}

	private needPoisonClear()
	{
		let needPoisonClear: boolean = false;

		for(let i=0; i<this._table.length; i++)
		{
			for(let j=0; j<this._table[i].length; j++)
			{
				if(this.table[i][j].fieldType === FieldTypes.poison || this.table[i][j].fieldType === FieldTypes.antiPoison)
				{
					if(!this.poisonPlaceAllowed(i, j))
					{
						this.createAntiPoisonInRow(i, j);
						this.createAntiPoisonInColumn(i, j);
						needPoisonClear = true;
					}
				}
			}
		}

		return needPoisonClear;
	}

	private createAntiPoisonInColumn(y: number, x: number)
	{
		let number_of_poisons_up = 0;
		let number_of_poisons_down = 0;

		for(let i = y; i>=0; i--)
		{
			if(this._table[i][x].fieldType === FieldTypes.poison || this._table[i][x].fieldType === FieldTypes.antiPoison) number_of_poisons_up++;
			else break;
		}

		for(let i = y; i<this._table.length; i++)
		{
			if(this._table[i][x].fieldType === FieldTypes.poison || this._table[i][x].fieldType === FieldTypes.antiPoison) number_of_poisons_down++;
			else break;
		}

		if(((number_of_poisons_up + number_of_poisons_down)-1) >= 3)
		{
			for(let i = y; i>=0; i--)
			{
				if(this._table[i][x].fieldType === FieldTypes.poison || this._table[i][x].fieldType === FieldTypes.antiPoison)
				{
					this._table[i][x].fieldType = FieldTypes.antiPoison;
				}
				else break;
			}

			for(let i = y; i<this._table.length; i++)
			{
				if(this._table[i][x].fieldType === FieldTypes.poison || this._table[i][x].fieldType === FieldTypes.antiPoison)
				{
					this._table[i][x].fieldType = FieldTypes.antiPoison;
				}
				else break;
			}
		}
	}

	private createAntiPoisonInRow(y: number, x: number)
	{
		let number_of_poisons_left = 0;
		let number_of_poisons_right = 0;

		for(let i = x; i>=0; i--)
		{
			if(this._table[y][i].fieldType === FieldTypes.poison || this._table[y][i].fieldType === FieldTypes.antiPoison) number_of_poisons_left++;
			else break;
		}

		for(let i = x; i<this._table[0].length; i++)
		{
			if(this._table[y][i].fieldType === FieldTypes.poison || this._table[y][i].fieldType === FieldTypes.antiPoison) number_of_poisons_right++;
			else break;
		}

		if(((number_of_poisons_left + number_of_poisons_right)-1) >= 3)
		{
			for(let i = x; i>=0; i--)
			{
				if(this._table[y][i].fieldType === FieldTypes.poison || this._table[y][i].fieldType === FieldTypes.antiPoison) this._table[y][i].fieldType = FieldTypes.antiPoison;
				else break;
			}

			for(let i = x; i<this._table[0].length; i++)
			{
				if(this._table[y][i].fieldType === FieldTypes.poison || this._table[y][i].fieldType === FieldTypes.antiPoison) this._table[y][i].fieldType = FieldTypes.antiPoison;
				else break;
			}
		}
	}

	private poisonPlaceAllowed(y: number, x: number): boolean
	{
		let poisonsNextToEachOther = 0;
		for(let i=y-2; i<y+3; i++)
		{
			if(i >= 0 && i<this._table.length)
			{
				if(this._table[i][x].fieldType === FieldTypes.poison || i === y)
				{
					poisonsNextToEachOther++;
					if(poisonsNextToEachOther === 3)
					{
						return false;
					}
				}
				else
				{
					poisonsNextToEachOther = 0;
				}
			}
		}

		poisonsNextToEachOther = 0;
		for(let i=x-2; i<x+3; i++)
		{
			if(i >= 0 && i<this._table[0].length)
			{
				if(this._table[y][i].fieldType === FieldTypes.poison || i === x)
				{
					poisonsNextToEachOther++;
					if (poisonsNextToEachOther === 3)
					{
						return false;
					}
				}
				else
				{
					poisonsNextToEachOther = 0;
				}
			}
		}

		return true;
	}

	private createTable(container: PIXI.Container, dispatcher: PIXI.Container)
	{
		for(let i=0; i<this._height; i++)
		{
			this._table[i] = [];
			for(let j=0; j<this._width; j++)
			{
				this._table[i][j] = new Field(dispatcher, container, j, i - (j * 0.5) - 9, this._gatBetweenField);
			}
		}

		const frozenTableTexture = PIXI.Texture.from("battle/freeze.png");
		this._frozenTableSprite = new PIXI.Sprite(frozenTableTexture);
		this._frozenTableSprite.alpha = 0;
		container.addChild(this._frozenTableSprite);
	}

	get table(): Field[][]
	{
		return this._table;
	}
}
