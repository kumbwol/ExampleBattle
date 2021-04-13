import { GameEvent } from "../../../event/gameEvent";

export class LogicEvent extends GameEvent
{
	public static EV_DISABLE_END_TURN_BUTTON = "EV_DISABLE_END_TURN_BUTTON";
	public static EV_ENABLE_END_TURN_BUTTON = "EV_ENABLE_END_TURN_BUTTON";
	public static EV_DISABLE_SWAP = "EV_DISABLE_SWAP";
	public static EV_ENABLE_SWAP = "EV_ENABLE_SWAP";

	public static EV_ENABLE_SPECIAL_SKILL_SELECTION = "EV_ENABLE_SPECIAL_SKILL_SELECTION";
	public static EV_DISABLE_SPECIAL_SKILL_SELECTION = "EV_DISABLE_SPECIAL_SKILL_SELECTION";

	public static EV_ENABLE_REDO_ABILITY = "EV_ENABLE_REDO_ABILITY";

	public static EV_DISABLE_FIELD_SELECTION = "EV_DISABLE_FIELD_SELECTION";

	public static EV_COUNT_STUCK_CHANCE = "EV_COUNT_STUCK_CHANCE";

	public static EV_LOSE_BATTLE = "EV_LOSE_BATTLE";
	public static EV_WIN_BATTLE = "EV_WIN_BATTLE";

	public static EV_BATTLE_OVER = "EV_BATTLE_OVER";

	constructor(type: string, args: any)
	{
		super(type, args);
	}
}
