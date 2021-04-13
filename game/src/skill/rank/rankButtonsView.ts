import * as PIXI from "pixi.js";
import { Button } from "../../button/button";
import { PlayerSkill } from "../controller/playerSkill";
import { RankButtonEvent } from "./event/rankButtonEvent";
import { NumberClass } from "../../numberClass";
import { SkillEvent } from "../event/skillEvent";
import { PatternEvent } from "../../battle/panel/event/patternEvent";

export class RankButtonsView
{
	private readonly _rankButtons: Button[];
	private readonly _dispatcher: PIXI.Container;
	private readonly _buttonText: PIXI.Text[];
	private readonly _textContainers: PIXI.Container[];
	private readonly _ranksContainer: PIXI.Container;
	private readonly _rankContainers: PIXI.Container[];
	private readonly _textStyle: PIXI.TextStyle;
	private _ranks: NumberClass[];

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container, playerSkills: PlayerSkill[][])
	{
		this._textStyle = new PIXI.TextStyle({fontFamily : 'Trajan_Pro_Regular', fontSize: 28, fill : 0x000000, align : 'left', wordWrap: true, wordWrapWidth: 290});

		this._dispatcher = dispatcher;
		this._rankButtons = [];
		this._textContainers = [];
		this._rankContainers = [];
		this._buttonText = [];
		this._ranks = [];

		this._ranksContainer = this.createRanks(playerSkills);
		parentContainer.addChild(this._ranksContainer);

		for(let i=0; i<this._rankContainers.length; i++)
		{
			this.updateNumberPosition(i);
		}

		dispatcher.on(RankButtonEvent.EV_RANK_UPDATED, (id: number, rank: number) =>
		{
			switch (rank)
			{
				case 1:
					this._buttonText[id].text = "I";
					break;

				case 2:
					this._buttonText[id].text = "II";
					break;

				case 3:
					this._buttonText[id].text = "III";
					break;

				case 4:
					this._buttonText[id].text = "IV";
					break;

				case 5:
					this._buttonText[id].text = "V";
					break;

				case 6:
					this._buttonText[id].text = "VI";
					break;
			}

			this._ranks[id].number = rank;
			this.updateNumberPosition(id);
		});

		dispatcher.on(SkillEvent.EV_SKILL_SELECTED, () =>
		{
			this.disableButtons(playerSkills);
		});

		dispatcher.on(PatternEvent.EV_PATTERN_DELETE, () =>
		{
			this.enableButtons(playerSkills);
		});
	}

	public updateRanks(playerSkills: PlayerSkill[][])
	{
		for(let i=0; i<playerSkills.length; i++)
		{
			if(playerSkills[i].length > 1)
			{
				this._rankButtons[i].isActive = true;
				this._rankContainers[i].alpha = 1;
			}
			else
			{
				this._rankButtons[i].isActive = false;
				this._rankContainers[i].alpha = 0;
			}
		}
	}

	private createRanks(playerSkills: PlayerSkill[][]): PIXI.Container
	{
		const offsetX = 320;
		const offsetY = 383;

		const ranksContainer = new PIXI.Container;

		const rankNotSelectedNormalTexture = PIXI.Texture.from("skill/rank/notSelected/rankNormal.png");
		const rankNotSelectedHoverTexture = PIXI.Texture.from("skill/rank/notSelected/rankHover.png");
		const rankNotSelectedDisabledTexture = PIXI.Texture.from("skill/rank/notSelected/rankPressed.png");

		for(let i=0; i<playerSkills.length; i++)
		{
			let iNumberClass = new NumberClass(i);
			this._ranks.push(new NumberClass(1));
			this._rankButtons.push(new Button(this._dispatcher, rankNotSelectedNormalTexture, rankNotSelectedHoverTexture, rankNotSelectedDisabledTexture, new RankButtonEvent(RankButtonEvent.EV_RANK_BUTTON_CLICK, iNumberClass, this._ranks[i]), null));
			this._buttonText[i] = new PIXI.Text("I", this._textStyle);

			this._rankContainers[i] = new PIXI.Container;
			this._rankContainers[i].addChild(this._rankButtons[i].button);

			if(playerSkills[i].length > 1)
			{
				this._rankButtons[i].isActive = true;
			}
			else
			{
				this._rankButtons[i].isActive = false;
				this._rankContainers[i].alpha = 0;
			}
		}

		for(let i=0; i<this._rankButtons.length; i++)
		{
			this._textContainers.push(new PIXI.Container);
			this._rankContainers[i].y = i*rankNotSelectedNormalTexture.height;
			this._textContainers[i].addChild(this._buttonText[i]);

			this._rankContainers[i].addChild(this._textContainers[i]);

			ranksContainer.addChild(this._rankContainers[i]);
		}

		ranksContainer.x = offsetX;
		ranksContainer.y = offsetY;

		return ranksContainer;
	}

	private updateNumberPosition(index: number)
	{
		this._textContainers[index].x = Math.floor(this._ranksContainer.width / 2) - Math.floor(this._textContainers[index].width / 2);
		this._textContainers[index].y = Math.floor(this._rankContainers[index].height / 2) - Math.floor(this._textContainers[index].height / 2);
	}

	private disableButtons(playerSkills: PlayerSkill[][])
	{
		for(let i=0; i<playerSkills.length; i++)
		{
			this._rankButtons[i].isActive = false;
		}
	}

	private enableButtons(playerSkills: PlayerSkill[][])
	{
		for(let i=0; i<playerSkills.length; i++)
		{
			if(playerSkills[i].length > 1)
			{
				this._rankButtons[i].isActive = true;
			}
		}
	}
}
