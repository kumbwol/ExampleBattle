import * as PIXI from 'pixi.js';
import { CursorEvent } from "../../cursor/event/cursorEvent";
import { SkillEvent } from "../event/skillEvent";
import { Effect } from '../effect/effect';
import { Paragraph } from "../../../paragraph/paragraph";
import { ChanceTypes } from "../../enemy/chance/chanceTypes";
import { Easing, Tweener } from "pixi-tweener";

export class SkillExplainerView
{
	private _visible: boolean;
	private _skillExplainer: PIXI.Container;
	private _skillExplainerSprite: PIXI.Sprite;
	private _textTitle: PIXI.Text;
	private _textExplain: PIXI.Text;
	private _explainedImage: PIXI.Sprite;
	private _darkenedBackground: PIXI.Graphics;

	constructor(dispatcher: PIXI.Container, container: PIXI.Container)
	{
		this._visible = false;
		this._skillExplainer = new PIXI.Container;
		this._explainedImage = new PIXI.Sprite;

		this.createDarkenedBackground();
		container.addChild(this._darkenedBackground);
		container.addChild(this.createSkillExplainer());

		dispatcher.on(SkillEvent.EV_SHOW_EFFECT_EXPLAINER, (effect: Effect) =>
		{
			this.showEffectExplainer(effect);
		});

		dispatcher.on(SkillEvent.EV_SHOW_CHANCE_EXPLAINER, (chanceType: ChanceTypes) =>
		{
			this.showChanceExplainer(chanceType);
		});

		dispatcher.on(CursorEvent.EV_CURSOR_UP, () =>
		{
			this.hideSkillExplainer();
		});
	}

	private createDarkenedBackground()
	{
		this._darkenedBackground = new PIXI.Graphics;
		this._darkenedBackground.beginFill(0x000000);
		this._darkenedBackground.drawRect(0, 0, 1600, 900);
		this._darkenedBackground.endFill();
		this._darkenedBackground.alpha = 0;
	}

	public createSkillExplainer(): PIXI.Container
	{
		const skillExplainerTexture = PIXI.Texture.from("skillExplainer.png");
		this._skillExplainerSprite = new PIXI.Sprite(skillExplainerTexture);

		this._textTitle = new PIXI.Text("",{fontFamily : 'Lato', fontSize: 28, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 290});
		this._textTitle.x = 10;
		this._textTitle.y = 4;

		this._textExplain = new PIXI.Text("",{fontFamily : 'Lato', fontSize: 22, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 440});
		this._textExplain.x = 10;
		this._textExplain.y = 50;

		this._explainedImage.y = 4;

		this._skillExplainer.addChild(this._skillExplainerSprite);
		this._skillExplainer.addChild(this._textTitle);
		this._skillExplainer.addChild(this._textExplain);
		this._skillExplainer.addChild(this._explainedImage);
		this._skillExplainer.alpha = 0;
		return this._skillExplainer;
	}

	private showEffectExplainer(effect: Effect)
	{
		const imageOffsetX = 15;
		this.showExplainer();
		this._textTitle.text = Paragraph.paragraph.effect.titles[effect.effectType];
		this._textExplain.text = Paragraph.paragraph.effect.texts[effect.effectType];
		this._explainedImage.texture = effect.effectView.sprite.texture;
		this._explainedImage.x = this._textTitle.width + imageOffsetX;
	}

	private showChanceExplainer(chanceType: ChanceTypes)
	{
		this.showExplainer();
		this._textTitle.text = Paragraph.paragraph.chance.titles[chanceType];
		this._textExplain.text = Paragraph.paragraph.chance.texts[chanceType];
	}

	private async showExplainer()
	{
		this._visible = true;
		const offsetY = 100;
		this._skillExplainer.x = Math.floor(this._darkenedBackground.width / 2) - Math.floor(this._skillExplainerSprite.width / 2);
		this._skillExplainer.y = Math.floor(this._darkenedBackground.height / 2) - Math.floor(this._skillExplainerSprite.height / 2) - offsetY;
		this._skillExplainer.alpha = 1;

		await Tweener.add
		(
			{
				target: this._darkenedBackground,
				duration: 0.2, ease: Easing.linear,
			},
			{
				alpha: 0.7
			}
		)
	}

	private async hideSkillExplainer()
	{
		this._visible = false;
		this._skillExplainer.alpha = 0;

		await Tweener.add
		(
			{
				target: this._darkenedBackground,
				duration: 0.2, ease: Easing.linear,
			},
			{
				alpha: 0
			}
		)
	}
}
