import * as PIXI from "pixi.js";
import { FieldEvent } from "../../field/event/fieldEvent";
import { Player } from "../../../player/player";
import { AbilityEvent } from "../event/abilityEvent";
import { SkillEvent } from "../../../skill/event/skillEvent";
import { BooleanClass } from "../../../booleanClass";
import { EffectEvent } from "../../../skill/effect/event/effectEvent";
import { Tweener } from "pixi-tweener";

export class AbilityPointView
{
	private _abilityPoint: number;
	private _abilityPointValue: PIXI.Text;
	private _abilityPointValueHolder: PIXI.Container;
	private _abilityPointHolder: PIXI.Container;
	private _abilityPointHolderOriginalWidth: number;
	private _abilityPointHolderOriginalHeight: number;
	private _dispatcher: PIXI.Container;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container, player: Player)
	{
		this._abilityPoint = player.abilityPoint;
		this._dispatcher = dispatcher;

		parentContainer.addChild(this.createAbilityPointCounter());

		dispatcher.on(FieldEvent.EV_FIELD_RESWAP, (redoAbility: BooleanClass) =>
		{
			if(!redoAbility.boolean)
			{
				if(player.abilityPoint === 0) dispatcher.emit(AbilityEvent.EV_HAVE_MORE_ABILITIES);
				player.abilityPoint++;
				this.update(player.abilityPoint);
			}
		});

		dispatcher.on(FieldEvent.EV_FIELD_SWAPPED, (isReswap: boolean) =>
		{
			if(!isReswap)
			{
				if(player.abilityPoint > 0) player.abilityPoint--;
				if(player.abilityPoint === 0) dispatcher.emit(AbilityEvent.EV_NO_MORE_ABILITIES);
				this.update(player.abilityPoint);
			}
		});

		dispatcher.on(SkillEvent.EV_ENEMY_FINISHED_TURN, () =>
		{
			player.abilityPoint = player.maxAbilityPoint;
			this.update(player.abilityPoint);
		});

		dispatcher.on(EffectEvent.EV_GET_ABILITY_TEMPO, (extraAbility: number, playersTurn: boolean, isPrimary: boolean) =>
		{
			this.activeTempo(player, extraAbility, playersTurn, isPrimary);
		});
	}

	private async activeTempo(player: Player, extraAbility: number, playersTurn: boolean, isPrimary: boolean)
	{
		player.abilityPoint += extraAbility;

		if(player.abilityPoint > 0)
		{
			this._dispatcher.emit(AbilityEvent.EV_HAVE_MORE_ABILITIES);
		}

		this.update(player.abilityPoint);

		//TODO: FIX THIS HACK - BattleLogicController
		await Tweener.add(
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
			if(playersTurn)
			{
				this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_FINISHED);
			}
			this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, playersTurn);
		}
	}

	private createAbilityPointCounter(): PIXI.Container
	{
		this._abilityPointHolder = new PIXI.Container;

		const abilityPointHolderTexture = PIXI.Texture.from("abilityHolder.png");
		let abilityPointHolderSprite = new PIXI.Sprite(abilityPointHolderTexture);

		this._abilityPointHolder.addChild(abilityPointHolderSprite);
		this._abilityPointHolderOriginalWidth = this._abilityPointHolder.width;
		this._abilityPointHolderOriginalHeight = this._abilityPointHolder.height;

		this._abilityPointValue = new PIXI.Text("",{fontFamily : 'Lato', fontSize: 68, fill : 0xffffff, align : 'left', wordWrap: true, wordWrapWidth: 290, strokeThickness: 4});
		this._abilityPointValue.text = String(this._abilityPoint);
		this._abilityPointValueHolder = new PIXI.Container;
		this._abilityPointValueHolder.addChild(this._abilityPointValue);
		this._abilityPointHolder.addChild(this._abilityPointValueHolder);

		this.update(this._abilityPoint);

		this._abilityPointHolder.x = 400;
		this._abilityPointHolder.y = 825;

		return this._abilityPointHolder;
	}

	private update(abilityPoint: number)
	{
		const offsetY = 2;
		this._abilityPointValue.text = String(abilityPoint);
		this._abilityPointValueHolder.y = Math.floor(this._abilityPointHolderOriginalHeight / 2) - Math.floor(this._abilityPointValueHolder.height / 2) - offsetY;
		this._abilityPointValueHolder.x = Math.floor(this._abilityPointHolderOriginalWidth / 2) - Math.floor(this._abilityPointValueHolder.width / 2) + 1;
	}
}
