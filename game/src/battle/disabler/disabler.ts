import * as PIXI from "pixi.js";
import { Easing, Tweener } from "pixi-tweener";
import { SkillEvent } from "../../skill/event/skillEvent";
import { EndTurnButtonEvent } from "../endTurnButton/event/endTurnButtonEvent";
import { TableEvent } from "../table/event/tableEvent";
import { PatternEvent } from "../panel/event/patternEvent";

export class Disabler
{
	private readonly _disablerContainer: PIXI.Container;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container)
	{
		this._disablerContainer = new PIXI.Container;
		this.createAbilityDisabler(parentContainer);
		this.addEventListeners(dispatcher);
	}

	protected addEventListeners(dispatcher: PIXI.Container)
	{
		dispatcher.on(TableEvent.EV_START_CASCADE, () =>
		{
			this.disableAnim(this._disablerContainer);
		});

		dispatcher.on(PatternEvent.EV_ALLOW_PATTERN_SELECTION, () =>
		{
			this.enableAnim(this._disablerContainer);
		});

		dispatcher.on(EndTurnButtonEvent.EV_END_TURN, () =>
		{
			this.disableAnim(this._disablerContainer);
		});

		dispatcher.on(SkillEvent.EV_ENEMY_FINISHED_TURN, () =>
		{
			this.enableAnim(this._disablerContainer);
		});
	}

	private createAbilityDisabler(parentContainer: PIXI.Container)
	{
		const disablerLeft = new PIXI.Graphics;
		const disablerRight = new PIXI.Graphics;
		const disablerTop = new PIXI.Graphics;
		const disablerBottom = new PIXI.Graphics;

		disablerLeft.beginFill(0x626262);
		disablerLeft.drawRect(0, 0, 396, 900);

		disablerRight.beginFill(0x626262);
		disablerRight.drawRect(1204, 0, 76, 900);

		disablerTop.beginFill(0x626262);
		disablerTop.drawRect(396, 0, 808, 10);

		disablerBottom.beginFill(0x626262);
		disablerBottom.drawRect(396, 818, 808, 80);

		this._disablerContainer.addChild(disablerLeft);
		this._disablerContainer.addChild(disablerRight);
		this._disablerContainer.addChild(disablerTop);
		this._disablerContainer.addChild(disablerBottom);
		this._disablerContainer.alpha = 0;
		this._disablerContainer.interactive = false;

		parentContainer.addChild(this._disablerContainer);
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
		);

		element.interactive = false;
	}

	private disableAnim(element)
	{
		Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 0.6
			}
		);

		element.interactive = true;
	}
}
