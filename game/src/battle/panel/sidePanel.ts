import * as PIXI from 'pixi.js';
import { PatternEvent } from "./event/patternEvent";
import { Main } from '../../main';
import { HpBar } from "./Bars/hpBar/hpBar";
import { MpBar } from "./Bars/mpBar/mpBar";
import { SkillViewPlayer } from "../../skill/view/skillViewPlayer";
import { SkillViewEnemy } from "../../skill/view/skillViewEnemy";
import { Portrait } from "./portraits/portrait";
import { Enemy } from '../../enemy/enemy';
import { Player } from "../../player/player";
import { Shield } from "./Bars/shield/shield";
import { SkillEvent } from "../../skill/event/skillEvent";
import { FieldEvent } from "../field/event/fieldEvent";
import { BooleanClass } from "../../booleanClass";
import { RankButtonsView } from "../../skill/rank/rankButtonsView";
import { RankPanel } from "./rankPanel";

export class SidePanel
{
	private _panelContainerLeft: PIXI.Container;
	private _panelContainerRight: PIXI.Container;
	private readonly _portraitContainer: PIXI.Container;
	private _playerSkills: SkillViewPlayer[];
	private readonly _enemySkills: SkillViewEnemy[];
	private _rankButtonsView: RankButtonsView;
	private _rankPanel: RankPanel;

	protected _mainContainer: PIXI.Container;

	constructor(app: PIXI.Application, container: PIXI.Container, player: Player, enemy: Enemy)
	{
		let dispatcher = container;
		this._playerSkills = [];
		this._enemySkills = [];
		this._panelContainerLeft = new PIXI.Container();
		this._panelContainerRight = new PIXI.Container();
		this._portraitContainer = new PIXI.Container();
		this._mainContainer = new PIXI.Container();

		container.addChild(this._mainContainer);

		this.createDarkener(dispatcher, this._mainContainer);
		this.createPlayerPanel(dispatcher, player);

		this._panelContainerRight = this.createPanels();
		for(let i=0; i<enemy.skills.length; i++)
		{
			this._enemySkills.push(new SkillViewEnemy(dispatcher, this._panelContainerRight, i, enemy.skills[i], this.isExamine()));
		}

		this._panelContainerRight.x = app.screen.width - this._panelContainerRight.width;
		new HpBar(dispatcher, this._panelContainerRight, enemy.hp, enemy.maxHp, false);
		new MpBar(dispatcher, this._panelContainerRight, enemy.mp, enemy.maxMp, false);
		new Shield(dispatcher, this._panelContainerRight, enemy.shield, false);
		new Portrait(dispatcher, this._panelContainerRight, enemy.portrait, false);

		this._mainContainer.addChild(this._panelContainerLeft);
		this._mainContainer.addChild(this._panelContainerRight);

		this.createPlayerSkills(dispatcher, this._mainContainer, player);

		dispatcher.on(SkillEvent.EV_PLAYER_SKILL_STARTED, () =>
		{
			for(let i=0; i<this._playerSkills.length; i++)
			{
				if(this._playerSkills[i].isSelected)
				{
					this._playerSkills[i].activate();
				}
			}
		});

		dispatcher.on(FieldEvent.EV_FIELD_RESWAP, (redoAbility: BooleanClass) =>
		{
			if(redoAbility.boolean)
			{
				this._playerSkills[this._playerSkills[0].lastTimeUsedAbilityID].redoAbility();
			}
		});

		dispatcher.on(SkillEvent.EV_PLAYER_SKILL_FINISHED, () =>
		{
			this._playerSkills[this._playerSkills[0].lastTimeActivatedSkillID].upgradeSkill();
		});
	}

	protected isExamine()
	{
		return false;
	}

	protected createEnemySkills()
	{

	}

	protected createDarkener(dispatcher: PIXI.Container, container: PIXI.Container)
	{
	}

	protected createPlayerPanel(dispatcher: PIXI.Container, player: Player)
	{
		this._panelContainerLeft = this.createPanels();
		this._panelContainerLeft.x = 0;

		for(let i=0; i<player.skills.length; i++)
		{
			this._playerSkills.push(new SkillViewPlayer(dispatcher, this._panelContainerLeft, i, player.skills[i]));
		}

		new HpBar(dispatcher, this._panelContainerLeft, player.hp, player.maxHp, true);
		new MpBar(dispatcher, this._panelContainerLeft, player.mp, player.maxMp, true);
		new Shield(dispatcher, this._panelContainerLeft, player.shield, true);
		new Portrait(dispatcher, this._panelContainerLeft, player.portrait, true);
	}

	protected createPlayerSkills(dispatcher: PIXI.Container, container: PIXI.Container, player: Player)
	{
		this._rankButtonsView = new RankButtonsView(dispatcher, container, player.skills);

		this._rankPanel = new RankPanel(dispatcher, container, player.skills);

		dispatcher.on(PatternEvent.EV_ALLOW_PATTERN_SELECTION, () =>
		{
			Main.cursor.visible = true;
			Main.cursor.changeCursor();
			for(let i=0; i<this._playerSkills.length; i++)
			{
				this._playerSkills[i].updateSkill(player.skills[i][this._playerSkills[i].rank]);
				this._playerSkills[i].enableSkill();
				this._playerSkills[i].isSelected = false;
			}
		});
	}

	get enemySkills(): SkillViewEnemy[]
	{
		return this._enemySkills;
	}

	private createPanels(): PIXI.Container
	{
		const container = new PIXI.Container;
		const panelTexture = PIXI.Texture.from("panel.png");
		const panel = new PIXI.Sprite(panelTexture);

		container.addChild(panel);

		panel.interactive = true;

		return container;

		/*container.addChild(this._panelContainerLeft);
		container.addChild(this._panelContainerRight);*/

		//this._panelContainerRight.x = app.screen.width - panelTexture.width;
	}
}
