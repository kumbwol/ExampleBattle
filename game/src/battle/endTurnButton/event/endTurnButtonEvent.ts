import { GameEvent } from "../../../event/gameEvent";

export class EndTurnButtonEvent extends GameEvent
{
	public static EV_END_TURN = "EV_END_TURN";
	public static EV_ALERT_END_TURN_BUTTON = "EV_ALERT_END_TURN_BUTTON";
	public static EV_END_TURN_WITH_UNUSED_ABILITY_POINTS = "EV_END_TURN_WITH_UNUSED_ABILITY_POINTS";

	constructor(type: string, args: any)
	{
		super(type, args);
	}
}
