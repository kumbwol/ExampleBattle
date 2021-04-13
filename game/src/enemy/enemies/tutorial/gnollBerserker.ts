import { Enemy } from "../../enemy";
import { EnemySkill } from "../../../skill/controller/enemySkill";
import { ChanceTypes } from "../../chance/chanceTypes";
import { Chance } from "../../chance/chance";
import { EffectTypes } from "../../../skill/effect/effectTypes";
import * as PIXI from "pixi.js";

export class GnollBerserker extends Enemy
{
	constructor()
	{
		super();

		this._hp = 20;
		this._maxHp = 20;
		this._mp = 0;
		this._maxMp = 0;
		this.shield = 0;

		this._portrait = PIXI.Texture.from("portrait/enemy/gnollBerserker.png");

		let basicDamageSkill: EnemySkill[] = [];
		let premiumDamageSkill: EnemySkill[] = [];

		basicDamageSkill.push(new EnemySkill({
			chance: new Chance(ChanceTypes.luck, 100),
			primaryEffect: {effectType: EffectTypes.damage, effectValue: 2},
			secondaryEffect: {effectType: EffectTypes.noEffect, effectValue: 0},
			name: "Karmolás"
		}));

		premiumDamageSkill.push(new EnemySkill({
			chance: new Chance(ChanceTypes.rage, 0),
			primaryEffect: {effectType: EffectTypes.damage, effectValue: 3},
			secondaryEffect: {effectType: EffectTypes.damage, effectValue: 3},
			name: "Tépés"
		}));

		this._skills.push(basicDamageSkill);
		this._skills.push(premiumDamageSkill);
	}
}
