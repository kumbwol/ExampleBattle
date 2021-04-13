import { EnemySkill } from "../skill/controller/enemySkill";
import * as PIXI from "pixi.js";

export class Enemy
{
	protected _skills: EnemySkill[][];
	protected _portrait: PIXI.Texture;
	protected _shield: number;
	protected _hp: number;
	protected _maxHp: number;
	protected _mp: number;
	protected _maxMp: number;

	constructor()
	{
		this._skills = [];

		for(let i=0; i<6; i++)
		{
			this._skills[i] = [];
		}

		for(let i=5; i>=0; i--)
		{
			if(this._skills[i].length === 0)
			{
				this._skills.splice(i,1);
			}
		}
	}

	get skills(): EnemySkill[][]
	{
		return this._skills;
	}

	get portrait(): PIXI.Texture
	{
		return this._portrait;
	}

	get shield(): number
	{
		return this._shield;
	}

	set shield(shield: number)
	{
		this._shield = shield;
	}

	get hp(): number
	{
		return this._hp;
	}

	set hp(hp: number)
	{
		this._hp = hp;
	}

	get maxHp(): number
	{
		return this._maxHp;
	}

	get mp(): number
	{
		return this._mp;
	}

	set mp(mp: number)
	{
		this._mp = mp;
	}

	get maxMp(): number
	{
		return this._maxMp;
	}
}
