export class Cursor
{
	private readonly _default;
	private readonly _hide;
	private readonly _view;
	private _app: PIXI.Application;
	private _x;
	private _visible: boolean;
	private _isView: boolean;

	constructor(app: PIXI.Application)
	{
		this._default = "url('./game/images/cursor/default.png'),auto";
		this._hide = "url('./game/images/cursor/hide.png'),auto";
		this._view = "url('./game/images/cursor/view.png'),auto";
		this._app = app;
		this._visible = true;
		this._isView = false;

		this._x = document.getElementsByTagName("canvas")[0];
	}

	public changeCursor()
	{
		if(this._visible && !this._isView)
		{
			this._x.className = "";
			this._x.classList.add("cursorDefault");
		}
		/*this._app.renderer.plugins.interaction.setCursorMode("pointer");
		this._app.renderer.plugins.interaction.setCursorMode("default");
		this._app.renderer.plugins.interaction.cursorStyles.default = this._default;
		this._app.renderer.plugins.interaction.cursorStyles.pointer = this._default;
		this._app.renderer.plugins.interaction.setCursorMode("pointer");
		this._app.renderer.plugins.interaction.setCursorMode("default");*/
	}

	public hideCursor()
	{
		this._x.className = "";
		this._x.classList.add("cursorHide");
		this._visible = false;
		/*this._app.renderer.plugins.interaction.setCursorMode("pointer");
		this._app.renderer.plugins.interaction.setCursorMode("default");
		this._app.renderer.plugins.interaction.cursorStyles.default = this._hide;
		this._app.renderer.plugins.interaction.cursorStyles.pointer = this._hide;
		this._app.renderer.plugins.interaction.setCursorMode("pointer");
		this._app.renderer.plugins.interaction.setCursorMode("default");*/
	}

	public pointerCursor()
	{
		if(this._visible && !this._isView)
		{
			this._x.className = "";
			this._x.classList.add("cursorPointer");
		}
		/*this._app.renderer.plugins.interaction.setCursorMode("pointer");
		this._app.renderer.plugins.interaction.setCursorMode("default");
		this._app.renderer.plugins.interaction.cursorStyles.default = this._hide;
		this._app.renderer.plugins.interaction.cursorStyles.pointer = this._hide;
		this._app.renderer.plugins.interaction.setCursorMode("pointer");
		this._app.renderer.plugins.interaction.setCursorMode("default");*/
	}

	public viewCursor()
	{
		if(this._visible)
		{
			this._isView = true;
			this._x.className = "";
			this._x.classList.add("viewCursor");
		}
		/*this._app.renderer.plugins.interaction.setCursorMode("pointer");
		this._app.renderer.plugins.interaction.setCursorMode("default");
		this._app.renderer.plugins.interaction.cursorStyles.default = this._hide;
		this._app.renderer.plugins.interaction.cursorStyles.pointer = this._hide;
		this._app.renderer.plugins.interaction.setCursorMode("pointer");
		this._app.renderer.plugins.interaction.setCursorMode("default");*/
	}

	set visible(visible: boolean)
	{
		this._visible = visible;
	}

	set view(isView: boolean)
	{
		this._isView = isView;
	}

	get visible(): boolean
	{
		return this._visible;
	}
}
