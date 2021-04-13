import { SkillView } from "./skillView";
import * as PIXI from "pixi.js";
import { EnemySkill } from "../controller/enemySkill";
import { ChanceTypes } from "../../enemy/chance/chanceTypes";
import { HitAreaCreator } from "../../hitAreaCreator";
import { SkillEvent } from "../event/skillEvent";
import { Main } from "../../main";
import { BarEvent } from "../../battle/panel/Bars/event/barEvent";
import { Easing, Tweener } from "pixi-tweener";
import { EffectEvent } from "../effect/event/effectEvent";
import { LogicEvent } from "../../battle/logic/event/logicEvent";

export class SkillViewEnemy extends SkillView
{
	private _id: number;
	private _effectValue: PIXI.Text;
	private _effectValueContainer: PIXI.Container;
	private _chanceContainer: PIXI.Container;
	private _chanceSpriteContainer: PIXI.Container;
	private _chanceAnimation: PIXI.AnimatedSprite;
	private _skill: EnemySkill[];
	private static _finishedRollingAnimations: number = 0;
	private static _amountOfEnemySkills: number = 0;

	private _enemyShield: number = 0;
	private _playerShield: number = 0;

	constructor(dispatcher: PIXI.Container, container: PIXI.Container, position: number, skill: EnemySkill[], isExamine: boolean)
	{
		super(dispatcher, container, position, skill);

		if(!isExamine)
		{
			SkillViewEnemy._amountOfEnemySkills++;
		}

		this._id = position;
		this._skill = skill;

		this.createChanceAnimation();

		dispatcher.on(BarEvent.EV_HP_BAR_UPDATED, (hp: number, maxHp: number) =>
		{
			if(skill[0].chance.chanceType === ChanceTypes.rage) skill[0].chance.calculateRageChances(hp, maxHp);
			this._effectValue.text = String(skill[0].chance.value) + "%";
			this._effectValueContainer.x = Math.floor(this._chanceContainer.width / 2) - Math.floor(this._effectValueContainer.width / 2);
		});

		dispatcher.on(BarEvent.EV_MP_BAR_UPDATED, (mp: number) =>
		{
			if(skill[0].chance.chanceType === ChanceTypes.spell) skill[0].chance.calculateSpellChances(mp, skill[0].secondaryEffect.effectValue);
			this._effectValue.text = String(skill[0].chance.value) + "%";
			this._effectValueContainer.x = Math.floor(this._chanceContainer.width / 2) - Math.floor(this._effectValueContainer.width / 2);
		});

		dispatcher.on(LogicEvent.EV_COUNT_STUCK_CHANCE, (paralyzedFields: number, nonParalyzedFields: number) =>
		{
			if(skill[0].chance.chanceType === ChanceTypes.stuck)
			{
				let originalAmount = skill[0].chance.value;
				skill[0].chance.calculateStuckChances(nonParalyzedFields, paralyzedFields);
				this.countNumbers(originalAmount, skill[0].chance.value);
			}
		});

		dispatcher.on(BarEvent.EV_UPDATE_SHIELD, (newShield: number, isPlayer: boolean, isPlayersTurn: boolean, isPrimary: boolean, isPoison = false) =>
		{
			if(skill[0].chance.chanceType === ChanceTypes.confidence)
			{
				let originalAmount = skill[0].chance.value;

				if(isPlayer)
				{
					this._playerShield = newShield;
				}
				else
				{
					this._enemyShield = newShield;
				}

				skill[0].chance.calculateConfidenceChances(this._playerShield, this._enemyShield);

				this.countNumbers(originalAmount, skill[0].chance.value);
			}
		});

		dispatcher.on(SkillEvent.EV_ENEMYS_SKILLS_DECIDED, () =>
		{
			this.startRollingAnimation();
		});

		dispatcher.on(LogicEvent.EV_BATTLE_OVER, () =>
		{
			SkillViewEnemy._amountOfEnemySkills = 0;
		});
	}

