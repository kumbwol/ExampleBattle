import * as PIXI from 'pixi.js';
import { IPlayer, Player } from "./player/player";
import { Paragraph } from "../paragraph/paragraph";
import { CursorEvent } from "./cursor/event/cursorEvent";
import { PatternEvent } from "./battle/panel/event/patternEvent";
import { BattleManager } from "./battle/battleManager";
import { ItemTypes } from "./items/itemTypes";
import { ItemImages } from "./items/itemImages";
import { FieldTypes } from "./battle/field/fieldTypes";
import { EffectTypes } from "./skill/effect/effectTypes";
import { GnollFirst } from "./enemy/enemies/tutorial/gnollFirst";
import { ItemClass } from "./items/ItemClass";
import { GnollBerserker } from "./enemy/enemies/tutorial/gnollBerserker";
import { GnollSecond } from "./enemy/enemies/tutorial/gnollSecond";
import { GnollDefender } from "./enemy/enemies/tutorial/gnollDefender";

export class GameManager
{
	private _battleManager: BattleManager;
	private _dispatcher: PIXI.Container;
	private _player: Player;
	private _mainContainer: PIXI.Container;
	private _app: PIXI.Application;

	constructor(app: PIXI.Application, container: PIXI.Container)
	{
		this._mainContainer = container;
		this._app = app;
		this._dispatcher = container;
		new Paragraph();

		let playerData: IPlayer = {
			maxMP: 20,
			maxHP: 50,
			hp: 50,
			mp: 20,

			activeItems: [
				{rank: 1, itemType: ItemTypes.WEAPON, itemClass: ItemClass.SWORD, image: ItemImages.STARTING_DAGGER, skills: [{
						pattern:
							[[FieldTypes.magic, FieldTypes.empty, FieldTypes.empty],
								[FieldTypes.empty, FieldTypes.magic, FieldTypes.empty],
								[FieldTypes.magic, FieldTypes.empty, FieldTypes.empty]],
						primaryEffect: ({effectType: EffectTypes.damage, effectValue: 5}),
						secondaryEffect: ({effectType: EffectTypes.noEffect, effectValue: 0}),
						name: "Magic bolt"
					}]},
				{rank: 1, itemType: ItemTypes.WEAPON, itemClass: ItemClass.SWORD, image: ItemImages.STARTING_DAGGER, skills: [{
						pattern:
							[[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty],
								[FieldTypes.attack, FieldTypes.attack, FieldTypes.attack],
								[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]],
						primaryEffect: ({effectType: EffectTypes.damage, effectValue: 4}),
						secondaryEffect: ({effectType: EffectTypes.noEffect, effectValue: 0}),
						name: "Slash"
					}]},
				{rank: 1, itemType: ItemTypes.WEAPON, itemClass: ItemClass.SWORD, image: ItemImages.STARTING_DAGGER, skills: [{
						pattern:
							[[FieldTypes.defense, FieldTypes.move, FieldTypes.empty],
								[FieldTypes.defense, FieldTypes.move, FieldTypes.empty],
								[FieldTypes.empty, FieldTypes.empty, FieldTypes.empty]],
						primaryEffect: ({effectType: EffectTypes.heal, effectValue: 4}),
						secondaryEffect: ({effectType: EffectTypes.shield, effectValue: 3}),
						name: "Heal"
					}]},
				{rank: 1, itemType: ItemTypes.WEAPON, itemClass: ItemClass.SWORD, image: ItemImages.STARTING_DAGGER, skills: [{
						pattern:
							[[FieldTypes.empty, FieldTypes.attack, FieldTypes.empty],
								[FieldTypes.defense, FieldTypes.empty, FieldTypes.move],
								[FieldTypes.empty, FieldTypes.attack, FieldTypes.empty]],
						primaryEffect: ({effectType: EffectTypes.damage, effectValue: 4}),
						secondaryEffect: ({effectType: EffectTypes.damage, effectValue: 3}),
						name: "Combo"
					}]},
				{rank: 0, itemType: ItemTypes.NO_ITEM, itemClass: ItemClass.NO_CLASS, image: ItemImages.NO_ITEM, skills: []},
				{rank: 0, itemType: ItemTypes.NO_ITEM, itemClass: ItemClass.NO_CLASS, image: ItemImages.NO_ITEM, skills: []},
			]
		};

		this._player = new Player(playerData);

		this._battleManager = new BattleManager(app, container, this._player);

		//this._battleManager.enemy = new GnollFirst();
		this._battleManager.enemy = new GnollSecond();
		//this._battleManager.enemy = new GnollDefender();
		//this._battleManager.enemy = new GnollBerserker();

		this._battleManager.startBattle(this._mainContainer);

		window.addEventListener("pointerup", (e) =>
		{
			this._dispatcher.emit(CursorEvent.EV_CURSOR_UP);
			if(String(e.composedPath()[0]).toLowerCase().search("canvas") === -1)
			{
				container.emit(PatternEvent.EV_PATTERN_DELETE);
			}
		});
	}
}
