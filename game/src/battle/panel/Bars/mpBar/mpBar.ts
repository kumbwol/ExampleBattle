import { Bar } from "../bar";
import * as PIXI from "pixi.js";
import { Easing, Tweener } from "pixi-tweener";
import { BarEvent } from "../event/barEvent";
import { EffectEvent } from "../../../../skill/effect/event/effectEvent";
import { SkillEvent } from "../../../../skill/event/skillEvent";

export class MpBar extends Bar
{
	private _mp: number;
	private _maxMp: number;
	private readonly _maxMaskWidth: number;
	private _isPlayerBar: boolean;
	private _playersTurn: boolean;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container, mp: number, maxMp: number, isPlayersBar: boolean)
	{
		const mpBarTexture = PIXI.Texture.from("mpBar.png");
		super(dispatcher, parentContainer, mpBarTexture, 0, 27, mp, maxMp);

		this._mp = mp;
		this._maxMp = maxMp;
		this._maxMaskWidth = this._mask.width;
		this._isPlayerBar = isPlayersBar;

		this._mask.width = Math.floor((this._mp/this._maxMp) * this._maxMaskWidth);

		if(!isPlayersBar)
		{
			dispatcher.emit(BarEvent.EV_MP_BAR_UPDATED, mp);
		}

		dispatcher.on(BarEvent.EV_UPDATE_MP_BAR, (newMp: number, isPlayer: boolean, isPlayersTurn: boolean, isPrimary: boolean, isSkillActivision = false) =>
		{
			if(isPlayer === isPlayersBar)
			{
				const growing = newMp > this._mp;
				this._playersTurn = isPlayersTurn;
				this._mp = newMp;
				this.updateBar(isPrimary, growing, isSkillActivision);
			}
		});
	}

	protected async updateBar(isPrimary: boolean, growing: boolean, isSkillActivision: boolean = false)
	{
		await Tweener.add
		(
			{
				target: this._mask,
				duration: 0.6, ease: Easing.linear,
				onUpdate: () =>
				{
					if(((Math.round(this._mask.width / this._maxMaskWidth * this._maxMp) >= this._mp) && !growing) || ((Math.round(this._mask.width / this._maxMaskWidth * this._maxMp) <= this._mp) && growing))
					{
						this._barValues.text = String(Math.round(this._mask.width / this._maxMaskWidth * this._maxMp)) + " / " + String(this._maxMp);
						this.positionToMiddle(this._parentContainer, this._valuesContainer);
						this._dispatcher.emit(BarEvent.EV_MP_BAR_UPDATED, Math.round(this._mask.width / this._maxMaskWidth * this._maxMp));
					}
					this._mask.getBounds();
				}
			},
			{
				width: Math.floor((this._mp/this._maxMp) * this._maxMaskWidth)
			}
		);
		await Tweener.add
		(
			{
				target: this._mask,
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
			if(this._playersTurn)
			{
				if(isSkillActivision) this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_FINISHED);
			}
			this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, this._playersTurn);
		}
	}
}
