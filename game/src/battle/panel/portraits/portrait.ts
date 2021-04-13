import * as PIXI from "pixi.js";
import { PortraitPopUpNumber } from "./portraitPopUpNumber";

export class Portrait
{
	private _portraitContainer: PIXI.Container;
	private _portraitPopUpNumber: PortraitPopUpNumber;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container, portraitTexture: PIXI.Texture, isPlayer: boolean)
	{
		this.createPortrait(parentContainer, portraitTexture);
		this._portraitPopUpNumber = new PortraitPopUpNumber(dispatcher, this._portraitContainer, isPlayer);
	}

	private createPortrait(parentContainer: PIXI.Container, portraitTexture: PIXI.Texture)
	{
		this._portraitContainer = new PIXI.Container;
		let portraitSprite = new PIXI.Sprite(portraitTexture);

		this._portraitContainer.addChild(portraitSprite);
		this._portraitContainer.x = 2;
		this._portraitContainer.y = 56;

		parentContainer.addChild(this._portraitContainer);
	}
}
