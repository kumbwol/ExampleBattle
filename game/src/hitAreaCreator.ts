import * as PIXI from "pixi.js";

export class HitAreaCreator
{
	constructor()
	{

	}

	public hitAreaCircle(x: number, y: number, r: number): PIXI.Graphics
	{
		let hitArea = new PIXI.Graphics;

		hitArea.beginFill(0x00FF00);
		hitArea.drawCircle(x + r, y + r, r);
		hitArea.endFill();
		hitArea.alpha = 0;

		return hitArea;
	}

	public hitAreaRectangle(x: number, y: number, w: number, h: number): PIXI.Graphics
	{
		let hitArea = new PIXI.Graphics;

		hitArea.beginFill(0x00FF00);
		hitArea.drawRect(x, y, w, h);
		hitArea.endFill();
		hitArea.alpha = 0;

		return hitArea;
	}
}
