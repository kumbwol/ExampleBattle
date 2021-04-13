import * as PIXI from 'pixi.js';
import { Easing, Tweener } from "pixi-tweener";

export class Bar
{
	private _barSprite: PIXI.Sprite;
	private _currentValue: number;
	private _maxValue: number;
	protected _mask: PIXI.Graphics;
	protected readonly _container: PIXI.Container;
	protected _valuesContainer: PIXI.Container;
	protected _barValues: PIXI.Text;
	protected _dispatcher: PIXI.Container;
	protected _parentContainer: PIXI.Container;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container, barTexture: PIXI.Texture, x: number, y: number, currentValue: number, maxValue: number)
	{
		this._dispatcher = dispatcher;
		this._container = new PIXI.Container();
		this._currentValue = currentValue;
		this._maxValue = maxValue;
		this._parentContainer = parentContainer;
		this.createBar(parentContainer, barTexture, x, y);
	}

	private createBar(parentContainer: PIXI.Container, texture: PIXI.Texture, x: number, y: number)
	{
		this._barSprite = new PIXI.Sprite(texture);

		this._barSprite.x = 2;
		this._barSprite.y = 2;

		this._mask = new PIXI.Graphics();

		//console.log(this._barSprite.y);

		this._mask.beginFill(0x00FF00);
		this._mask.drawRect(2, 2, this._barSprite.width, this._barSprite.height);
		this._mask.endFill();

		/*this._container.x = x;
		this._container.y = y;*/

		this._container.addChild(this._barSprite);
		this._container.addChild(this._mask);
		this._container.mask = this._mask;

		/*console.log(this._container.getGlobalPosition());
		console.log(this._mask.width);*/

		this._container.x = x;
		this._container.y = y;

		parentContainer.addChild(this._container);

		this._valuesContainer = this.addValues();
		this.positionToMiddle(parentContainer, this._valuesContainer);
		this._valuesContainer.y = y;

		parentContainer.addChild(this._valuesContainer);
	}

	protected positionToMiddle(parent: PIXI.Container, child: PIXI.Container)
	{
		child.x = Math.floor(parent.width / 2) - Math.floor(child.width / 2);
	}

	private addValues(): PIXI.Container
	{
		let container = new PIXI.Container;

		let summarize = new PIXI.Text("",{fontFamily : 'Lato', fontSize: 24, fill : 0xffffff, align : 'left', wordWrap: true, wordWrapWidth: 290, strokeThickness: 4});
		summarize.text = String(this._currentValue) + " / " + String(this._maxValue);
		this._barValues = summarize;

		container.addChild(summarize);

		return container;
	}

	protected async updateBar(isPrimary: boolean, growing: boolean = false)
	{
		let x = this._mask.width - 30;
		await Tweener.add
		(
			{
				target: this._mask,
				duration: 0.5, ease: Easing.easeInOutCubic,
				onUpdate: () => this._mask.getBounds()
			},
			{
				width: x
			}
		);
	}
}
