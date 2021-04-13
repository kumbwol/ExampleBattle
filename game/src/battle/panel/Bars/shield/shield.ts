import * as PIXI from "pixi.js";
import { BarEvent } from "../event/barEvent";
import { EffectEvent } from "../../../../skill/effect/event/effectEvent";
import { Easing, Tweener } from "pixi-tweener";
import { SkillEvent } from "../../../../skill/event/skillEvent";

export class Shield
{
	private _dispatcher: PIXI.Container;
	private _shieldContainer: PIXI.Container;
	private _numberContainer: PIXI.Container;
	private _numberText: PIXI.Text;
	private _shieldOld: number;
	private _shield: number;
	private _isPlayersShield: boolean;
	private _shieldContainerOriginalWidth: number;
	private _playersTurn: boolean;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container, shield: number, isPlayersShield: boolean)
	{
		this._isPlayersShield = isPlayersShield;
		this._dispatcher = dispatcher;
		this._shield = shield;
		this._shieldOld = shield;
		this.createShield(parentContainer, shield);

		dispatcher.on(BarEvent.EV_UPDATE_SHIELD, (newShield: number, isPlayer: boolean, isPlayersTurn: boolean, isPrimary: boolean, isPoison = false) =>
		{
			if(isPlayer === this._isPlayersShield)
			{
				this._playersTurn = isPlayersTurn;
				this._shieldOld = this._shield;
				this._shield = newShield;
				this.updateShield(isPrimary, newShield === 0, isPoison);
			}
		});
	}

	protected async updateShield(isPrimary: boolean, shouldRemove: boolean, isPoison: boolean = false)
	{
		const counterHelper = new PIXI.Graphics;
		counterHelper.x = this._shieldOld;
		this._shieldContainer.alpha = 1;
		await Tweener.add
		(
			{
				target: counterHelper,
				duration: 0.6, ease: Easing.linear,
				onUpdate: () =>
				{
					this._numberText.text = String(Math.floor(counterHelper.x));
					this.updateNumberPosition();
				}
			},
			{
				x: this._shield
			}
		);

		if(shouldRemove)
		{
			this.vanishShield();
		}

		await Tweener.add
		(
			{
				target: null,
				duration: 1
			},
			{

			}
		);
		if(isPrimary)
		{
			this._dispatcher.emit(EffectEvent.EV_PRIMARY_EFFECT_FINISHED);
		}
		else
		{
			if (this._playersTurn && !isPoison)
			{
				this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_FINISHED);
			}
			if(isPoison)
			{
				this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, true);
			}
			else
			{
				this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, this._playersTurn);
			}
		}
	}

	private createShield(parentContainer: PIXI.Container, shield: number)
	{
		this._shieldContainer = new PIXI.Container;
		this._numberContainer = new PIXI.Container;
		const shieldTexture = PIXI.Texture.from("shieldNew.png");
		let shieldSprite = new PIXI.Sprite(shieldTexture);

		this._shieldContainer.x = 280;

		this._shieldContainer.addChild(shieldSprite);

		this._shieldContainerOriginalWidth = this._shieldContainer.width;

		this._numberText = new PIXI.Text("",{fontFamily : 'Lato', fontSize: 26, fill : 0xffff00, align : 'left', wordWrap: true, wordWrapWidth: 290, strokeThickness: 4});
		this._numberContainer.addChild(this._numberText);
		this.updateNumberPosition();

		this._shieldContainer.addChild(this._numberContainer);
		parentContainer.addChild(this._shieldContainer);

		if(shield <= 0)
		{
			this._shieldContainer.alpha = 0;
		}
	}

	private async vanishShield()
	{
		await Tweener.add
		(
			{
				target: this._shieldContainer,
				duration: 0.3
			},
			{
				alpha: 0
			}
		);
	}

	private updateNumberPosition()
	{
		this._numberContainer.y = 0;
		this._numberContainer.x = Math.floor(this._shieldContainerOriginalWidth / 2) - Math.floor(this._numberContainer.width / 2);
	}
}
