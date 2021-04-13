import * as PIXI from 'pixi.js';
import { RankButtonEvent } from "../../skill/rank/event/rankButtonEvent";
import { PlayerSkill } from "../../skill/controller/playerSkill";
import { Button } from "../../button/button";
import { RankPanelEvent } from "./event/rankPanelEvent";
import { PatternEvent } from "./event/patternEvent";
import { NumberClass } from "../../numberClass";
import { SkillViewRankPanel } from "../../skill/view/skillViewRankPanel";
import { PatternRankPanel } from "../pattern/patternRankPanel";

export class RankPanel
{
	private readonly _rankPanelContainer: PIXI.Container;
	private readonly _skillViewContainer: PIXI.Container;
	private readonly _rankTextContainer: PIXI.Container;
	private readonly _patternContainer: PIXI.Container;
	private readonly _dispatcher: PIXI.Container;

	private _exitButton: Button;
	private _leftButton: Button;
	private _rightButton: Button;
	private _playerSkills: PlayerSkill[];
	private _skillViewRankPanel: SkillViewRankPanel;
	private _pattern: PatternRankPanel;

	private _selectedRank: number;

	private _selectedID: NumberClass;
	private _nextRank: NumberClass;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container, playerSkills: PlayerSkill[][])
	{
		this._rankPanelContainer = new PIXI.Container;
		this._skillViewContainer = new PIXI.Container;
		this._patternContainer = new PIXI.Container;
		this._rankTextContainer = new PIXI.Container;
		this._dispatcher = dispatcher;

		this.createRankPanel();

		parentContainer.addChild(this._rankPanelContainer);

		dispatcher.on(RankButtonEvent.EV_RANK_BUTTON_CLICK, (id: any, rank: any) =>
		{
			this._selectedID = new NumberClass(id.number);
			this._nextRank = new NumberClass(rank.number);

			this._selectedRank = rank.number;
			this._playerSkills = playerSkills[id.number];
			this.showRankPanel(rank.number);
		});

		dispatcher.on(RankPanelEvent.EV_LEFT_BUTTON_RANK_PANEL, () =>
		{
			this._selectedRank--;
			this.showRankPanel(this._selectedRank);
		});

		dispatcher.on(RankPanelEvent.EV_RIGHT_BUTTON_RANK_PANEL, () =>
		{
			this._selectedRank++;
			this.showRankPanel(this._selectedRank);
		});

		dispatcher.on(RankPanelEvent.EV_EXIT_RANK_PANEL, () =>
		{
			dispatcher.emit(PatternEvent.EV_ALLOW_PATTERN_SELECTION);
			this.hideRankPanel();
		});
	}

	private createRankPanel()
	{
		const offsetX = 2;
		const offsetY = 384;

		const rankPanelTexture = PIXI.Texture.from("skill/rankPanel.png");
		const rankExitButtonNormalTexture = PIXI.Texture.from("skill/exitButton/exitButtonNormal.png");
		const rankExitButtonHoverTexture = PIXI.Texture.from("skill/exitButton/exitButtonHover.png");
		const rankExitButtonPressedTexture = PIXI.Texture.from("skill/exitButton/exitButtonPressed.png");

		const rankLeftButtonNormalTexture = PIXI.Texture.from("skill/leftButton/leftButtonNormal.png");
		const rankLeftButtonHoverTexture = PIXI.Texture.from("skill/leftButton/leftButtonHover.png");
		const rankLeftButtonPressedTexture = PIXI.Texture.from("skill/leftButton/leftButtonPressed.png");

		const rankRightButtonNormalTexture = PIXI.Texture.from("skill/rightButton/rightButtonNormal.png");
		const rankRightButtonHoverTexture = PIXI.Texture.from("skill/rightButton/rightButtonHover.png");
		const rankRightButtonPressedTexture = PIXI.Texture.from("skill/rightButton/rightButtonPressed.png");

		this._exitButton = new Button(this._dispatcher, rankExitButtonNormalTexture, rankExitButtonHoverTexture, rankExitButtonPressedTexture, new RankPanelEvent(RankPanelEvent.EV_EXIT_RANK_PANEL, null), null);
		this._leftButton = new Button(this._dispatcher, rankLeftButtonNormalTexture, rankLeftButtonHoverTexture, rankLeftButtonPressedTexture, new RankPanelEvent(RankPanelEvent.EV_LEFT_BUTTON_RANK_PANEL, null), null);
		this._rightButton = new Button(this._dispatcher, rankRightButtonNormalTexture, rankRightButtonHoverTexture, rankRightButtonPressedTexture, new RankPanelEvent(RankPanelEvent.EV_RIGHT_BUTTON_RANK_PANEL, null), null);

		const rankPanelBackground = new PIXI.Sprite(rankPanelTexture);
		this._rankPanelContainer.addChild(rankPanelBackground);
		this._rankPanelContainer.addChild(this._exitButton.button);
		this._rankPanelContainer.addChild(this._leftButton.button);
		this._rankPanelContainer.addChild(this._rightButton.button);
		this._rankPanelContainer.addChild(this._rankTextContainer);

		this._exitButton.button.x = this._rankPanelContainer.width - this._exitButton.button.width;

		const leftButtonOffsetX = 50;
		const leftButtonOffsetY = 420;

		const rightButtonOffsetX = 224;
		const rightButtonOffsetY = 420;

		this._leftButton.button.x = leftButtonOffsetX;
		this._leftButton.button.y = leftButtonOffsetY;
		this._rightButton.button.x = rightButtonOffsetX;
		this._rightButton.button.y = rightButtonOffsetY;

		this._rankPanelContainer.x = offsetX;
		this._rankPanelContainer.y = offsetY;

		this.hideRankPanel();
	}

	private showRankPanel(rank: number)
	{
		this.hideRankPanel();

		this.showButtons();
		this.showRank();

		this._exitButton.isActive = true;
		this._leftButton.isActive = true;
		this._rightButton.isActive = true;
		this._rankPanelContainer.alpha = 1;

		this._skillViewRankPanel = new SkillViewRankPanel(this._dispatcher, this._skillViewContainer, 0, this._playerSkills, rank - 1);
		this._pattern = new PatternRankPanel(this._dispatcher, this._patternContainer, this._playerSkills[rank - 1].pattern);

		this._skillViewContainer.x = Math.round((this._rankPanelContainer.width - this._skillViewContainer.width) / 2);
		this._patternContainer.x = Math.round((this._rankPanelContainer.width - this._patternContainer.width) / 2);

		const skillViewOffsetY = -60;
		const patternOffsetY = 30;
		this._skillViewContainer.y = skillViewOffsetY;
		this._patternContainer.y = patternOffsetY;

		this._rankPanelContainer.addChild(this._skillViewContainer);
		this._rankPanelContainer.addChild(this._patternContainer);
	}

	private showRank()
	{
		const textStyle = new PIXI.TextStyle({fontFamily : 'Trajan_Pro_Regular', fontSize: 80, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 290});

		const text = new PIXI.Text("", textStyle);
		switch(this._selectedRank)
		{
			case 1:
				text.text = "I";
				break;

			case 2:
				text.text = "II";
				break;

			case 3:
				text.text = "III";
				break;

			case 4:
				text.text = "IV";
				break;

			case 5:
				text.text = "V";
				break;

			case 6:
				text.text = "VI";
				break;
		}

		this._rankTextContainer.removeChildren();
		this._rankTextContainer.addChild(text);

		const offsetY = 418;
		this._rankTextContainer.y = offsetY;
		this._rankTextContainer.x = Math.round((this._rankPanelContainer.width - this._rankTextContainer.width) / 2);
	}

	private showButtons()
	{
		if(this._selectedRank >= this._playerSkills.length)
		{
			this._rightButton.button.alpha = 0;
			this._rightButton.isActive = false;
		}
		else
		{
			this._rightButton.button.alpha = 1;
			this._rightButton.isActive = true;
		}

		if(this._selectedRank <= 1)
		{
			this._leftButton.button.alpha = 0;
			this._leftButton.isActive = false;
		}
		else
		{
			this._leftButton.button.alpha = 1;
			this._leftButton.isActive = true;
		}
	}

	private hideRankPanel()
	{
		this._exitButton.isActive = false;
		this._leftButton.isActive = false;
		this._rightButton.isActive = false;
		this._rankPanelContainer.alpha = 0;

		this._pattern = null;
		this._patternContainer.removeChildren(0);
		if(this._rankPanelContainer.children.length > 5)
		{
			this._rankPanelContainer.removeChildren(5);
		}
	}

}