	private async countNumbers(originalAmount, currentAmount)
	{
		const counterHelper = new PIXI.Graphics;
		counterHelper.x = originalAmount;
		await Tweener.add
		(
			{
				target: counterHelper,
				ease: Easing.linear,
				duration: 0.5,
				onUpdate: () =>
				{
					this._effectValue.text = String(Math.floor(counterHelper.x)) + "%";
					this.positionEffectValueToMiddle();
				}
			},
			{
				x: currentAmount,
			}
		)
	}

	public async selectSkills()
	{
		if(this._skill[0].active)
		{
			this.activateSkill();

			await Tweener.add
			(
				{
					target: this._id,
					duration: 1
				},
				{

				}
			);

			this._dispatcher.emit(SkillEvent.EV_ENEMY_SKILL_SELECTED, this._skill[0]);
			this._dispatcher.emit(SkillEvent.EV_ACTIVATE_ENEMY_SKILL);
			this._skill[0].active = false;
		}
		else
		{
			this._dispatcher.emit(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, false);
		}
	}

	private createChanceAnimation()
	{
		let sheet = Main.App.loader.resources["successAnimJSON"].spritesheet;
		this._chanceAnimation = new PIXI.AnimatedSprite(sheet.animations["successAnim"]);
		this._chanceContainer.addChild(this._chanceAnimation);
		this._chanceAnimation.x = 15;
		this._chanceAnimation.y = 29;
		this._chanceAnimation.alpha = 0;
	}

	protected createSkill(container: PIXI.Container, position: number, skill: EnemySkill)
	{
		super.createSkill(container, position, skill);

		this._skillHolder.addChild(this.createChances(skill));
	}

	protected createDisabler(borderSize: number)
	{
		this._disabler = new PIXI.Graphics;
		this._disabler.beginFill(0x000000);
		this._disabler.drawRect(this._skillHolder.x + borderSize, this._skillHolder.y + borderSize, this._skillHolder.width - borderSize * 2, this._skillHolder.height - borderSize * 2);
		this._disabler.endFill();
		this._disabler.alpha = 0;
	}

	public enableSkill()
	{
		this.enableAnim(this._disabler);
		this._chanceSpriteContainer.alpha = 1;
		this._chanceAnimation.alpha = 0;
	}

