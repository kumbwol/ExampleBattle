import { Bar } from "../bar";
import * as PIXI from "pixi.js";
import { Easing, Tweener } from "pixi-tweener";
import { BarEvent } from "../event/barEvent";
import { EffectEvent } from "../../../../skill/effect/event/effectEvent";
import { SkillEvent } from "../../../../skill/event/skillEvent";
import { LogicEvent } from "../../../logic/event/logicEvent";

export class HpBar extends Bar
{
	private _hp: number;
	private _maxHp: number;
	private readonly _maxMaskWidth: number;
	private _isPlayerBar: boolean;
	private _playersTurn: boolean;
	private _battleOver: boolean;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container, hp: number, maxHp: number, isPlayersBar: boolean)
	{
		const hpBarTexture = PIXI.Texture.from("hpBar.png");
		super(dispatcher, parentContainer, hpBarTexture, 0, 0, hp, maxHp);
		this._hp = hp;
		this._maxHp = maxHp;
		this._maxMaskWidth = this._mask.width;
		this._isPlayerBar = isPlayersBar;
		this._battleOver = false;

		this._mask.width = Math.floor((this._hp/this._maxHp) * this._maxMaskWidth);

		dispatcher.on(BarEvent.EV_UPDATE_HP_BAR, (newHp: number, isPlayer: boolean, isPlayersTurn: boolean, isPrimary: boolean, isPoison: boolean = false) =>
		{
			if(isPlayer === isPlayersBar)
			{
				const growing = newHp > this._hp;
				this._playersTurn = isPlayersTurn;
				this._hp = newHp;
				this.updateBar(isPrimary, growing, isPoison);
			}
		});
	}

	protected async updateBar(isPrimary: boolean, growing: boolean, isPoison: boolean = false)
	{
		await Tweener.add
		(
			{
				target: this._mask,
				duration: 0.6, ease: Easing.linear,
				onUpdate: () =>
				{
					if(((Math.round(this._mask.width / this._maxMaskWidth * this._maxHp) >= this._hp) && !growing) || ((Math.round(this._mask.width / this._maxMaskWidth * this._maxHp) <= this._hp) && growing))
					{
						this._barValues.text = String(Math.round(this._mask.width / this._maxMaskWidth * this._maxHp)) + " / " + String(this._maxHp);
						this.positionToMiddle(this._parentContainer, this._valuesContainer);
						if(!this._isPlayerBar)
						{
							this._dispatcher.emit(BarEvent.EV_HP_BAR_UPDATED, Math.round(this._mask.width / this._maxMaskWidth * this._maxHp), this._maxHp);
						}
					}
					this._mask.getBounds();
				}
			},
			{
				width: Math.floor((this._hp/this._maxHp) * this._maxMaskWidth)
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
		if(this._hp === 0 && !this._battleOver)
		{
			this._battleOver = true;
			if(this._isPlayerBar)
			{
				this._dispatcher.emit(LogicEvent.EV_LOSE_BATTLE);
			}
			else
			{
				this._dispatcher.emit(LogicEvent.EV_WIN_BATTLE);
			}
		}
		if(isPrimary)
		{
			this._dispatcher.emit(EffectEvent.EV_PRIMARY_EFFECT_FINISHED);
		}
		else
		{
			if(this._playersTurn  && !isPoison)
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
}
