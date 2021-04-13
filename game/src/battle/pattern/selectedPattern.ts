import { PatternField } from "./patternField";
import * as PIXI from "pixi.js";
import { HitAreaCreator } from "../../hitAreaCreator";
import { Pattern } from "../../skill/pattern/pattern";
import { Main } from "../../main";
import { SkillEvent } from "../../skill/event/skillEvent";
import { PlayerSkill } from "../../skill/controller/playerSkill";
import { PatternEvent } from "../panel/event/patternEvent";

export class SelectedPattern
{
	private readonly _pattern: PatternField[][];
	protected readonly _patternContainer: PIXI.Container;
	private _container: PIXI.Container;
	private _dispatcher: PIXI.Container;
	private _dragging: boolean;
	private _data: any;
	private _mouseMoveDetector: PIXI.Graphics;
	private _width: number;

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container)
	{
		this._patternContainer = new PIXI.Container();
		this._container = parentContainer;
		this._dispatcher = dispatcher;
		this._pattern = [];
		this._dragging = false;
		this._data = null;
		this._mouseMoveDetector = new HitAreaCreator().hitAreaRectangle(this._container.x, this._container.y, this._container.width, this._container.height);

		this.addEventListener(parentContainer);
	}

	protected addEventListener(container: PIXI.Container)
	{
		this._dispatcher.on(SkillEvent.EV_SKILL_SELECTED, (e, skill: PlayerSkill) =>
		{
			Main.cursor.hideCursor();
			this.createPattern(container, skill.pattern);
			this._width = this._pattern[0][0].fieldWidth;

			let newPosition = e.data.getLocalPosition(this._mouseMoveDetector);
			this._patternContainer.x = newPosition.x - Math.floor(this._width / 2);
			this._patternContainer.y = newPosition.y - Math.floor(this._width / 2);
			this._mouseMoveDetector = new HitAreaCreator().hitAreaRectangle(this._container.x, this._container.y, this._container.width, this._container.height);
			this._mouseMoveDetector.interactive = true;

			this._mouseMoveDetector.on("pointerup", (e) =>
			{
				this._dispatcher.emit(PatternEvent.EV_PATTERN_DELETE);
				this.deletePattern();
			});

			this._mouseMoveDetector.on("mousemove", (e) =>
			{
				this.onDragMove(e);
			});

			this._mouseMoveDetector.on("touchmove", (e) =>
			{
				this.onDragMove(e);
			});

			this._dispatcher.on(PatternEvent.EV_PATTERN_DELETE, () =>
			{
				this.deletePattern();
			});

			this._dispatcher.addChildAt(this._mouseMoveDetector, 1);
		});
	}

	private onDragMove(event)
	{
		this._data = event.data;
		let newPosition = this._data.getLocalPosition(this._mouseMoveDetector);

		this._patternContainer.x = newPosition.x - Math.floor(this._width / 2);
		this._patternContainer.y = newPosition.y - Math.floor(this._width / 2);
	}

	protected deletePattern()
	{
		Main.cursor.visible = true;
		Main.cursor.changeCursor();
		this._patternContainer.removeChildren();
		this._container.removeChild(this._mouseMoveDetector);
		this._container.removeChild(this._patternContainer);
	}

	protected createPattern(container: PIXI.Container, pattern: Pattern)
	{
		container.addChild(this._patternContainer);

		for(let i=0; i<pattern.pattern.length; i++)
		{
			this._pattern[i] = [];
			for(let j=0; j<pattern.pattern[i].length; j++)
			{
				this._pattern[i][j] = new PatternField(this._patternContainer, j, i, pattern.pattern[i][j]);
			}
		}

		this._patternContainer.alpha = 0.7;
	}

	get pattern(): PatternField[][]
	{
		return this._pattern;
	}
}
