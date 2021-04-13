import * as PIXI from 'pixi.js';
import { Loader } from "./loader";
import { Resize } from "./resize";
import { Tweener } from "pixi-tweener";
import { Cursor } from "./cursor/Cursor";
import { GameManager } from "./gameManager";

export class Main
{
	public static App: PIXI.Application;
	private _container: PIXI.Container;
	private _resize: Resize;
	public static cursor: Cursor;

	constructor()
	{
		Main.App = new PIXI.Application(
			{
				width: 1600,
				height: 900,
				backgroundColor: 0x1099bb,
				resolution: 1
			}
		);

		document.body.appendChild(Main.App.view);
		document.oncontextmenu = () => {return false;};

		this._container = new PIXI.Container();

		Main.App.stage.addChild(this._container);

		this._resize = new Resize();

		new Loader(Main.App.loader, this);
	}

	public setup()
	{
		PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;
		Tweener.init(Main.App.ticker);
		Main.cursor = new Cursor(Main.App);

		new GameManager(Main.App, this._container);
		this._resize.resize(Main.App.screen);

		Main.cursor.changeCursor();

		window.onresize = () => this._resize.resize(Main.App.screen);

		Main.App.ticker.add(() => {
			//console.log(this._app.renderer.plugins.interaction.currentCursorMode);
			//this._app.renderer.plugins.interaction.cursorStyles.default = "url('game/images/lakat.png'),auto";
			this._container.emit("GAME_TICK");
		});
	}
}

new Main();
