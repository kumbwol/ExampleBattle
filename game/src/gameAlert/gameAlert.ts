import * as PIXI from 'pixi.js';
import { Easing, Tweener } from "pixi-tweener";
import { EndTurnButtonEvent } from "../battle/endTurnButton/event/endTurnButtonEvent";
import { Button } from "../button/button";
import { GameAlertEvent } from "./event/gameAlertEvent";

export class GameAlert
{
	private _dispatcher: PIXI.Container;
	private _visible: boolean;
	private _gameAlert: PIXI.Container;
	private _gameAlertSprite: PIXI.Sprite;
	private _alertText: PIXI.Text;
	private _darkenedBackground: PIXI.Graphics;
	private _noButton: Button;
	private _yesButton: Button;

	constructor(dispatcher: PIXI.Container, container: PIXI.Container)
	{
		this._dispatcher = dispatcher;
		this._visible = false;
		this._gameAlert = new PIXI.Container;


		this.createDarkenedBackground();
		container.addChild(this._darkenedBackground);
		container.addChild(this.createGameAlert());

		dispatcher.on(EndTurnButtonEvent.EV_END_TURN_WITH_UNUSED_ABILITY_POINTS, () =>
		{
			this._gameAlert.alpha = 1;
			this.showAlert();
		});

		dispatcher.on(GameAlertEvent.EV_GAME_ALERT_NO, () =>
		{
			this.hideAlert();
		});

		dispatcher.on(GameAlertEvent.EV_GAME_ALERT_YES, () =>
		{
			this.hideAlert();
			dispatcher.emit(EndTurnButtonEvent.EV_END_TURN);
		});
	}

	private createDarkenedBackground()
	{
		this._darkenedBackground = new PIXI.Graphics;
		this._darkenedBackground.beginFill(0x000000);
		this._darkenedBackground.drawRect(0, 0, 1600, 900);
		this._darkenedBackground.endFill();
		this._darkenedBackground.alpha = 0;
	}

	public createGameAlert(): PIXI.Container
	{
		const skillExplainerTexture = PIXI.Texture.from("gameAlert.png");
		this._gameAlertSprite = new PIXI.Sprite(skillExplainerTexture);

		this._alertText = new PIXI.Text("",{fontFamily : 'Lato', fontSize: 28, fill : 0x000000, align : 'center', wordWrap: true, wordWrapWidth: 490});
		this._alertText.x = 10;
		this._alertText.y = 10;

		this._gameAlert.addChild(this._gameAlertSprite);
		this._gameAlert.addChild(this._alertText);

		const buttonTextNo = new PIXI.Text("No",{fontFamily : 'Lato', fontSize: 38, fill : 0x000000, align : 'center', wordWrap: true, wordWrapWidth: 490});
		this._noButton = new Button(this._dispatcher, PIXI.Texture.from("gameAlertButton/no/noNormal.png"), PIXI.Texture.from("gameAlertButton/no/noHover.png"), PIXI.Texture.from("gameAlertButton/no/noPressed.png"), new GameAlertEvent(GameAlertEvent.EV_GAME_ALERT_NO, null), buttonTextNo);
		this._noButton.button.x = 70;
		this._noButton.button.y = 210;
		this._gameAlert.addChild(this._noButton.button);

		const buttonTextYes = new PIXI.Text("Yes",{fontFamily : 'Lato', fontSize: 38, fill : 0x000000, align : 'center', wordWrap: true, wordWrapWidth: 490});
		this._yesButton = new Button(this._dispatcher, PIXI.Texture.from("gameAlertButton/yes/yesNormal.png"), PIXI.Texture.from("gameAlertButton/yes/yesHover.png"), PIXI.Texture.from("gameAlertButton/yes/yesPressed.png"), new GameAlertEvent(GameAlertEvent.EV_GAME_ALERT_YES, null), buttonTextYes);
		this._yesButton.button.x = 300;
		this._yesButton.button.y = 210;
		this._gameAlert.addChild(this._yesButton.button);
		this._gameAlert.alpha = 0;
		this._noButton.isActive = false;
		this._yesButton.isActive = false;
		return this._gameAlert;
	}

	private showAlert()
	{
		this._dispatcher.emit(GameAlertEvent.EV_GAME_ALERT);
		this._noButton.isActive = true;
		this._yesButton.isActive = true;
		this.dropShadow();
		this._alertText.text = "You will loose unused ability point(s) if you end you turn!\n\nDo you want to end your turn?";
	}

	private async dropShadow()
	{
		this._darkenedBackground.interactive = true;
		this._visible = true;
		const offsetY = 100;
		this._gameAlert.x = Math.floor(this._darkenedBackground.width / 2) - Math.floor(this._gameAlertSprite.width / 2);
		this._gameAlert.y = Math.floor(this._darkenedBackground.height / 2) - Math.floor(this._gameAlertSprite.height / 2) - offsetY;
		this._gameAlert.alpha = 1;

		await Tweener.add
		(
			{
				target: this._darkenedBackground,
				duration: 0.2, ease: Easing.linear,
			},
			{
				alpha: 0.7
			}
		)
	}

	private async hideAlert()
	{
		this._noButton.isActive = false;
		this._yesButton.isActive = false;
		this._darkenedBackground.interactive = false;
		this._visible = false;
		this._gameAlert.alpha = 0;

		await Tweener.add
		(
			{
				target: this._darkenedBackground,
				duration: 0.2, ease: Easing.linear,
			},
			{
				alpha: 0
			}
		)
	}
}
