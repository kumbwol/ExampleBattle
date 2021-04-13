import * as PIXI from "pixi.js";
import { Easing, Tweener } from "pixi-tweener";
import { LogicEvent } from "../../battle/logic/event/logicEvent";

export class SkillSelector
{
	private _disablerImplementer: PIXI.Graphics;
	private _parentContainer: PIXI.Container;

	constructor(dispatcher: PIXI.Container, container: PIXI.Container)
	{
		this._parentContainer = container;

		this.createDisablerImplementer();

		this._parentContainer.addChild(this._disablerImplementer);

		dispatcher.on(LogicEvent.EV_ENABLE_SPECIAL_SKILL_SELECTION, () =>
		{
			this._disablerImplementer.interactive = true;
			this.disableAnim(this._disablerImplementer);
		});

		dispatcher.on(LogicEvent.EV_DISABLE_SPECIAL_SKILL_SELECTION, () =>
		{
			this._disablerImplementer.interactive = false;
			this.enableAnim(this._disablerImplementer);
		});
	}

	private createDisablerImplementer()
	{
		this._disablerImplementer = new PIXI.Graphics;
		this._disablerImplementer.beginFill(0x626262);
		this._disablerImplementer.drawRect(0, 0, this._parentContainer.width, 382);

		let x = 320;
		let y = 382;
		this._disablerImplementer.drawRect(x, y, this._parentContainer.width - x, 900 - y);
		this._disablerImplementer.endFill();
		this._disablerImplementer.alpha = 0;

		this._disablerImplementer.interactive = false;
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
		)
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
}
