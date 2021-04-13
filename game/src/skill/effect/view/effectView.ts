import { EffectTypes } from "../effectTypes";
import * as PIXI from "pixi.js";

export class EffectView
{
	private _effectSprite: PIXI.Sprite;

	constructor(effectType: EffectTypes)
	{
		this._effectSprite = new PIXI.Sprite;

		const nothingEffectTexture = PIXI.Texture.from("effects/nothing.png");
		const damageEffectTexture = PIXI.Texture.from("effects/dmg.png");
		const shieldEffectTexture = PIXI.Texture.from("effects/shield.png");
		const penetrateEffectTexture = PIXI.Texture.from("effects/penetrate.png");
		const healEffectTexture = PIXI.Texture.from("effects/heal.png");
		const jokerformEffectTexture = PIXI.Texture.from("effects/jokerform.png");
		const attackformEffectTexture = PIXI.Texture.from("effects/attackform.png");
		const magicformEffectTexture = PIXI.Texture.from("effects/magicform.png");
		const moveformEffectTexture = PIXI.Texture.from("effects/moveform.png");
		const defenseformEffectTexture = PIXI.Texture.from("effects/defenseform.png");
		const sacrificeEffectTexture = PIXI.Texture.from("effects/sacrifice.png");
		const bloodOathEffectTexture = PIXI.Texture.from("effects/bloodOath.png");
		const manaRegenEffectTexture = PIXI.Texture.from("effects/manaRegen.png");
		const manaDrainEffectTexture = PIXI.Texture.from("effects/manaDrain.png");
		const manaCostEffectTexture = PIXI.Texture.from("effects/manaCost.png");
		const paralyzeEffectTexture = PIXI.Texture.from("effects/paralyze.png");
		const stunEffectTexture = PIXI.Texture.from("effects/stun.png");
		const poisonEffectTexture = PIXI.Texture.from("effects/poison.png");
		const poisonDamageEffectTexture = PIXI.Texture.from("effects/poison_dmg.png");
		const freezeEffectTexture = PIXI.Texture.from("effects/freeze.png");
		const tempoEffectTexture = PIXI.Texture.from("effects/tempo.png");

		switch(effectType)
		{
			case EffectTypes.noEffect:
				this._effectSprite.texture = nothingEffectTexture;
				break;

			case EffectTypes.damage:
				this._effectSprite.texture = damageEffectTexture;
				break;

			case EffectTypes.shield:
				this._effectSprite.texture = shieldEffectTexture;
				break;

			case EffectTypes.penetrate:
				this._effectSprite.texture = penetrateEffectTexture;
				break;

			case EffectTypes.jokerform:
				this._effectSprite.texture = jokerformEffectTexture;
				break;

			case EffectTypes.sacrifice:
				this._effectSprite.texture = sacrificeEffectTexture;
				break;

			case EffectTypes.bloodOath:
				this._effectSprite.texture = bloodOathEffectTexture;
				break;

			case EffectTypes.manaRegen:
				this._effectSprite.texture = manaRegenEffectTexture;
				break;

			case EffectTypes.manaDrain:
				this._effectSprite.texture = manaDrainEffectTexture;
				break;

			case EffectTypes.manaCost:
				this._effectSprite.texture = manaCostEffectTexture;
				break;

			case EffectTypes.heal:
				this._effectSprite.texture = healEffectTexture;
				break;

			case EffectTypes.attackform:
				this._effectSprite.texture = attackformEffectTexture;
				break;

			case EffectTypes.magicform:
				this._effectSprite.texture = magicformEffectTexture;
				break;

			case EffectTypes.moveform:
				this._effectSprite.texture = moveformEffectTexture;
				break;

			case EffectTypes.defenseform:
				this._effectSprite.texture = defenseformEffectTexture;
				break;

			case EffectTypes.paralyze:
				this._effectSprite.texture = paralyzeEffectTexture;
				break;

			case EffectTypes.stun:
				this._effectSprite.texture = stunEffectTexture;
				break;

			case EffectTypes.poison:
				this._effectSprite.texture = poisonEffectTexture;
				break;

			case EffectTypes.poisonDamage:
				this._effectSprite.texture = poisonDamageEffectTexture;
				break;

			case EffectTypes.freeze:
				this._effectSprite.texture = freezeEffectTexture;
				break;

			case EffectTypes.tempo:
				this._effectSprite.texture = tempoEffectTexture;
				break;

			default:
				console.log("ERROR: EFFECT VIEW");
				break;
		}
	}

	public get sprite(): PIXI.Sprite
	{
		return this._effectSprite;
	}
}
