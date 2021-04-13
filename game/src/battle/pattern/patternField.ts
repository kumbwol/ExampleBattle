import { FieldTypes } from "../field/fieldTypes";
import * as PIXI from "pixi.js";
import { FieldView } from "../field/fieldView";

export class PatternField extends FieldView
{
	private readonly _fieldContainer: PIXI.Container;
	private _container: PIXI.Container;

	constructor(container: PIXI.Container, x, y, type: FieldTypes)
	{
		super();

		this._fieldContainer = new PIXI.Container();
		this._container = container;
		this.createField(container, x, y, type);
	}

	public createField(container: PIXI.Container, x: number, y: number, type: FieldTypes)
	{
		const gapBetweenFields = 1;

		this.makeField(type);

		this._fieldIcon.x = (this._sprite.width - this._fieldIcon.width) / 2;
		this._fieldIcon.y = (this._sprite.height - this._fieldIcon.height) / 2;

		this._fieldContainer.x = (x) + x * (this._sprite.width + gapBetweenFields);
		this._fieldContainer.y = (y) + y * (this._sprite.height + gapBetweenFields);

		this._fieldContainer.addChild(this._sprite);
		this._fieldContainer.addChild(this._fieldIcon);
		container.addChild(this._fieldContainer);
	}

	get fieldWidth(): number
	{
		return this._attackFieldTexture.width;
	}
}