	private enableAnim(element)
	{
		Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 0
			}
		)
	}

	private createChances(skill: EnemySkill): PIXI.Container
	{
		const luckTexture = PIXI.Texture.from("chances/luck.png");
		const rageTexture = PIXI.Texture.from("chances/rage.png");
		const spellTexture = PIXI.Texture.from("chances/spell.png");
		const stuckTexture = PIXI.Texture.from("chances/stuck.png");
		const confidenceTexture = PIXI.Texture.from("chances/confidence.png");

		const offsetX = 235;
		const offsetY = 3;
		const width = 82;
		const height = 82;

		this._chanceContainer = new PIXI.Container;
		this._chanceSpriteContainer = new PIXI.Container;

		this._chanceContainer.x = offsetX;
		this._chanceContainer.y = offsetY;

		let chanceSprite = new PIXI.Sprite();

		switch(skill.chance.chanceType)
		{
			case ChanceTypes.luck:
				chanceSprite.texture = luckTexture;
				break;

			case ChanceTypes.rage:
				chanceSprite.texture = rageTexture;
				break;

			case ChanceTypes.spell:
				chanceSprite.texture = spellTexture;
				break;

			case ChanceTypes.stuck:
				chanceSprite.texture = stuckTexture;
				break;

			case ChanceTypes.confidence:
				chanceSprite.texture = confidenceTexture;
				break;
		}

		chanceSprite.x = Math.floor(width / 2) - Math.floor(chanceSprite.width / 2);
		chanceSprite.y = height - chanceSprite.height - 3;
		this._chanceSpriteContainer.addChild(chanceSprite);

		this._effectValue = new PIXI.Text("",{fontFamily : 'Lato', fontSize: 30, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 290});
		this._effectValue.text = String(skill.chance.value) + "%";
		this._effectValueContainer = new PIXI.Container;
		this._effectValueContainer.addChild(this._effectValue);
		this.positionEffectValueToMiddle(width);
		this._effectValueContainer.y -= 3;
		this._chanceContainer.addChild(this._effectValueContainer);
		this._chanceContainer.addChild(this._chanceSpriteContainer);

		let hitArea = new HitAreaCreator().hitAreaRectangle(0, 0, width, height);
		hitArea.interactive = true;
		this.addChanceExplainerEvent(hitArea, skill.chance.chanceType);
		this._chanceContainer.addChild(hitArea);

		return this._chanceContainer;
	}

	private positionEffectValueToMiddle(width: number = 82)
	{
		this._effectValueContainer.x = Math.floor(width / 2) - Math.floor(this._effectValueContainer.width / 2);
	}

	private async startRollingAnimation()
	{
		let targetFrame: number;
		if(this._skill[0].active)
		{
			targetFrame = this._chanceAnimation.totalFrames - 1;
		}
		else
		{
			targetFrame = 12;
		}

		this._chanceSpriteContainer.alpha = 0;
		this._chanceAnimation.alpha = 1;
		this._chanceAnimation.play();

		this._chanceAnimation.animationSpeed = 0;

		let durations = [];
		durations.push(3 / 10);
		durations.push(3 / 10);
		durations.push(10 / 10);

		await Tweener.add
		(
			{
				target: this._chanceAnimation, ease: Easing.linear,
				duration: durations[0],
			},
			{
				animationSpeed: 2
			}
		);

		await Tweener.add
		(
			{
				delay: this._id/5,
				target: this._chanceAnimation, ease: Easing.linear,
				duration: durations[1],
			},
			{
				animationSpeed: 2
			}
		);

		await Tweener.add
		(
			{
				delay: this._id/5,
				target: this._chanceAnimation,
				duration: durations[2],
			},
			{
				animationSpeed: 0.3
			}
		);

		await Tweener.add
		(
			{
				target: this._chanceAnimation,
				duration: durations[2] * 2,
				onUpdate: () =>
				{
					if(this._chanceAnimation.currentFrame === targetFrame)
					{
						this._chanceAnimation.stop();
						Tweener.killTweensOf(this._chanceAnimation);
					}
				}
			},
			{
				animationSpeed: 0.2
			}
		);

		if(!this._skill[0].active)
		{
			await Tweener.add
			(
				{
					delay: 0.2,
					target: this._disabler,
					duration: durations[0],
				},
				{
					alpha: 0.8
				}
			);
		}

		SkillViewEnemy._finishedRollingAnimations++;

		if(SkillViewEnemy._finishedRollingAnimations === SkillViewEnemy._amountOfEnemySkills)
		{
			this._dispatcher.emit(SkillEvent.EV_SELECT_ENEMY_SKILL, 0);
			SkillViewEnemy._finishedRollingAnimations = 0;
		}
	}

	private addChanceExplainerEvent(hitArea: PIXI.Graphics, chanceType: ChanceTypes)
	{
		hitArea.on("pointerdown", () =>
		{
			this._dispatcher.emit(SkillEvent.EV_SHOW_CHANCE_EXPLAINER, chanceType);
		});

		hitArea.on("pointermove", (e) =>
		{
			if(e.data.global.x > hitArea.getGlobalPosition().x && e.data.global.x < (hitArea.getGlobalPosition().x + hitArea.width) && e.data.global.y > hitArea.getGlobalPosition().y && e.data.global.y < (hitArea.getGlobalPosition().y + hitArea.height))
			{
				if(this._allowCursorChange)
				{
					Main.cursor.pointerCursor();
				}
			}
		});

		hitArea.on("pointerover", () =>
		{
			Main.cursor.pointerCursor();
		});

		hitArea.on("pointerout", () =>
		{
			Main.cursor.changeCursor();
		});
	}
}
