import { SelectedPattern } from "./selectedPattern";
import * as PIXI from "pixi.js";

export class PatternRankPanel extends SelectedPattern
{
	constructor(dispatcher: PIXI.Container, container: PIXI.Container, pattern)
	{
		super(dispatcher, container);

		this._patternContainer.x = 0;
		this._patternContainer.y = 0;

		this.createPattern(container, pattern);
		this._patternContainer.alpha = 1;
	}

	protected addEventListener(container: PIXI.Container)
	{

	}
}
