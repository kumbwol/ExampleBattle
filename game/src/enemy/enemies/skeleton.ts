import * as PIXI from "pixi.js";
import { Enemy } from "../enemy";

export class Skeleton extends Enemy
{
	constructor()
	{
		super();

		this._hp = 100;
		this._maxHp = 100;
		this._mp = 100;
		this._maxMp = 100;
		this.shield = 0;

		for(let i=0; i<4; i++)
		{
			this._skills[i] = [];
		}

		this._portrait = PIXI.Texture.from("portrait/enemy/skeleton.png");

		/*this._skills[0].push(new EnemySkill(new Chance(
			ChanceTypes.luck, 100
		), new Effect(EffectTypes.poison, 10, 3), new Effect(EffectTypes.poisonDamage, 3)));

		this._skills[1].push(new EnemySkill(new Chance(
			ChanceTypes.rage, 0
		), new Effect(EffectTypes.manaRegen, 4), new Effect(EffectTypes.manaRegen, 7)));

		this._skills[2].push(new EnemySkill(new Chance(
			ChanceTypes.luck, 0
		), new Effect(EffectTypes.damage, 44), new Effect(EffectTypes.damage, 54)));

		this._skills[3].push(new EnemySkill(new Chance(
			ChanceTypes.stuck, 0
		), new Effect(EffectTypes.shield, 7), new Effect(EffectTypes.damage, 8)));*/


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
