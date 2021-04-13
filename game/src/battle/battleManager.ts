import { SidePanel } from "./panel/sidePanel";
import { BattleTableView } from "./table/view/battleTableView";
import { TableCreator } from "./table/tableCreator";
import { FieldSwapper } from "./field/controller/fieldSwapper";
import { FieldPossibleSwaps } from "./field/controller/fieldPossibleSwaps";
import { SelectedPattern } from "./pattern/selectedPattern";
import { SkillActivision } from "../skill/controller/skillActivision";
import { Player } from "../player/player";
import { SkillExplainerView } from "../skill/view/skillExplainerView";
import { EffectActivision } from "../skill/effect/effectActivision";
import { AbilityManager } from "./ability/abilityManager";
import { EndTurnButton } from "./endTurnButton/endTurnButton";
import { GameAlert } from "../gameAlert/gameAlert";
import { DecideEnemySkills } from "./enemysTurn/decideEnemysSkills";
import { BattleLogicController } from "./logic/battleLogicController";
import { ReSwapButton } from "./reSwapButton/reSwapButton";
import { SkillSelector } from "../skill/view/skillSelector";
import { Disabler } from "./disabler/disabler";
import { Enemy } from "../enemy/enemy";
import { BattleOverScene } from "./disabler/battleOverScene";

export class BattleManager
{
	private _sidePanel: SidePanel;
	private _battleTableView: BattleTableView;
	private _tableCreator: TableCreator;
	private _fieldSwapper: FieldSwapper;
	private _fieldPossibleSwaps: FieldPossibleSwaps;
	private _pattern: SelectedPattern;
	private readonly _app: PIXI.Application;
	private _dispatcher: PIXI.Container;
	private _parentContainer: PIXI.Container;
	private _skillActivision: SkillActivision;
	private _skillExplainer: SkillExplainerView;
	private _gameAlert: GameAlert;
	private _effectActivision: EffectActivision;
	private _abilityManager: AbilityManager;
	private _endTurnButton: EndTurnButton;
	private _reSwapButton: ReSwapButton;
	private _decideEnemysSkills: DecideEnemySkills;
	private _battleLogicController: BattleLogicController;
	private _skillSelector: SkillSelector;
	private _disabler: Disabler;
	private _battleOverScene: BattleOverScene;
	private _enemy: Enemy;
	private _player: Player;

	constructor(app: PIXI.Application, container: PIXI.Container, player: Player)
	{
		this._app = app;
		this._dispatcher = container;
		this._parentContainer = container;
		this._player = player;
	}

	public startBattle(container: PIXI.Container)
	{
		this._parentContainer = container;
		this._dispatcher = container;

		this._player.abilityPoint = this._player.maxAbilityPoint;

		this._sidePanel = new SidePanel(this._app, this._dispatcher, this._player, this._enemy);

		this._battleTableView = new BattleTableView(this._app, this._parentContainer);
		this._tableCreator = new TableCreator(this._dispatcher, this._battleTableView.container, 9, 9);
		this._fieldSwapper = new FieldSwapper(this._dispatcher, this._tableCreator.table, this._battleTableView.container);
		this._fieldPossibleSwaps = new FieldPossibleSwaps(this._dispatcher, this._tableCreator.table, this._battleTableView.container);

		this._pattern = new SelectedPattern(this._dispatcher, this._parentContainer);
		this._skillActivision = new SkillActivision(this._dispatcher, this._tableCreator.table, this._pattern.pattern);
		this._effectActivision = new EffectActivision(this._dispatcher, this._player, this._enemy);
		this._endTurnButton = new EndTurnButton(this._dispatcher, this._parentContainer);
		this._skillSelector = new SkillSelector(this._dispatcher, this._parentContainer);
		this._abilityManager = new AbilityManager(this._dispatcher, this._parentContainer, this._player);
		this._disabler = new Disabler(this._dispatcher, this._parentContainer);
		this._reSwapButton = new ReSwapButton(this._dispatcher, this._parentContainer);
		this._battleOverScene = new BattleOverScene(this._dispatcher, this._parentContainer);

		this._decideEnemysSkills = new DecideEnemySkills(this._dispatcher, this._enemy, this._sidePanel.enemySkills);

		this._skillExplainer = new SkillExplainerView(this._dispatcher, this._parentContainer);
		this._gameAlert = new GameAlert(this._dispatcher, this._parentContainer);
		this._battleLogicController = new BattleLogicController(this._dispatcher, this._tableCreator.table.length, this._tableCreator.table[0].length);
	}

	public set enemy(enemy: Enemy)
	{
		this._enemy = enemy;
	}
}
