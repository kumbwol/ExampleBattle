import * as PIXI from "pixi.js";
import { Skill } from "../controller/skill";
import { HitAreaCreator } from "../../hitAreaCreator";
import { Effect } from "../effect/effect";
import { Main } from "../../main";
import { SkillEvent } from "../event/skillEvent";
import { GameAlertEvent } from "../../gameAlert/event/gameAlertEvent";

export class SkillView
{
	protected _disabler: PIXI.Graphics;
	protected _skillHolder: PIXI.Container;
	protected _skillHolderSprite: PIXI.Sprite;
	protected _activeSkillHolder: PIXI.Sprite;
	protected _dispatcher: PIXI.Container;
	protected _allowCursorChange: boolean;
	protected _skillHolderTexture: PIXI.Texture;
	protected _activeSkillHolderTexture: PIXI.Texture;
	protected _primaryEffectHitArea: PIXI.Graphics;
	protected _secondaryEffectHitArea: PIXI.Graphics;

	constructor(dispatcher: PIXI.Container, container: PIXI.Container, position: number, skill: Skill[], rank: number = 0)
	{
		this._skillHolderSprite = new PIXI.Sprite;
		this._activeSkillHolder = new PIXI.Sprite;
		this._allowCursorChange = true;
		this._dispatcher = dispatcher;
		this._skillHolder = new PIXI.Container;
		this.createSkill(container, position, skill[rank]);

		dispatcher.on(GameAlertEvent.EV_GAME_ALERT, () => this._allowCursorChange = false);
	}

	protected createSkill(container: PIXI.Container, position: number, skill: Skill)
	{
		const offsetY = 382;
		const borderSize = 2;
		this._skillHolderTexture = PIXI.Texture.from("skillHolder.png");
		this._activeSkillHolderTexture = PIXI.Texture.from("activeSkillHolder.png");
		this._skillHolderSprite.texture = this._skillHolderTexture;
		this._activeSkillHolder.texture = this._activeSkillHolderTexture;
		this._skillHolder.addChild(this._skillHolderSprite);

		this._skillHolder.y = position * this._skillHolderTexture.height + offsetY - position * borderSize;
		this._activeSkillHolder.y = position * this._activeSkillHolderTexture.height + offsetY - position * borderSize;

		this.createDisabler(borderSize);

		this.createSkillHolder(skill);

		container.addChild(this._skillHolder);

		container.addChild(this._activeSkillHolder);
		container.addChild(this._disabler);

		this._activeSkillHolder.alpha = 0;
	}

	protected createSkillHolder(skill: Skill)
	{
		if(skill !== undefined)
		{
			let effectPrimary = this.createEffect(skill, true);
			let effectSecondary = this.createEffect(skill, false);

			this._skillHolder.addChild(effectPrimary);
			this._skillHolder.addChild(effectSecondary);

			let skillName = new PIXI.Text(skill.name,{fontFamily : 'Lato', fontSize: 26, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 290});
			skillName.x = 10;
			this._skillHolder.addChild(skillName);
		}
	}

	protected updateSkill(skill: Skill)
	{
		if(this._skillHolder.children.length > 1) this._skillHolder.removeChildren(1);
		this.createSkillHolder(skill);
	}

	protected activateSkill()
	{
		this._activeSkillHolder.alpha = 1;
	}

	public inActivateSkill()
	{
		this._activeSkillHolder.alpha = 0;
	}

	protected createDisabler(borderSize: number)
	{
		this._disabler = new PIXI.Graphics;
		this._disabler.beginFill(0x626262);
		this._disabler.drawRect(this._skillHolder.x + borderSize, this._skillHolder.y + borderSize, this._skillHolder.width - borderSize * 2, this._skillHolder.height - borderSize * 2);
		this._disabler.endFill();
		this._disabler.alpha = 0;
	}

	protected addSkillExplainerEvent(effect: Effect, hitArea: PIXI.Graphics)
	{
		hitArea.on("pointerdown", () =>
		{
			this._dispatcher.emit(SkillEvent.EV_SHOW_EFFECT_EXPLAINER, effect);
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

	protected createEffect(skill: Skill, isPrimary: boolean): PIXI.Container
	{
		let container = new PIXI.Container;
		const effectHolderTexture = PIXI.Texture.from("effects/effectHolder.png");

		let effect: Effect;

		if(isPrimary)
		{
			effect = new Effect(skill.skillData.primaryEffect);
		}
		else
		{
			effect = new Effect(skill.skillData.secondaryEffect);
		}


		let spriteTexture = effect.effectView.sprite.texture;
		let sprite = new PIXI.Sprite(spriteTexture);
		let effectHolderSprite = new PIXI.Sprite(effectHolderTexture);

		sprite.x = 5;
		sprite.y = 10;

		let effectValue = new PIXI.Text("",{fontFamily : 'Lato', fontSize: 30, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 290});
		effectValue.text = String(effect.effectValue);
		let effectValueContainer = new PIXI.Container;
		effectValueContainer.addChild(effectValue);

		effectValueContainer.y = 9;
		effectValueContainer.x = 50 + (60 - effectValueContainer.width);

		container.addChild(effectHolderSprite);
		container.addChild(sprite);
		container.addChild(effectValueContainer);

		if(isPrimary)
		{
			this._primaryEffectHitArea = new HitAreaCreator().hitAreaRectangle(container.x, container.y, container.width, container.height);
			container.addChild(this._primaryEffectHitArea);
			this.addSkillExplainerEvent(effect, this._primaryEffectHitArea);
			this._primaryEffectHitArea.interactive = true;
		}
		else
		{
			this._secondaryEffectHitArea = new HitAreaCreator().hitAreaRectangle(container.x, container.y, container.width, container.height);
			container.addChild(this._secondaryEffectHitArea);
			this.addSkillExplainerEvent(effect, this._secondaryEffectHitArea);
			this._secondaryEffectHitArea.interactive = true;
		}

		if(isPrimary)
		{
			container.x = 3;
		}
		else
		{
			container.x = 119;
		}
		container.y = 31;

		return container;
	}
}
