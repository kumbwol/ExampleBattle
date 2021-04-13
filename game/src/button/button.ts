import * as PIXI from "pixi.js";
import { ButtonState } from "./buttonState";
import { Main } from "../main";
import { GameEvent } from "../event/gameEvent";

export class Button
{
	private _buttonContainer: PIXI.Container;
	private _normalTexture: PIXI.Texture;
	private _hoverTexture: PIXI.Texture;
	private _pressedTexture: PIXI.Texture;
	private _buttonSprite: PIXI.Sprite;
	private _dispatcher: PIXI.Container;
	private _isActive: boolean;
	private _isDisabled: boolean;
	private _buttonText: PIXI.Text;
	private _textStyles: PIXI.TextStyle[];

	private _buttonState: ButtonState;

	constructor(dispatcher: PIXI.Container, normal: PIXI.Texture, hover: PIXI.Texture, pressed: PIXI.Texture, event: GameEvent, buttonText: PIXI.Text = null, textStyles: PIXI.TextStyle[] = null, fixWidthToTextStyle: boolean = false)
	{
		this._isActive = false;
		this._isDisabled = false;
		this._dispatcher = dispatcher;
		this._buttonContainer = new PIXI.Container;
		this.createButton(normal, hover, pressed, event, buttonText, textStyles, fixWidthToTextStyle);
	}

	private createButton(normal: PIXI.Texture, hover: PIXI.Texture, pressed: PIXI.Texture, event: GameEvent, buttonText: PIXI.Text = null, textStyles: PIXI.TextStyle[] = null, fixWidthToTextStyle = false)
	{
		this._normalTexture = normal;
		this._hoverTexture = hover;
		this._pressedTexture = pressed;

		this._buttonSprite = new PIXI.Sprite(this._normalTexture);

		this._buttonSprite.hitArea = new PIXI.Rectangle(this._buttonSprite.x, this._buttonSprite.y, this._buttonSprite.width, this._buttonSprite.height);//new HitAreaCreator().hitAreaRectangle(this._buttonSprite.x, this._buttonSprite.y, this._buttonSprite.width, this._buttonSprite.height);
		this._buttonSprite.interactive = true;
		if(event !== null)
		{
			this.addButtonListener(event);
		}

		this._buttonContainer.addChild(this._buttonSprite);

		if(buttonText !== null)
		{
			this._buttonText = buttonText;
			const textContainer = new PIXI.Container;
			textContainer.addChild(buttonText);
			this._buttonContainer.addChild(textContainer);

			if(textStyles)
			{
				this._textStyles = textStyles;
				buttonText.style = textStyles[ButtonState.normal];

				if(fixWidthToTextStyle)
				{
					this._buttonSprite.width = textContainer.width;
					this._buttonSprite.height = textContainer.height;
				}
			}

			if(buttonText.x === 0)
			{
				textContainer.x = Math.floor(this._buttonContainer.width / 2) - Math.floor(textContainer.width / 2);
			}

			if(buttonText.y === 0)
			{
				textContainer.y = Math.floor(this._buttonContainer.height / 2) - Math.floor(textContainer.height / 2);
			}
		}
	}

	private addButtonListener(event: GameEvent)
	{
		this._buttonSprite.on("pointerover", () =>
		{
			if(this._isDisabled)
			{
				Main.cursor.changeCursor();
			}
			else if(this.button.alpha !== 0)
			{
				Main.cursor.pointerCursor();
				this._buttonState = ButtonState.hover;
				this._buttonSprite.texture = this._hoverTexture;
				this.setButtonText(ButtonState.hover);
			}
		});

		this._buttonSprite.on("pointerout", () =>
		{
			Main.cursor.changeCursor();
			this._buttonState = ButtonState.normal;
			this._buttonSprite.texture = this._normalTexture;
			this.setButtonText(ButtonState.normal);
		});

		this._buttonSprite.on("pointerdown", () =>
		{
			if(this.button.alpha !== 0)
			{
				Main.cursor.changeCursor();
				this._buttonState = ButtonState.pressed;
				this._buttonSprite.texture = this._pressedTexture;
				this.setButtonText(ButtonState.pressed);
			}
		});

		this._buttonSprite.on("pointerup", () =>
		{
			if(this._buttonState === ButtonState.pressed && this.button.alpha !== 0)
			{
				this._isActive = false;
				this._dispatcher.emit(event.name, event.args, event.args2);
				this._buttonSprite.texture = this._normalTexture;
				this.setButtonText(ButtonState.normal);
			}
		});
	}

	private setButtonText(state: ButtonState)
	{
		if(this._buttonText)
		{
			if(this._textStyles)
			{
				this._buttonText.style = this._textStyles[state];
			}
		}
	}

	get button(): PIXI.Container
	{
		return this._buttonContainer;
	}

	set isActive(isActive: boolean)
	{
		this._buttonSprite.interactive = isActive;
	}

	get isActive(): boolean
	{
		return this._buttonSprite.interactive;
	}

	set isDisabled(isDisabled: boolean)
	{
		this._isDisabled = isDisabled;
	}
}
