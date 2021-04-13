import * as PIXI from "pixi.js";
import { EffectEvent } from "../../../skill/effect/event/effectEvent";
import { Easing, Tweener } from "pixi-tweener";

export class PortraitPopUpNumber
{
	private _numberContainer: PIXI.Container;
	private _numberText: PIXI.Text;
	private _manaGainStyle: PIXI.TextStyle;
	private _manaLoseStyle: PIXI.TextStyle;
	private _damageStyle: PIXI.TextStyle;
	private _penetrateStyle: PIXI.TextStyle;
	private _healStyle: PIXI.TextStyle;
	private _shieldStyle: PIXI.TextStyle;
	private _portraitWidth: number;

	constructor(dispatcher: PIXI.Container, portraitContainer: PIXI.Container, isPlayer: boolean)
	{
		this._portraitWidth = portraitContainer.width;
		this.createStyles();
		this.createNumber(portraitContainer);

		dispatcher.on(EffectEvent.EV_TAKE_PENETRATE_DAMAGE, (number: number, playerTakesDamage: boolean) =>
		{
			if(playerTakesDamage === !isPlayer)
			{
				this._numberText.style = this._penetrateStyle;
				this._numberText.text = "-" + String(number);
				this.updateNumberPosition();
				this.animateNumber();
			}
		});

		dispatcher.on(EffectEvent.EV_TAKE_DAMAGE, (number: number, playerTakesDamage: boolean) =>
		{
			if(playerTakesDamage === !isPlayer)
			{
				this._numberText.style = this._damageStyle;
				this._numberText.text = "-" + String(number);
				this.updateNumberPosition();
				this.animateNumber();
			}
		});

		dispatcher.on(EffectEvent.EV_HEAL, (number: number, playerHeals: boolean) =>
		{
			if(playerHeals === isPlayer)
			{
				this._numberText.style = this._healStyle;
				this._numberText.text = "+" + String(number);
				this.updateNumberPosition();
				this.animateNumber();
			}
		});

		dispatcher.on(EffectEvent.EV_GAIN_MANA, (number: number, playerLosesMana: boolean) =>
		{
			if(playerLosesMana === isPlayer)
			{
				this._numberText.style = this._manaGainStyle;
				this._numberText.text = "+" + String(number);
				this.updateNumberPosition();
				this.animateNumber();
			}
		});

		dispatcher.on(EffectEvent.EV_LOSE_MANA, (number: number, playerLosesMana: boolean) =>
		{
			if(playerLosesMana === isPlayer)
			{
				this._numberText.style = this._manaLoseStyle;
				this._numberText.text = "-" + String(number);
				this.updateNumberPosition();
				this.animateNumber();
			}
		});

		dispatcher.on(EffectEvent.EV_GET_SHIELD, (number: number, playerGetsShield: boolean) =>
		{
			if(playerGetsShield === isPlayer)
			{
				this._numberText.style = this._shieldStyle;
				this._numberText.text = "+" + String(number);
				this.updateNumberPosition();
				this.animateNumber();
			}
		});
	}

	private createStyles()
	{
		this._damageStyle = new PIXI.TextStyle({fontFamily : 'Lato', fontSize: 120, fill : 0xFF0000, align : 'left', wordWrap: true, wordWrapWidth: 290, strokeThickness: 4});
		this._manaGainStyle = new PIXI.TextStyle({fontFamily : 'Lato', fontSize: 120, fill : 0x1F75FE, align : 'left', wordWrap: true, wordWrapWidth: 290, strokeThickness: 4});
		this._manaLoseStyle = new PIXI.TextStyle({fontFamily : 'Lato', fontSize: 120, fill : 0x0000FF, align : 'left', wordWrap: true, wordWrapWidth: 290, strokeThickness: 4});
		this._shieldStyle = new PIXI.TextStyle({fontFamily : 'Lato', fontSize: 120, fill : 0xA9A9A9, align : 'left', wordWrap: true, wordWrapWidth: 290, strokeThickness: 4});
		this._penetrateStyle = new PIXI.TextStyle({fontFamily : 'Lato', fontSize: 120, fill : 0x551A8B, align : 'left', wordWrap: true, wordWrapWidth: 290, strokeThickness: 4});
		this._healStyle = new PIXI.TextStyle({fontFamily : 'Lato', fontSize: 120, fill : 0x00FF00, align : 'left', wordWrap: true, wordWrapWidth: 290, strokeThickness: 4});
	}

	private createNumber(portraitContainer: PIXI.Container)
	{
		this._numberText = new PIXI.Text("");
		this._numberContainer = new PIXI.Container;
		this._numberContainer.addChild(this._numberText);

		this.updateNumberPosition();
		this._numberContainer.alpha = 0;

		portraitContainer.addChild(this._numberContainer);
	}

	private updateNumberPosition()
	{
		this._numberContainer.x = Math.floor(this._portraitWidth / 2) - Math.floor(this._numberContainer.width / 2);
		this._numberContainer.y = Math.floor(this._portraitWidth / 2) - Math.floor(this._numberContainer.height / 2);
	}


	private async animateNumber()
	{
		this._numberContainer.alpha = 1;
		let y = this._numberContainer.y;
		await Tweener.add
		(
			{
				target: this._numberContainer,
				duration: 0.2, ease: Easing.easeInOutCubic
			},
			{
				y: y - 70
			}
		);
		await Tweener.add
		(
			{
				target: this._numberContainer,
				duration: 0.2, ease: Easing.easeOutCubic
			},
			{
				y: y + 10
			}
		);
		await Tweener.add
		(
			{
				target: this._numberContainer,
				duration: 0.2, ease: Easing.easeInCubic
			},
			{
				y: y - 20
			}
		);
		await Tweener.add
		(
			{
				target: this._numberContainer,
				duration: 0.2, ease: Easing.easeOutCubic
			},
			{
				y: y + 3
			}
		);

		await Tweener.add
		(
			{
				target: this._numberContainer,
				duration: 0.2, ease: Easing.easeOutCubic
			},
			{
				y: y
			}
		);

		await Tweener.add
		(
			{
				target: this._numberContainer,
				duration: 0.3
			},
			{

			}
		);

		this._numberContainer.alpha = 0;
	}
}
