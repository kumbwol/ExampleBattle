import { GameEvent } from "../../event/gameEvent";

export class GameAlertEvent extends GameEvent
{
	public static EV_GAME_ALERT = "EV_GAME_ALERT";
	public static EV_GAME_ALERT_NO = "EV_GAME_ALERT_NO";
	public static EV_GAME_ALERT_YES = "EV_GAME_ALERT_YES";

	constructor(type: string, args: any)
	{
		super(type, args);
	}
}
