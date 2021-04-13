import { GameEvent } from "../../../event/gameEvent";

export class RankPanelEvent extends GameEvent
{
	public static EV_EXIT_RANK_PANEL = "EV_EXIT_RANK_PANEL";
	public static EV_RIGHT_BUTTON_RANK_PANEL = "EV_RIGHT_BUTTON_RANK_PANEL";
	public static EV_LEFT_BUTTON_RANK_PANEL = "EV_LEFT_BUTTON_RANK_PANEL";

	constructor(type: string, args: any)
	{
		super(type, args);
	}
}
