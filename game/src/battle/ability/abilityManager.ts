import * as PIXI from "pixi.js";
import { AbilityPointView } from "./abilityPoint/abilityPointView";
import { Player } from "../../player/player";
import { AbilityView } from "./abilityView";

export class AbilityManager
{
	private _abilityPointView: AbilityPointView;
	private _abilityView: AbilityView;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container, player: Player)
	{
		this._abilityPointView = new AbilityPointView(dispatcher, parentContainer, player);
		this._abilityView = new AbilityView(dispatcher, parentContainer, player);
	}
}
