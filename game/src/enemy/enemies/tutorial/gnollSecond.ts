import { Enemy } from "../../enemy";
import { EnemySkill } from "../../../skill/controller/enemySkill";
import { ChanceTypes } from "../../chance/chanceTypes";
import { Chance } from "../../chance/chance";
import { EffectTypes } from "../../../skill/effect/effectTypes";
import * as PIXI from "pixi.js";

export class GnollSecond extends Enemy
{
	constructor()
	{
		super();

		this._hp = 15;
		this._maxHp = 15;
		this._mp = 0;
		this._maxMp = 0;
		this.shield = 0;

		this._portrait = PIXI.Texture.from("portrait/enemy/gnollSecond.png");

		let basicDamageSkill: EnemySkill[] = [];
		let premiumDamageSkill: EnemySkill[] = [];

		basicDamageSkill.push(new EnemySkill({
			chance: new Chance(ChanceTypes.luck, 70),
			primaryEffect: {effectType: EffectTypes.damage, effectValue: 3},
			secondaryEffect: {effectType: EffectTypes.noEffect, effectValue: 0},
			name: "Vágás"
		}));

		premiumDamageSkill.push(new EnemySkill({
			chance: new Chance(ChanceTypes.luck, 30),
			primaryEffect: {effectType: EffectTypes.penetrate, effectValue: 2},
			secondaryEffect: {effectType: EffectTypes.noEffect, effectValue: 0},
			name: "Döfés"
		}));

		this._skills.push(basicDamageSkill);
		this._skills.push(premiumDamageSkill);
	}
}
