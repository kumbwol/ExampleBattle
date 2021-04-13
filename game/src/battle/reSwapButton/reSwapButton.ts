import * as PIXI from "pixi.js";
import { Button } from "../../button/button";
import { FieldEvent } from "../field/event/fieldEvent";
import { TableEvent } from "../table/event/tableEvent";
import { EndTurnButtonEvent } from "../endTurnButton/event/endTurnButtonEvent";
import { LogicEvent } from "../logic/event/logicEvent";
import { BooleanClass } from "../../booleanClass";
import { SkillEvent } from "../../skill/event/skillEvent";
import { PatternEvent } from "../panel/event/patternEvent";

export class ReSwapButton
{
	private _reSwapButtonDisabled: PIXI.Sprite;
	private _reSwapButtonActive: Button;
	private readonly _redoAbility: BooleanClass;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container)
	{
		this._redoAbility = new BooleanClass(false);
		this.createButton(dispatcher, parentContainer);

		dispatcher.on(FieldEvent.EV_ALLOW_RESWAP, (isReswap: boolean) =>
		{
			if(isReswap)
			{
				this.disableSwap();
			}
			else
			{
				this._redoAbility.boolean = false;
				this.enableSwap();
			}
		});

		dispatcher.on(LogicEvent.EV_ENABLE_REDO_ABILITY, () =>
		{
			this._redoAbility.boolean = true;
			this.enableSwap();
		});

		dispatcher.on(EndTurnButtonEvent.EV_END_TURN, () =>
		{
			this.disableSwap();
		});

		dispatcher.on(TableEvent.EV_START_SWAP, () =>
		{
			this.disableSwap();
		});

		dispatcher.on(TableEvent.EV_START_CASCADE, () =>
		{
			this.disableSwap();
		});

		dispatcher.on(FieldEvent.EV_FIELD_RESWAP, () =>
		{
			this.disableSwap();
		});

		dispatcher.on(SkillEvent.EV_SKILL_SELECTED, () =>
		{
			this.disableButton();
		});

		dispatcher.on(PatternEvent.EV_PATTERN_DELETE, () =>
		{
			this.enableButton();
		});
	}

	private disableButton()
	{
		this._reSwapButtonActive.isActive = false;
	}

	private enableButton()
	{
		this._reSwapButtonActive.isActive = true;
	}

	private enableSwap()
	{
		this._reSwapButtonDisabled.alpha = 0;
		this._reSwapButtonActive.button.alpha = 1;
	}

	private disableSwap()
	{
		this._reSwapButtonDisabled.alpha = 1;
		this._reSwapButtonActive.button.alpha = 0;
	}

	private createButton(dispatcher: PIXI.Container, parentContainer: PIXI.Container)
	{
		const disabledTexture = PIXI.Texture.from("reSwapButton/reSwapDisabled.png");
		const normalTexture = PIXI.Texture.from("reSwapButton/reSwapNormal.png");
		const hoverTexture = PIXI.Texture.from("reSwapButton/reSwapHover.png");
		const pressedTexture = PIXI.Texture.from("reSwapButton/reSwapPressed.png");

		const offsetX = 1190;
		const offsetY = 407;

		this._reSwapButtonDisabled = new PIXI.Sprite(disabledTexture);
		this._reSwapButtonActive = new Button(dispatcher, normalTexture, hoverTexture, pressedTexture, new FieldEvent(FieldEvent.EV_FIELD_RESWAP, this._redoAbility), null);

		this._reSwapButtonActive.button.x = offsetX;
		this._reSwapButtonActive.button.y = offsetY;
		this._reSwapButtonDisabled.x = offsetX;
		this._reSwapButtonDisabled.y = offsetY;

		this._reSwapButtonActive.button.alpha = 0;

		parentContainer.addChild(this._reSwapButtonActive.button);
		parentContainer.addChild(this._reSwapButtonDisabled);
	}

}
