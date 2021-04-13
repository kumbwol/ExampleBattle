import * as PIXI from "pixi.js";
import { Enemy } from "../enemy";
import { EnemySkill, IEnemySkill } from "../../skill/controller/enemySkill";
import { Chance } from "../chance/chance";
import { ChanceTypes } from "../chance/chanceTypes";
import { EffectTypes } from "../../skill/effect/effectTypes";
import { Effect } from "../../skill/effect/effect";

export class PixiEnemy extends Enemy
{
	constructor()
	{
		super();

		this._hp = 20;
		this._maxHp = 20;
		this._mp = 0;
		this._maxMp = 30;
		this.shield = 0;

		for(let i=0; i<6; i++)
		{
			this._skills[i] = [];
		}

		this._portrait = PIXI.Texture.from("portrait/enemy/pixi.png");

		/*this._skills[0].push(new EnemySkill(new Chance(
			ChanceTypes.luck, 75
		), new Effect(EffectTypes.damage, 3), new Effect(EffectTypes.noEffect, 0), "Csípés"));

		this._skills[1].push(new EnemySkill(new Chance(
			ChanceTypes.luck, 75
		), new Effect(EffectTypes.damage, 3), new Effect(EffectTypes.damage, 4), "Karmolás"));

		this._skills[2].push(new EnemySkill(new Chance(
			ChanceTypes.luck, 30
		), new Effect(EffectTypes.shield, 4), new Effect(EffectTypes.heal, 3), "Bújócska"));*/

		for(let i=5; i>=0; i--)
		{
			if(this._skills[i].length === 0)
			{
				this._skills.splice(i,1);
			}
		}

		let regenSkill: EnemySkill[] =  [];
		let luckSkill: EnemySkill[] =  [];

		regenSkill.push(new EnemySkill({
			chance: new Chance(ChanceTypes.confidence, 0),
			primaryEffect: {effectType: EffectTypes.manaRegen, effectValue: 9},
			secondaryEffect: {effectType: EffectTypes.manaRegen, effectValue: 9},
			name: "regen"
		}));

		luckSkill.push(new EnemySkill({
			chance: new Chance(ChanceTypes.luck, 100),
			primaryEffect: {effectType: EffectTypes.shield, effectValue: 9},
			secondaryEffect: {effectType: EffectTypes.manaRegen, effectValue: 9},
			name: "shield"
		}));

		this._skills.push(regenSkill);
		this._skills.push(luckSkill);

		/*this._skills.push(new EnemySkill(new Chance(
			ChanceTypes.luck, 50
		), new Effect(EffectTypes.noEffect, 9), new Effect(EffectTypes.damage, 28)));

		this._skills.push(new EnemySkill(new Chance(
			ChanceTypes.luck, 50
		), new Effect(EffectTypes.noEffect, 9), new Effect(EffectTypes.damage, 28)));

		this._skills.push(new EnemySkill(new Chance(
			ChanceTypes.luck, 50
		), new Effect(EffectTypes.noEffect, 9), new Effect(EffectTypes.damage, 28)));

		this._skills.push(new EnemySkill(new Chance(
			ChanceTypes.luck, 50
		), new Effect(EffectTypes.noEffect, 9), new Effect(EffectTypes.damage, 28)));*/
	}
}
