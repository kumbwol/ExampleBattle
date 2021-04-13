import * as PIXI from "pixi.js";
import { Enemy } from "../../enemy/enemy";
import { EndTurnButtonEvent } from "../endTurnButton/event/endTurnButtonEvent";
import { SkillEvent } from "../../skill/event/skillEvent";
import { SkillViewEnemy } from "../../skill/view/skillViewEnemy";
import { EffectEvent } from "../../skill/effect/event/effectEvent";
import { PatternEvent } from "../panel/event/patternEvent";

export class DecideEnemySkills
{
	private _enemy: Enemy;
	private _dispatcher: PIXI.Container;
	private _skillViewEnemy: SkillViewEnemy[];
	private _selectedSkillID: number;

	constructor(dispatcher: PIXI.Container, enemy: Enemy, skillViewEnemy: SkillViewEnemy[])
	{
		this._dispatcher = dispatcher;
		this._enemy = enemy;
		this._skillViewEnemy = skillViewEnemy;
		this._selectedSkillID = 0;

		dispatcher.on(EffectEvent.EV_SECONDARY_EFFECT_FINISHED, (isPlayer: boolean) =>
		{
			if(!isPlayer)
			{
				for(let i=0; i<this._skillViewEnemy.length; i++)
				{
					this._skillViewEnemy[i].inActivateSkill();
				}
				this._selectedSkillID++;
				if(this._selectedSkillID < this._skillViewEnemy.length)
				{
					this._skillViewEnemy[this._selectedSkillID].selectSkills();
				}
				else
				{
					this._selectedSkillID = 0;
					for(let i=0; i<this._skillViewEnemy.length; i++)
					{
						this._skillViewEnemy[i].enableSkill();
					}
					dispatcher.emit(PatternEvent.EV_ALLOW_PATTERN_SELECTION);
					dispatcher.emit(SkillEvent.EV_ENEMY_FINISHED_TURN);
				}
			}
		});

		dispatcher.on(SkillEvent.EV_SELECT_ENEMY_SKILL, (id: number) =>
		{
			this._skillViewEnemy[id].selectSkills();
		});

		dispatcher.on(EndTurnButtonEvent.EV_END_TURN, () =>
		{
			this.decideSkills();
		});
	}

	private decideSkills()
	{
		for(let i=0; i<this._enemy.skills.length; i++)
		{
			let random = Math.floor(Math.random() * 100) + 1;

			console.log("random: " + random);

			this._enemy.skills[i][0].active = random <= this._enemy.skills[i][0].chance.value
		}

		this._dispatcher.emit(SkillEvent.EV_ENEMYS_SKILLS_DECIDED);
	}
}
