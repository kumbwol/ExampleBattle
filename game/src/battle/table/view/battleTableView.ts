import * as PIXI from 'pixi.js';

export class BattleTableView
{
	private _container = new PIXI.Container();

	constructor(app: PIXI.Application, container: PIXI.Container)
	{
		this.createBattleTable(app, container);
	}

	private createBattleTable(app: PIXI.Application, container: PIXI.Container)
	{
		const tableTexture = PIXI.Texture.from("battle/table.png");
		const table = new PIXI.Sprite(tableTexture);

		this._container.x = (app.screen.width - tableTexture.width) / 2;
		this._container.y = 10;

		this._container.addChild(table);
		container.addChild(this._container);
	}

	get container(): PIXI.Container
	{
		return this._container;
	}
}
