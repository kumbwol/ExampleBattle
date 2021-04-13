import { SkillEvent } from "../event/skillEvent";
import { Effect } from "./effect";
import { Skill } from "../controller/skill";
import { EffectTypes } from "./effectTypes";
import { BarEvent } from "../../battle/panel/Bars/event/barEvent";
import { Player } from "../../player/player";
import { Enemy } from "../../enemy/enemy";
import { EffectEvent } from "./event/effectEvent";
import { FieldTypes } from "../../battle/field/fieldTypes";

export class EffectActivision
{
	private _primaryEffect: Effect;
	private _secondaryEffect: Effect;
	private readonly _dispatcher: PIXI.Container;
	private readonly _enemy: Enemy;
	private readonly _player: Player;
	private _playersTurn: boolean;

	constructor(dispatcher: PIXI.Container, player: Player, enemy: Enemy)
	{
		this.addEventListeners(dispatcher);
		this._enemy = enemy;
		this._player = player;
		this._dispatcher = dispatcher;
		this._playersTurn = true;
	}

	private addEventListeners(dispatcher: PIXI.Container)
	{
		dispatcher.on(SkillEvent.EV_SKILL_SELECTED, (e, skill: Skill) =>
		{
			this._primaryEffect = skill.primaryEffect;
			this._secondaryEffect = skill.secondaryEffect;
		});

		dispatcher.on(SkillEvent.EV_ENEMY_SKILL_SELECTED, (skill: Skill) =>
		{
			this._primaryEffect = skill.primaryEffect;
			this._secondaryEffect = skill.secondaryEffect;
		});

		dispatcher.on(SkillEvent.EV_ACTIVATE_ENEMY_SKILL, () =>
		{
			this._playersTurn = false;
			this.activateEffects(this._primaryEffect, true);
		});

		dispatcher.on(SkillEvent.EV_PLAYER_SKILL_STARTED, () =>
		{
			this._playersTurn = true;
			this.activateEffects(this._primaryEffect, true);
		});

		dispatcher.on(EffectEvent.EV_PRIMARY_EFFECT_FINISHED, () =>
		{
			this.activateEffects(this._secondaryEffect, false);
		});

		dispatcher.on(EffectEvent.EV_POISON_DAMAGE, (effect: Effect) =>
		{
			this._playersTurn = false;
			this.activateEffects(effect, false, true);
		});
	}

