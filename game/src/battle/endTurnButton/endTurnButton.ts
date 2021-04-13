import * as PIXI from "pixi.js";
import { AbilityEvent } from "../ability/event/abilityEvent";
import { Tweener } from "pixi-tweener";
import { Easing } from "pixi-tweener";
import { EndTurnButtonEvent } from "./event/endTurnButtonEvent";
import { Button } from "../../button/button";
import { SkillEvent } from "../../skill/event/skillEvent";
import { LogicEvent } from "../logic/event/logicEvent";
import { PatternEvent } from "../panel/event/patternEvent";

export class EndTurnButton
{
	private _buttonIsShaking: boolean;
	private _dispatcher: PIXI.Container;

	private readonly _inactiveNormalTexture: PIXI.Texture;
	private readonly _inactiveHoverTexture: PIXI.Texture;
	private readonly _inactivePressedTexture: PIXI.Texture;

	private readonly _activeNormalTexture: PIXI.Texture;
	private readonly _activeHoverTexture: PIXI.Texture;
	private readonly _activePressedTexture: PIXI.Texture;

	private readonly _disabledTexture: PIXI.Texture;

	private _inactiveButton: Button;
	private _activeButton: Button;
	private _disabledButton: Button;

	private _disabledEvents: boolean[];

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container)
	{
		this._disabledEvents = [];
		this._disabledEvents[0] = false;
		this._disabledEvents[1] = false;
		this._disabledEvents[2] = false;

		this._inactiveNormalTexture = PIXI.Texture.from("endTurnButton/inactive/inactiveNormal.png");
		this._inactiveHoverTexture = PIXI.Texture.from("endTurnButton/inactive/inactiveHover.png");
		this._inactivePressedTexture = PIXI.Texture.from("endTurnButton/inactive/inactivePressed.png");

		this._activeNormalTexture = PIXI.Texture.from("endTurnButton/active/activeNormal.png");
		this._activeHoverTexture = PIXI.Texture.from("endTurnButton/active/activeHover.png");
		this._activePressedTexture = PIXI.Texture.from("endTurnButton/active/activePressed.png");

		this._disabledTexture = PIXI.Texture.from("endTurnButton/disabled/disabled.png");

		const offsetX = 1048;
		const offsetY = 830;

		const endTurnTextDisabled = new PIXI.Text("END TURN",{fontFamily : 'Lato', fontSize: 28, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 290});
		this._disabledButton = new Button(dispatcher, this._disabledTexture, this._disabledTexture, this._disabledTexture, null, endTurnTextDisabled);
		this._disabledButton.button.x = offsetX;
		this._disabledButton.button.y = offsetY;
		this._disabledButton.button.alpha = 0;
		this._disabledButton.isActive = false;

		const endTurnTextIanctive = new PIXI.Text("END TURN",{fontFamily : 'Lato', fontSize: 28, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 290});
		this._inactiveButton = new Button(dispatcher, this._inactiveNormalTexture, this._inactiveHoverTexture, this._inactivePressedTexture, new EndTurnButtonEvent(EndTurnButtonEvent.EV_END_TURN_WITH_UNUSED_ABILITY_POINTS, null), endTurnTextIanctive);
		this._inactiveButton.button.x = offsetX;
		this._inactiveButton.button.y = offsetY;
		this._inactiveButton.isActive = true;

		const endTurnTextActive = new PIXI.Text("END TURN",{fontFamily : 'Lato', fontSize: 28, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 290});
		this._activeButton = new Button(dispatcher, this._activeNormalTexture, this._activeHoverTexture, this._activePressedTexture, new EndTurnButtonEvent(EndTurnButtonEvent.EV_END_TURN, null), endTurnTextActive);
		this._activeButton.button.x = offsetX;
		this._activeButton.button.y = offsetY;
		this._activeButton.button.alpha = 0;
		this._activeButton.isActive = false;

		parentContainer.addChild(this._inactiveButton.button);
		parentContainer.addChild(this._activeButton.button);
		parentContainer.addChild(this._disabledButton.button);
		this._dispatcher = dispatcher;
		this._buttonIsShaking = false;

		dispatcher.on(AbilityEvent.EV_NO_MORE_ABILITIES, () => this.activateButton());
		dispatcher.on(AbilityEvent.EV_HAVE_MORE_ABILITIES, () => this.resetButton());
		dispatcher.on(EndTurnButtonEvent.EV_ALERT_END_TURN_BUTTON, () =>
		{
			if(!this._buttonIsShaking) this.alertButton(this._activeButton.button);
		});
		dispatcher.on(EndTurnButtonEvent.EV_END_TURN, () =>
		{
			this.disableButton();
		});
		dispatcher.on(SkillEvent.EV_ENEMY_FINISHED_TURN, () =>
		{
			this.resetButton();
		});

		dispatcher.on(LogicEvent.EV_DISABLE_END_TURN_BUTTON, () =>
		{
			this.disableButton();
		});
		dispatcher.on(LogicEvent.EV_ENABLE_END_TURN_BUTTON, () =>
		{
			this.resetButton();
		});

		dispatcher.on(SkillEvent.EV_SKILL_SELECTED, () =>
		{
			this.disableButtonEvent();
		});

		dispatcher.on(PatternEvent.EV_PATTERN_DELETE, () =>
		{
			this.enableButtonEvent();
		});
	}

	private disableButtonEvent()
	{
		if(this._disabledButton.isActive)
		{
			this._disabledEvents[0] = true;
			this._disabledButton.isActive = false;
		}

		if(this._inactiveButton.isActive)
		{
			this._disabledEvents[1] = true;
			this._inactiveButton.isActive = false;
		}

		if(this._activeButton.isActive)
		{
			this._disabledEvents[2] = true;
			this._activeButton.isActive = false;
		}
	}

	private enableButtonEvent()
	{
		if(this._disabledEvents[0])
		{
			this._disabledButton.isActive = true;
		}

		if(this._disabledEvents[1])
		{
			this._inactiveButton.isActive = true;
		}

		if(this._disabledEvents[2])
		{
			this._activeButton.isActive = true;
		}

		this._disabledEvents[0] = false;
		this._disabledEvents[1] = false;
		this._disabledEvents[2] = false;
	}

	private disableButton()
	{
		this._disabledButton.isDisabled = true;
		this._disabledButton.isActive = true;
		this._disabledButton.button.alpha = 1;

		this._inactiveButton.isActive = false;
		this._inactiveButton.button.alpha = 0;

		this._activeButton.isActive = false;
		this._activeButton.button.alpha = 0;
	}

	private resetButton()
	{
		this._inactiveButton.isActive = true;
		this._inactiveButton.button.alpha = 1;

		this._activeButton.isActive = false;
		this._activeButton.button.alpha = 0;

		this._disabledButton.isActive = false;
		this._disabledButton.button.alpha = 0;

		this._disabledEvents[0] = false;
		this._disabledEvents[1] = true;
		this._disabledEvents[2] = false;
	}

	private activateButton()
	{
		this._inactiveButton.isActive = false;
		this._inactiveButton.button.alpha = 0;

		this._activeButton.isActive = true;
		this._activeButton.button.alpha = 1;
	}

	private async alertButton(button: PIXI.Container)
	{
		this._buttonIsShaking = true;
		const originalX = button.x;
		await Tweener.add
		(
			{
				target: button,
				duration: 0.1, ease: Easing.linear,
			},
			{
				x: originalX - 20
			}
		);

		await Tweener.add
		(
			{
				target: button,
				duration: 0.1, ease: Easing.linear,
			},
			{
				x: originalX + 20
			}
		);

		await Tweener.add
		(
			{
				target: button,
				duration: 0.1, ease: Easing.linear,
			},
			{
				x: originalX - 20
			}
		);

		await Tweener.add
		(
			{
				target: button,
				duration: 0.1, ease: Easing.linear,
			},
			{
				x: originalX + 20
			}
		);

		await Tweener.add
		(
			{
				target: button,
				duration: 0.1, ease: Easing.linear,
			},
			{
				x: originalX - 20
			}
		);

		await Tweener.add
		(
			{
				target: button,
				duration: 0.1, ease: Easing.linear,
			},
			{
				x: originalX
			}
		);

		this._buttonIsShaking = false;
	}

}
