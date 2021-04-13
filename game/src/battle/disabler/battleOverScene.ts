import { Disabler } from "./disabler";
import * as PIXI from "pixi.js";
import { Easing, Tweener } from "pixi-tweener";
import { LogicEvent } from "../logic/event/logicEvent";

export class BattleOverScene extends Disabler
{
	private readonly _battleOverDisablerContainer: PIXI.Container;
	private _winScene: PIXI.Sprite;
	private _loseScene: PIXI.Sprite;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container)
	{
		super(dispatcher, parentContainer);

		this._battleOverDisablerContainer = new PIXI.Container;
		this.createBattleOverDisabler(parentContainer);

		this._battleOverDisablerContainer.on("pointerdown", () =>
		{
			dispatcher.emit(LogicEvent.EV_BATTLE_OVER);
		});
	}

	protected addEventListeners(dispatcher: PIXI.Container)
	{
		dispatcher.on(LogicEvent.EV_LOSE_BATTLE, () =>
		{
			this.loseBattle(this._battleOverDisablerContainer);
		});

		dispatcher.on(LogicEvent.EV_WIN_BATTLE, () =>
		{
			this.winBattle(this._battleOverDisablerContainer);
		});
	}

	private createBattleOverDisabler(parentContainer: PIXI.Container)
	{
		const disabler = new PIXI.Graphics;
		disabler.beginFill(0x000000);
		disabler.drawRect(0, 0, 1600, 900);
		disabler.endFill();

		const winSceneTexture = PIXI.Texture.from("battle/winScene.png");
		const loseSceneTexture = PIXI.Texture.from("battle/loseScene.png");

		this._winScene = new PIXI.Sprite(winSceneTexture);
		this._loseScene = new PIXI.Sprite(loseSceneTexture);

		this._battleOverDisablerContainer.addChild(disabler);
		this._battleOverDisablerContainer.alpha = 0;
		this._battleOverDisablerContainer.interactive = false;

		this._winScene.alpha = 0;
		this._loseScene.alpha = 0;

		parentContainer.addChild(this._winScene);
		parentContainer.addChild(this._loseScene);
		parentContainer.addChild(this._battleOverDisablerContainer);
	}

	private async loseBattle(element)
	{
		this._loseScene.interactive = true;
		await Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 1
			}
		);
		this._loseScene.alpha = 1;
		await Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 0
			}
		);

		element.interactive = true;
	}

	private async winBattle(element)
	{
		this._winScene.interactive = true;
		await Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 1
			}
		);
		this._winScene.alpha = 1;
		await Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 0
			}
		);

		element.interactive = true;
	}
}
