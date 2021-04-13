import * as PIXI from "pixi.js";
import { PlayerSkill } from "../controller/playerSkill";
import { SkillView } from "./skillView";
import { Skill } from "../controller/skill";

export class SkillViewRankPanel extends SkillView
{
	constructor(dispatcher: PIXI.Container, container: PIXI.Container, position: number, skill: PlayerSkill[], rank: number = 0)
	{
		super(dispatcher, container, position, skill, rank);
	}

	protected createSkill(container: PIXI.Container, position: number, skill: Skill)
	{
		const offsetY = 382;
		const borderSize = 2;
		this._skillHolderTexture = PIXI.Texture.from("skillHolderRankPanel");
		this._skillHolderSprite.texture = this._skillHolderTexture;
		this._skillHolder.addChild(this._skillHolderSprite);

		this._skillHolder.y = position * this._skillHolderTexture.height + offsetY - position * borderSize;

		this.createDisabler(borderSize);
		this.createSkillHolder(skill);

		let effectPrimary = this.createEffect(skill, true);
		let effectSecondary = this.createEffect(skill, false);

		this._skillHolder.addChild(effectPrimary);
		this._skillHolder.addChild(effectSecondary);
		container.addChild(this._skillHolder);
		container.addChild(this._disabler);
	}
}
