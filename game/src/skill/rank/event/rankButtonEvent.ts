import { GameEvent } from "../../../event/gameEvent";

export class RankButtonEvent extends GameEvent
{
	public static EV_RANK_UPDATED = "EV_RANK_UPDATED";
	public static EV_RANK_BUTTON_CLICK = "EV_RANK_BUTTON_CLICK";

	constructor(type: string, args: any, args2: any)
	{
		super(type, args, args2);
	}
}
