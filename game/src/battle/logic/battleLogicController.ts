import * as PIXI from "pixi.js";
import { TableEvent } from "../table/event/tableEvent";
import { PatternEvent } from "../panel/event/patternEvent";
import { SkillEvent } from "../../skill/event/skillEvent";
import { AbilityEvent } from "../ability/event/abilityEvent";
import { LogicEvent } from "./event/logicEvent";
import { EndTurnButtonEvent } from "../endTurnButton/event/endTurnButtonEvent";
import { AbilityTypes } from "../../player/ability/abilityTypes";

export class BattleLogicController
{
	private _cascading: boolean;
	private _skillPlaying: boolean;

	constructor(dispatcher: PIXI.Container, tableHeight: number, tableWidth: number)
	{
		this._cascading = true;
		this._skillPlaying = false;

		dispatcher.on(TableEvent.EV_START_CASCADE, () =>
		{
			this._cascading = true;
		});

		dispatcher.on(TableEvent.EV_FINISHED_CASCADE, () =>
		{
			this._cascading = false;
			if(!this._skillPlaying)
			{
				dispatcher.emit(PatternEvent.EV_ALLOW_PATTERN_SELECTION);
			}
		});

		dispatcher.on(SkillEvent.EV_PLAYER_SKILL_STARTED, () =>
		{
			this._skillPlaying = true;
		});

		dispatcher.on(SkillEvent.EV_PLAYER_SKILL_FINISHED, () =>
		{
			this._skillPlaying = false;
			if(!this._cascading)
			{
				dispatcher.emit(PatternEvent.EV_ALLOW_PATTERN_SELECTION);
			}
		});

		dispatcher.on(EndTurnButtonEvent.EV_END_TURN, () =>
		{
			dispatcher.emit(LogicEvent.EV_DISABLE_SWAP);
		});

		dispatcher.on(AbilityEvent.EV_ROTATE_LEFT_SELECTED, () =>
		{
			/*dispatcher.emit(LogicEvent.EV_DISABLE_END_TURN_BUTTON);
			dispatcher.emit(LogicEvent.EV_DISABLE_SWAP);*/
			dispatcher.emit(LogicEvent.EV_ENABLE_SPECIAL_SKILL_SELECTION, AbilityTypes.rotateLeft);
		});

		dispatcher.on(AbilityEvent.EV_ROTATE_LEFT_STOPPED, () =>
		{
			/*dispatcher.emit(LogicEvent.EV_ENABLE_END_TURN_BUTTON);
			dispatcher.emit(LogicEvent.EV_ENABLE_SWAP);*/
			dispatcher.emit(LogicEvent.EV_DISABLE_SPECIAL_SKILL_SELECTION);
		});

		dispatcher.on(AbilityEvent.EV_ROTATE_RIGHT_SELECTED, () =>
		{
			/*dispatcher.emit(LogicEvent.EV_DISABLE_END_TURN_BUTTON);
			dispatcher.emit(LogicEvent.EV_DISABLE_SWAP);*/
			dispatcher.emit(LogicEvent.EV_ENABLE_SPECIAL_SKILL_SELECTION,  AbilityTypes.rotateRight);
		});

		dispatcher.on(AbilityEvent.EV_ROTATE_RIGHT_STOPPED, () =>
		{
			/*dispatcher.emit(LogicEvent.EV_ENABLE_END_TURN_BUTTON);
			dispatcher.emit(LogicEvent.EV_ENABLE_SWAP);*/
			dispatcher.emit(LogicEvent.EV_DISABLE_SPECIAL_SKILL_SELECTION);
		});

		dispatcher.on(AbilityEvent.EV_MIRROR_VERTICALLY_SELECTED, () =>
		{
			/*dispatcher.emit(LogicEvent.EV_DISABLE_END_TURN_BUTTON);
			dispatcher.emit(LogicEvent.EV_DISABLE_SWAP);*/
			dispatcher.emit(LogicEvent.EV_ENABLE_SPECIAL_SKILL_SELECTION,  AbilityTypes.mirrorVertically);
		});

		dispatcher.on(AbilityEvent.EV_MIRROR_VERTICALLY_STOPPED, () =>
		{
			/*dispatcher.emit(LogicEvent.EV_ENABLE_END_TURN_BUTTON);
			dispatcher.emit(LogicEvent.EV_ENABLE_SWAP);*/
			dispatcher.emit(LogicEvent.EV_DISABLE_SPECIAL_SKILL_SELECTION);
		});

		dispatcher.on(AbilityEvent.EV_MIRROR_HORIZONTALLY_SELECTED, () =>
		{
			/*dispatcher.emit(LogicEvent.EV_DISABLE_END_TURN_BUTTON);
			dispatcher.emit(LogicEvent.EV_DISABLE_SWAP);*/
			dispatcher.emit(LogicEvent.EV_ENABLE_SPECIAL_SKILL_SELECTION,  AbilityTypes.mirrorHorizontally);
		});

		dispatcher.on(AbilityEvent.EV_MIRROR_HORIZONTALLY_STOPPED, () =>
		{
			/*dispatcher.emit(LogicEvent.EV_ENABLE_END_TURN_BUTTON);
			dispatcher.emit(LogicEvent.EV_ENABLE_SWAP);*/
			dispatcher.emit(LogicEvent.EV_DISABLE_SPECIAL_SKILL_SELECTION);
		});

		dispatcher.on(PatternEvent.EV_ALLOW_PATTERN_SELECTION, () =>
		{
			dispatcher.emit(LogicEvent.EV_ENABLE_SWAP);
		});

		dispatcher.on(SkillEvent.EV_SKILL_SELECTED_WITH_ABILITY, () =>
		{
			dispatcher.emit(LogicEvent.EV_ENABLE_REDO_ABILITY)
		});

		dispatcher.on(SkillEvent.EV_SKILL_SELECTED, () =>
		{
			dispatcher.emit(LogicEvent.EV_DISABLE_FIELD_SELECTION);
		});

		dispatcher.on(EndTurnButtonEvent.EV_END_TURN, () =>
		{
			dispatcher.emit(LogicEvent.EV_DISABLE_FIELD_SELECTION);
		});

		dispatcher.on(TableEvent.EV_FIELDS_PARALYZED, (paralyzedFields: number, nonParalyzedFields: number) =>
		{
			dispatcher.emit(LogicEvent.EV_COUNT_STUCK_CHANCE, paralyzedFields, nonParalyzedFields);
		});

		dispatcher.on(TableEvent.EV_FIELDS_REMOVED, (paralyzedFields: number, nonParalyzedFields: number) =>
		{
			dispatcher.emit(LogicEvent.EV_COUNT_STUCK_CHANCE, paralyzedFields, nonParalyzedFields);
		});
	}
}
