import { GameEvent } from "../../event/gameEvent";

export class SkillEvent extends GameEvent
{
	public static EV_SHOW_EFFECT_EXPLAINER = "EV_SHOW_EFFECT_EXPLAINER";
	public static EV_SHOW_CHANCE_EXPLAINER = "EV_SHOW_CHANCE_EXPLAINER";
	public static EV_SKILL_SELECTED = "EV_SKILL_SELECTED";
	public static EV_SKILL_SELECTED_WITH_ABILITY = "EV_SKILL_SELECTED_WITH_ABILITY";
	public static EV_ENEMY_SKILL_SELECTED = "EV_ENEMY_SKILL_SELECTED";
	public static EV_ENEMYS_SKILLS_DECIDED = "EV_ENEMYS_SKILLS_DECIDED";
	public static EV_SELECT_ENEMY_SKILL = "EV_SELECT_ENEMY_SKILL";
	public static EV_ACTIVATE_ENEMY_SKILL = "EV_ACTIVATE_ENEMY_SKILL";
	public static EV_ENEMY_FINISHED_TURN = "EV_ENEMY_FINISHED_TURN";
	public static EV_PLAYER_SKILL_FINISHED = "EV_PLAYER_SKILL_FINISHED";
	public static EV_PLAYER_SKILL_STARTED = "EV_PLAYER_SKILL_STARTED";

	constructor(type: string, args: any)
	{
		super(type, args);
	}
}