	private activateEffects(effect: Effect, isPrimary: boolean, isPoison: boolean = false)
	{
		switch(effect.effectType)
		{
			case EffectTypes.damage:
				if(this._playersTurn)
				{
					if(effect.effectValue <= this._enemy.shield)
					{
						this._enemy.shield -= effect.effectValue;
						this._dispatcher.emit(BarEvent.EV_UPDATE_SHIELD, this._enemy.shield, false, this._playersTurn, isPrimary);
					}
					else if(this._enemy.shield > 0)
					{
						this._enemy.hp -= (effect.effectValue - this._enemy.shield);
						if(this._enemy.hp < 0) this._enemy.hp = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._enemy.hp, false, this._playersTurn, isPrimary);
						this._enemy.shield = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_SHIELD, this._enemy.shield, false, this._playersTurn, isPrimary);
					}
					else
					{
						this._enemy.hp -= effect.effectValue;
						if(this._enemy.hp < 0) this._enemy.hp = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._enemy.hp, false, this._playersTurn, isPrimary);
					}
				}
				else
				{
					if(effect.effectValue <= this._player.shield)
					{
						this._player.shield -= effect.effectValue;
						this._dispatcher.emit(BarEvent.EV_UPDATE_SHIELD, this._player.shield, true, this._playersTurn, isPrimary, isPoison);
					}
					else if(this._player.shield > 0)
					{
						this._player.hp -= (effect.effectValue - this._player.shield);
						if(this._player.hp < 0) this._player.hp = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._player.hp, true, this._playersTurn, isPrimary, isPoison);
						this._player.shield = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_SHIELD, this._player.shield, true, this._playersTurn, isPrimary, isPoison);
					}
					else
					{
						this._player.hp -= effect.effectValue;
						if(this._player.hp < 0) this._player.hp = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._player.hp, true, this._playersTurn, isPrimary, isPoison);
					}
				}
				this._dispatcher.emit(EffectEvent.EV_TAKE_DAMAGE, effect.effectValue, this._playersTurn);

				break;

			case EffectTypes.sacrifice:
				if(this._playersTurn)
				{
					if(effect.effectValue <= this._player.shield)
					{
						this._player.shield -= effect.effectValue;
						this._dispatcher.emit(BarEvent.EV_UPDATE_SHIELD, this._player.shield, true, this._playersTurn, isPrimary);
					}
					else if(this._player.shield > 0)
					{
						this._player.hp -= (effect.effectValue - this._player.shield);
						if(this._player.hp < 0) this._player.hp = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._player.hp, true, this._playersTurn, isPrimary);
						this._player.shield = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_SHIELD, this._player.shield, true, this._playersTurn, isPrimary);
					}
					else
					{
						this._player.hp -= effect.effectValue;
						if(this._player.hp < 0) this._player.hp = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._player.hp, true, this._playersTurn, isPrimary);
					}
				}
				else
				{
					if(effect.effectValue <= this._enemy.shield)
					{
						this._enemy.shield -= effect.effectValue;
						this._dispatcher.emit(BarEvent.EV_UPDATE_SHIELD, this._enemy.shield, false, this._playersTurn, isPrimary);
					}
					else if(this._enemy.shield > 0)
					{
						this._enemy.hp -= (effect.effectValue - this._enemy.shield);
						if(this._enemy.hp < 0) this._enemy.hp = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._enemy.hp, false, this._playersTurn, isPrimary);
						this._enemy.shield = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_SHIELD, this._enemy.shield, false, this._playersTurn, isPrimary);
					}
					else
					{
						this._enemy.hp -= effect.effectValue;
						if(this._enemy.hp < 0) this._enemy.hp = 0;
						this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._enemy.hp, false, this._playersTurn, isPrimary);
					}
				}
				this._dispatcher.emit(EffectEvent.EV_TAKE_DAMAGE, effect.effectValue, !this._playersTurn);

				break;

			case EffectTypes.penetrate:
				if(this._playersTurn)
				{
					this._enemy.hp -= effect.effectValue;
					if(this._enemy.hp < 0) this._enemy.hp = 0;
					this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._enemy.hp, false, this._playersTurn, isPrimary);
				}
				else
				{
					this._player.hp -= effect.effectValue;
					if(this._player.hp < 0) this._player.hp = 0;
					this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._player.hp, true, this._playersTurn, isPrimary);
				}
				this._dispatcher.emit(EffectEvent.EV_TAKE_PENETRATE_DAMAGE, effect.effectValue, this._playersTurn);

				break;

			case EffectTypes.bloodOath:
				if(this._playersTurn)
				{
					this._player.hp -= effect.effectValue;
					if(this._player.hp < 0) this._player.hp = 0;
					this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._player.hp, true, this._playersTurn, isPrimary);
				}
				else
				{
					this._enemy.hp -= effect.effectValue;
					if(this._enemy.hp < 0) this._enemy.hp = 0;
					this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._enemy.hp, false, this._playersTurn, isPrimary);
				}
				this._dispatcher.emit(EffectEvent.EV_TAKE_PENETRATE_DAMAGE, effect.effectValue, !this._playersTurn);

				break;

			case EffectTypes.heal:
				if(this._playersTurn)
				{
					this._player.hp += effect.effectValue;
					if(this._player.hp > this._player.maxHp)
					{
						this._player.hp = this._player.maxHp;
					}
					this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._player.hp, true, this._playersTurn, isPrimary);
				}
				else
				{
					this._enemy.hp += effect.effectValue;
					if(this._enemy.hp > this._enemy.maxHp)
					{
						this._enemy.hp = this._enemy.maxHp;
					}
					this._dispatcher.emit(BarEvent.EV_UPDATE_HP_BAR, this._enemy.hp, false, this._playersTurn, isPrimary);
				}
				this._dispatcher.emit(EffectEvent.EV_HEAL, effect.effectValue, this._playersTurn);

				break;

			case EffectTypes.manaRegen:
				if(this._playersTurn)
				{
					this._player.mp += effect.effectValue;
					if(this._player.mp > this._player.maxMp)
					{
						this._player.mp = this._player.maxMp;
					}
					this._dispatcher.emit(BarEvent.EV_UPDATE_MP_BAR, this._player.mp, true, this._playersTurn, isPrimary, true);
				}
				else
				{
					this._enemy.mp += effect.effectValue;
					if(this._enemy.mp > this._enemy.maxMp)
					{
						this._enemy.mp = this._enemy.maxMp;
					}
					this._dispatcher.emit(BarEvent.EV_UPDATE_MP_BAR, this._enemy.mp, false, this._playersTurn, isPrimary, true);
				}
				this._dispatcher.emit(EffectEvent.EV_GAIN_MANA, effect.effectValue, this._playersTurn);

				break;

			case EffectTypes.manaDrain:
				if(this._playersTurn)
				{
					this._enemy.mp -= effect.effectValue;
					if(this._enemy.mp < 0) this._enemy.mp = 0;
					this._dispatcher.emit(BarEvent.EV_UPDATE_MP_BAR, this._enemy.mp, false, this._playersTurn, isPrimary, true);
				}
				else
				{
					this._player.mp -= effect.effectValue;
					if(this._player.mp < 0) this._player.mp = 0;
					this._dispatcher.emit(BarEvent.EV_UPDATE_MP_BAR, this._player.mp, true, this._playersTurn, isPrimary, true);
				}
				this._dispatcher.emit(EffectEvent.EV_LOSE_MANA, effect.effectValue, !this._playersTurn);

				break;

			case EffectTypes.manaCost:
				if(this._playersTurn)
				{
					this._player.mp -= effect.effectValue;
					if(this._player.mp <= 0)
					{
						this._player.mp = 0;
					}
					this._dispatcher.emit(BarEvent.EV_UPDATE_MP_BAR, this._player.mp, true, this._playersTurn, isPrimary, true);
				}
				else
				{
					this._enemy.mp -= effect.effectValue;
					if(this._enemy.mp <= 0)
					{
						this._enemy.mp = 0;
					}
					this._dispatcher.emit(BarEvent.EV_UPDATE_MP_BAR, this._enemy.mp, false, this._playersTurn, isPrimary, true);
				}
				this._dispatcher.emit(EffectEvent.EV_LOSE_MANA, effect.effectValue, this._playersTurn);
				break;

			case EffectTypes.shield:
				if(this._playersTurn)
				{
					this._player.shield += effect.effectValue;
					this._dispatcher.emit(BarEvent.EV_UPDATE_SHIELD, this._player.shield, true, this._playersTurn, isPrimary);
				}
				else
				{
					this._enemy.shield += effect.effectValue;
					this._dispatcher.emit(BarEvent.EV_UPDATE_SHIELD, this._enemy.shield, false, this._playersTurn, isPrimary);
				}
				this._dispatcher.emit(EffectEvent.EV_GET_SHIELD, effect.effectValue, this._playersTurn);
				break;

			case EffectTypes.tempo:
				//this._player.abilityPoint += effect.effectValue;
				this._dispatcher.emit(EffectEvent.EV_GET_ABILITY_TEMPO, effect.effectValue, this._playersTurn, isPrimary);
				break;

			case EffectTypes.jokerform:
				this._dispatcher.emit(EffectEvent.EV_FIELD_TRANSFORM, FieldTypes.joker, effect.effectValue, isPrimary, this._playersTurn);
				break;

			case EffectTypes.attackform:
				this._dispatcher.emit(EffectEvent.EV_FIELD_TRANSFORM, FieldTypes.attack, effect.effectValue, isPrimary, this._playersTurn);
				break;

			case EffectTypes.magicform:
				this._dispatcher.emit(EffectEvent.EV_FIELD_TRANSFORM, FieldTypes.magic, effect.effectValue, isPrimary, this._playersTurn);
				break;

			case EffectTypes.moveform:
				this._dispatcher.emit(EffectEvent.EV_FIELD_TRANSFORM, FieldTypes.move, effect.effectValue, isPrimary, this._playersTurn);
				break;

			case EffectTypes.defenseform:
				this._dispatcher.emit(EffectEvent.EV_FIELD_TRANSFORM, FieldTypes.defense, effect.effectValue, isPrimary, this._playersTurn);
				break;

			case EffectTypes.poison:
				this._dispatcher.emit(EffectEvent.EV_FIELD_POISON, effect.effectValue, effect.poisonDamage, isPrimary, this._playersTurn);
				break;

			case EffectTypes.freeze:
				this._dispatcher.emit(EffectEvent.EV_FREEZE_TABLE, effect.effectValue, isPrimary, this._playersTurn);
				break;

			case EffectTypes.paralyze:
				this._dispatcher.emit(EffectEvent.EV_FIELD_PARALYZE, effect.effectValue, isPrimary, this._playersTurn);
				break;

			case EffectTypes.stun:
				this._dispatcher.emit(EffectEvent.EV_FIELD_STUN, effect.effectValue, isPrimary, this._playersTurn);
				break;

			case EffectTypes.poisonDamage:
			case EffectTypes.noEffect:
				if(isPrimary)
				{
					this._dispatcher.emit(EffectEvent.EV_PRIMARY_EFFECT_FINISHED);
				}
				else
				{
					if(this._playersTurn)
					{
						this._dispatcher.emit(SkillEvent.EV_PLAYER_SKILL_FINISHED);
					}
					this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, this._playersTurn);
				}
				break;
		}
	}
}
