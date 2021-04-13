import { GameEvent } from "../../../event/gameEvent";

export class FieldEvent extends GameEvent
{
	public static EV_ALLOW_RESWAP = "EV_ALLOW_RESWAP";
	public static EV_FIELD_SWAPPED = "EV_FIELD_SWAPPED";
	public static EV_FIELD_RESWAP = "EV_FIELD_RESWAP";
	public static EV_DIAGONAL_SWAP = "EV_DIAGONAL_SWAP";
	public static EV_FIELD_SELECTED = "EV_FIELD_SELECTED";
	public static EV_FIELD_REMOVE_SELECTION = "EV_FIELD_REMOVE_SELECTION";
	public static EV_FIELD_SWIPE_SELECTION = "EV_FIELD_SWIPE_SELECTION";
	public static EV_FIELD_PATTERN_ACTIVATING = "EV_FIELD_PATTERN_ACTIVATING";

	constructor(type: string, args: any)
	{
		super(type, args);
	}
}
