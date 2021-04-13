import { GameEvent } from "../../../event/gameEvent";

export class AbilityEvent extends GameEvent
{
	public static EV_NO_MORE_ABILITIES = "EV_NO_MORE_ABILITIES";
	public static EV_HAVE_MORE_ABILITIES = "EV_HAVE_MORE_ABILITIES";

	public static EV_ABILITY_SELECTED = "EV_ABILITY_SELECTED";

	public static EV_DIAGONAL_SWAP_SELECTED = "EV_DIAGONAL_SWAP_SELECTED";
	public static EV_DIAGONAL_SWAP_STOPPED = "EV_DIAGONAL_SWAP_STOPPED";

	public static EV_KNIGHT_SWAP_SELECTED = "EV_KNIGHT_SWAP_SELECTED";
	public static EV_KNIGHT_SWAP_STOPPED = "EV_KNIGHT_SWAP_STOPPED";

	public static EV_ROTATE_LEFT_SELECTED = "EV_ROTATE_LEFT_SELECTED";
	public static EV_ROTATE_LEFT_STOPPED = "EV_ROTATE_LEFT_STOPPED";

	public static EV_ROTATE_RIGHT_SELECTED = "EV_ROTATE_RIGHT_SELECTED";
	public static EV_ROTATE_RIGHT_STOPPED = "EV_ROTATE_RIGHT_STOPPED";

	public static EV_MIRROR_VERTICALLY_SELECTED = "EV_MIRROR_VERTICALLY_SELECTED";
	public static EV_MIRROR_VERTICALLY_STOPPED = "EV_MIRROR_VERTICALLY_STOPPED";

	public static EV_MIRROR_HORIZONTALLY_SELECTED = "EV_MIRROR_HORIZONTALLY_SELECTED";
	public static EV_MIRROR_HORIZONTALLY_STOPPED = "EV_MIRROR_HORIZONTALLY_STOPPED";

	private readonly _id: number;

	constructor(type: string, id: number)
	{
		super(type, id);
		this._id = id;
	}

	public get id(): number
	{
		return this._id;
	}
}
