import * as PIXI from "pixi.js";
import { Player } from "../../player/player";
import { Ability } from "../../player/ability/ability";
import { AbilityTypes } from "../../player/ability/abilityTypes";
import { Button } from "../../button/button";
import { AbilityEvent } from "./event/abilityEvent";
import { BarEvent } from "../panel/Bars/event/barEvent";
import { FieldEvent } from "../field/event/fieldEvent";
import { EffectEvent } from "../../skill/effect/event/effectEvent";
import { SkillEvent } from "../../skill/event/skillEvent";
import { BooleanClass } from "../../booleanClass";
import { Easing, Tweener } from "pixi-tweener";
import { PatternEvent } from "../panel/event/patternEvent";
import { RankButtonEvent } from "../../skill/rank/event/rankButtonEvent";
import { RankPanelEvent } from "../panel/event/rankPanelEvent";

export class AbilityView
{
	private readonly _abilityButtons: Button[][];
	private readonly _dispatcher: PIXI.Container;
	private _activeAbilityID: number;
	private _abilities: Ability[];
	private readonly _selectedAbility: Ability;
	private _abilityCost: number;
	private _mp: number;
	private _abilityDisabler: PIXI.Graphics;
	private readonly _disabledEvents: boolean[][];

	constructor(dispatcher: PIXI.Container, parentContainer: PIXI.Container, player: Player)
	{
		this._disabledEvents = [];

		for(let i=0; i<player.abilities.length; i++)
		{
			this._disabledEvents[i] = [];
		}

		this._dispatcher = dispatcher;
		this._abilityButtons = [];
		this.removeActiveAbility();
		this._abilities = player.abilities;
		this._selectedAbility = new Ability(AbilityTypes.noAbility, 0);

		let abilityContainer: PIXI.Container = this.createAbilities(player.abilities);
		parentContainer.addChild(abilityContainer);

		this.createAbilityDisabler(parentContainer, abilityContainer);

		this.updateAbilityActivision(true, player.mp);

		dispatcher.on(AbilityEvent.EV_ABILITY_SELECTED, (id: number) =>
		{
			this.selectAbility(id);
		});

		dispatcher.on(BarEvent.EV_UPDATE_MP_BAR, (newMp: number, isPlayer: boolean) =>
		{
			this.updateAbilityActivision(isPlayer, newMp);
		});

		dispatcher.on(FieldEvent.EV_DIAGONAL_SWAP, (isReswap: boolean) =>
		{
			if(isReswap)
			{
				player.mp += this._abilityCost;
				dispatcher.emit(EffectEvent.EV_GAIN_MANA, this._abilityCost, true);
				dispatcher.emit(BarEvent.EV_UPDATE_MP_BAR, player.mp, true, true, false);
			}
			else
			{
				player.mp -= this._selectedAbility.manaCost;
				dispatcher.emit(EffectEvent.EV_LOSE_MANA, this._selectedAbility.manaCost, true);
				dispatcher.emit(BarEvent.EV_UPDATE_MP_BAR, player.mp, true, true, false);
				this._abilityCost = this._selectedAbility.manaCost;
			}
		});

		dispatcher.on(SkillEvent.EV_SKILL_SELECTED_WITH_ABILITY, () =>
		{
			player.mp -= this._selectedAbility.manaCost;
			dispatcher.emit(EffectEvent.EV_LOSE_MANA, this._selectedAbility.manaCost, true);
			dispatcher.emit(BarEvent.EV_UPDATE_MP_BAR, player.mp, true, true, false);
			this._abilityCost = this._selectedAbility.manaCost;
		});

		dispatcher.on(FieldEvent.EV_FIELD_RESWAP, (redoAbility: BooleanClass) =>
		{
			if(redoAbility.boolean)
			{
				player.mp += this._abilityCost;
				dispatcher.emit(EffectEvent.EV_GAIN_MANA, this._abilityCost, true);
				dispatcher.emit(BarEvent.EV_UPDATE_MP_BAR, player.mp, true, true, false);
			}
		});

		dispatcher.on(RankButtonEvent.EV_RANK_BUTTON_CLICK, () =>
		{
			this.disableAnim(this._abilityDisabler);
			this._abilityDisabler.interactive = true;
		});

		dispatcher.on(RankPanelEvent.EV_EXIT_RANK_PANEL, () =>
		{
			this.enableAnim(this._abilityDisabler);
			this._abilityDisabler.interactive = false;
		});

		dispatcher.on(SkillEvent.EV_SKILL_SELECTED, () =>
		{
			this.disableButtonEvents();
		});

		dispatcher.on(PatternEvent.EV_PATTERN_DELETE, () =>
		{
			this.enableButtonEvents();
		});
	}

	private updateAbilityActivision(isPlayer: boolean, newMp: number)
	{
		if(isPlayer)
		{
			this._mp = newMp;
			for(let i=0; i<this._abilityButtons.length; i++)
			{
				if(this._abilities[i].abilityType !== AbilityTypes.noAbility)
				{
					if(newMp < this._abilities[i].manaCost)
					{
						this.disablingAbility(i);

						if(i === this._activeAbilityID)
						{
							this.stopSelectedAbility();
							this.removeActiveAbility();
						}
					}
					else
					{
						if(i === this._activeAbilityID)
						{
							this.selectingAbility(i);
						}
						else
						{
							this.notSelectingAbility(i);
						}
					}
				}
			}
		}
	}

	private disableButtonEvents()
	{
		for(let i=0; i<this._abilityButtons.length; i++)
		{
			for(let j=0; j<this._abilityButtons[i].length; j++)
			{
				this._disabledEvents[i][j] = false;
				if(this._abilityButtons[i][j].isActive)
				{
					this._disabledEvents[i][j] = true;
					this._abilityButtons[i][j].isActive = false;
				}
			}
		}
	}

	private enableButtonEvents()
	{
		for(let i=0; i<this._abilityButtons.length; i++)
		{
			for(let j=0; j<this._abilityButtons[i].length; j++)
			{
				if(this._disabledEvents[i][j])
				{
					this._abilityButtons[i][j].isActive = true;
				}
				this._disabledEvents[i][j] = false;
			}
		}
	}

	private enableAnim(element)
	{
		Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 0
			}
		)
	}

	private disableAnim(element)
	{
		Tweener.add
		(
			{
				target: element,
				duration: 0.5, ease: Easing.easeInOutCubic
			},
			{
				alpha: 0.6
			}
		)
	}

	private createAbilityDisabler(parentContainer: PIXI.Container, abilityContainer: PIXI.Container)
	{
		this._abilityDisabler = new PIXI.Graphics;
		parentContainer.addChild(this._abilityDisabler);
		this._abilityDisabler.beginFill(0x626262);
		this._abilityDisabler.drawRect(395, 818, abilityContainer.width + 381, abilityContainer.height + 10);
		this._abilityDisabler.interactive = false;
		this._abilityDisabler.alpha = 0;
	}

	private createAbilities(abilities: Ability[]): PIXI.Container
	{
		const abilitiesContainer = new PIXI.Container;
		const abilityNoAbilityTexture = PIXI.Texture.from("ability/noAbility/noAbility.png");
		const abilityDiagonalSwapNotSelectedDisabledTexture = PIXI.Texture.from("ability/diagonalSwap/notSelected/diagonalSwapDisabled.png");
		const abilityDiagonalSwapNotSelectedNormalTexture = PIXI.Texture.from("ability/diagonalSwap/notSelected/diagonalSwapNormal.png");
		const abilityDiagonalSwapNotSelectedHoverTexture = PIXI.Texture.from("ability/diagonalSwap/notSelected/diagonalSwapHover.png");
		const abilityDiagonalSwapNotSelectedPressedTexture = PIXI.Texture.from("ability/diagonalSwap/notSelected/diagonalSwapPressed.png");
		const abilityDiagonalSwapSelectedNormalTexture = PIXI.Texture.from("ability/diagonalSwap/selected/diagonalSwapNormal.png");
		const abilityDiagonalSwapSelectedHoverTexture = PIXI.Texture.from("ability/diagonalSwap/selected/diagonalSwapHover.png");
		const abilityDiagonalSwapSelectedPressedTexture = PIXI.Texture.from("ability/diagonalSwap/selected/diagonalSwapPressed.png");

		const abilityKnightSwapNotSelectedDisabledTexture = PIXI.Texture.from("ability/knightSwap/notSelected/knightSwapDisabled.png");
		const abilityKnightSwapNotSelectedNormalTexture = PIXI.Texture.from("ability/knightSwap/notSelected/knightSwapNormal.png");
		const abilityKnightSwapNotSelectedHoverTexture = PIXI.Texture.from("ability/knightSwap/notSelected/knightSwapHover.png");
		const abilityKnightSwapNotSelectedPressedTexture = PIXI.Texture.from("ability/knightSwap/notSelected/knightSwapPressed.png");
		const abilityKnightSwapSelectedNormalTexture = PIXI.Texture.from("ability/knightSwap/selected/knightSwapNormal.png");
		const abilityKnightSwapSelectedHoverTexture = PIXI.Texture.from("ability/knightSwap/selected/knightSwapHover.png");
		const abilityKnightSwapSelectedPressedTexture = PIXI.Texture.from("ability/knightSwap/selected/knightSwapPressed.png");

		const abilityRotateLeftNotSelectedDisabledTexture = PIXI.Texture.from("ability/rotateLeft/notSelected/rotateLeftDisabled.png");
		const abilityRotateLeftNotSelectedNormalTexture = PIXI.Texture.from("ability/rotateLeft/notSelected/rotateLeftNormal.png");
		const abilityRotateLeftNotSelectedHoverTexture = PIXI.Texture.from("ability/rotateLeft/notSelected/rotateLeftHover.png");
		const abilityRotateLeftNotSelectedPressedTexture = PIXI.Texture.from("ability/rotateLeft/notSelected/rotateLeftPressed.png");
		const abilityRotateLeftSelectedNormalTexture = PIXI.Texture.from("ability/rotateLeft/selected/rotateLeftNormal.png");
		const abilityRotateLeftSelectedHoverTexture = PIXI.Texture.from("ability/rotateLeft/selected/rotateLeftHover.png");
		const abilityRotateLeftSelectedPressedTexture = PIXI.Texture.from("ability/rotateLeft/selected/rotateLeftPressed.png");

		const abilityRotateRightNotSelectedDisabledTexture = PIXI.Texture.from("ability/rotateRight/notSelected/rotateRightDisabled.png");
		const abilityRotateRightNotSelectedNormalTexture = PIXI.Texture.from("ability/rotateRight/notSelected/rotateRightNormal.png");
		const abilityRotateRightNotSelectedHoverTexture = PIXI.Texture.from("ability/rotateRight/notSelected/rotateRightHover.png");
		const abilityRotateRightNotSelectedPressedTexture = PIXI.Texture.from("ability/rotateRight/notSelected/rotateRightPressed.png");
		const abilityRotateRightSelectedNormalTexture = PIXI.Texture.from("ability/rotateRight/selected/rotateRightNormal.png");
		const abilityRotateRightSelectedHoverTexture = PIXI.Texture.from("ability/rotateRight/selected/rotateRightHover.png");
		const abilityRotateRightSelectedPressedTexture = PIXI.Texture.from("ability/rotateRight/selected/rotateRightPressed.png");

		const abilityMirrorVerticallyNotSelectedDisabledTexture = PIXI.Texture.from("ability/mirrorVertically/notSelected/mirrorVerticallyDisabled.png");
		const abilityMirrorVerticallyNotSelectedNormalTexture = PIXI.Texture.from("ability/mirrorVertically/notSelected/mirrorVerticallyNormal.png");
		const abilityMirrorVerticallyNotSelectedHoverTexture = PIXI.Texture.from("ability/mirrorVertically/notSelected/mirrorVerticallyHover.png");
		const abilityMirrorVerticallyNotSelectedPressedTexture = PIXI.Texture.from("ability/mirrorVertically/notSelected/mirrorVerticallyPressed.png");
		const abilityMirrorVerticallySelectedNormalTexture = PIXI.Texture.from("ability/mirrorVertically/selected/mirrorVerticallyNormal.png");
		const abilityMirrorVerticallySelectedHoverTexture = PIXI.Texture.from("ability/mirrorVertically/selected/mirrorVerticallyHover.png");
		const abilityMirrorVerticallySelectedPressedTexture = PIXI.Texture.from("ability/mirrorVertically/selected/mirrorVerticallyPressed.png");

		const abilityMirrorHorizontallyNotSelectedDisabledTexture = PIXI.Texture.from("ability/mirrorHorizontally/notSelected/mirrorHorizontallyDisabled.png");
		const abilityMirrorHorizontallyNotSelectedNormalTexture = PIXI.Texture.from("ability/mirrorHorizontally/notSelected/mirrorHorizontallyNormal.png");
		const abilityMirrorHorizontallyNotSelectedHoverTexture = PIXI.Texture.from("ability/mirrorHorizontally/notSelected/mirrorHorizontallyHover.png");
		const abilityMirrorHorizontallyNotSelectedPressedTexture = PIXI.Texture.from("ability/mirrorHorizontally/notSelected/mirrorHorizontallyPressed.png");
		const abilityMirrorHorizontallySelectedNormalTexture = PIXI.Texture.from("ability/mirrorHorizontally/selected/mirrorHorizontallyNormal.png");
		const abilityMirrorHorizontallySelectedHoverTexture = PIXI.Texture.from("ability/mirrorHorizontally/selected/mirrorHorizontallyHover.png");
		const abilityMirrorHorizontallySelectedPressedTexture = PIXI.Texture.from("ability/mirrorHorizontally/selected/mirrorHorizontallyPressed.png");

		for(let i=0; i<abilities.length; i++)
		{
			this._abilityButtons[i] = [];
			switch(abilities[i].abilityType)
			{
				case AbilityTypes.noAbility:
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityNoAbilityTexture, abilityNoAbilityTexture, abilityNoAbilityTexture, null, null));
					break;

				case AbilityTypes.diagonalSwap:
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityDiagonalSwapNotSelectedNormalTexture, abilityDiagonalSwapNotSelectedHoverTexture, abilityDiagonalSwapNotSelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityDiagonalSwapSelectedNormalTexture, abilityDiagonalSwapSelectedHoverTexture, abilityDiagonalSwapSelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityDiagonalSwapNotSelectedDisabledTexture, abilityDiagonalSwapNotSelectedDisabledTexture, abilityDiagonalSwapNotSelectedDisabledTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					break;

				case AbilityTypes.knightSwap:
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityKnightSwapNotSelectedNormalTexture, abilityKnightSwapNotSelectedHoverTexture, abilityKnightSwapNotSelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityKnightSwapSelectedNormalTexture, abilityKnightSwapSelectedHoverTexture, abilityKnightSwapSelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityKnightSwapNotSelectedDisabledTexture, abilityKnightSwapNotSelectedDisabledTexture, abilityKnightSwapNotSelectedDisabledTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					break;

				case AbilityTypes.rotateLeft:
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityRotateLeftNotSelectedNormalTexture, abilityRotateLeftNotSelectedHoverTexture, abilityRotateLeftNotSelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityRotateLeftSelectedNormalTexture, abilityRotateLeftSelectedHoverTexture, abilityRotateLeftSelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityRotateLeftNotSelectedDisabledTexture, abilityRotateLeftNotSelectedDisabledTexture, abilityRotateLeftNotSelectedDisabledTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					break;

				case AbilityTypes.rotateRight:
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityRotateRightNotSelectedNormalTexture, abilityRotateRightNotSelectedHoverTexture, abilityRotateRightNotSelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityRotateRightSelectedNormalTexture, abilityRotateRightSelectedHoverTexture, abilityRotateRightSelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityRotateRightNotSelectedDisabledTexture, abilityRotateRightNotSelectedDisabledTexture, abilityRotateRightNotSelectedDisabledTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					break;

				case AbilityTypes.mirrorVertically:
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityMirrorVerticallyNotSelectedNormalTexture, abilityMirrorVerticallyNotSelectedHoverTexture, abilityMirrorVerticallyNotSelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityMirrorVerticallySelectedNormalTexture, abilityMirrorVerticallySelectedHoverTexture, abilityMirrorVerticallySelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityMirrorVerticallyNotSelectedDisabledTexture, abilityMirrorVerticallyNotSelectedDisabledTexture, abilityMirrorVerticallyNotSelectedDisabledTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					break;

				case AbilityTypes.mirrorHorizontally:
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityMirrorHorizontallyNotSelectedNormalTexture, abilityMirrorHorizontallyNotSelectedHoverTexture, abilityMirrorHorizontallyNotSelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityMirrorHorizontallySelectedNormalTexture, abilityMirrorHorizontallySelectedHoverTexture, abilityMirrorHorizontallySelectedPressedTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					this._abilityButtons[i].push(new Button(this._dispatcher, abilityMirrorHorizontallyNotSelectedDisabledTexture, abilityMirrorHorizontallyNotSelectedDisabledTexture, abilityMirrorHorizontallyNotSelectedDisabledTexture, new AbilityEvent(AbilityEvent.EV_ABILITY_SELECTED, i), null));
					break;
			}

			for(let j=0; j<this._abilityButtons[i].length; j++)
			{
				this._abilityButtons[i][j].button.y = 0;
				this._abilityButtons[i][j].button.x = i * (this._abilityButtons[i][j].button.width - 1);

				if(j>0)
				{
					this._abilityButtons[i][j].button.alpha = 0;
					this._abilityButtons[i][j].isActive = false;
				}
			}
		}

		for(let i=0; i<this._abilityButtons.length; i++)
		{
			abilitiesContainer.addChild(this._abilityButtons[i][0].button);
		}

		for(let i=0; i<this._abilityButtons.length; i++)
		{
			if(this._abilityButtons[i].length > 1)
			{
				abilitiesContainer.addChild(this._abilityButtons[i][1].button);
				abilitiesContainer.addChild(this._abilityButtons[i][2].button);
			}
		}

		const offsetX = 540;
		const offsetY = 823;

		abilitiesContainer.x = offsetX;
		abilitiesContainer.y = offsetY;

		return abilitiesContainer;
	}

	private selectAbility(id: number)
	{
		for(let i=0; i<this._abilityButtons.length; i++)
		{
			if(this._abilities[i].abilityType !== AbilityTypes.noAbility)
			{
				this.notSelectingAbility(i);
				if(this._mp < this._abilities[i].manaCost)
				{
					this.disablingAbility(i);

					if(i === id)
					{
						this.stopSelectedAbility();
						this.removeActiveAbility();
					}
				}
				else
				{
					if(id === this._activeAbilityID)
					{
						this.notSelectingAbility(i);
					}
				}
			}
		}

		if(id !== this._activeAbilityID)
		{
			if(this._selectedAbility !== null)
			{
				this.stopSelectedAbility();
			}

			this._selectedAbility.abilityType = this._abilities[id].abilityType;
			this._selectedAbility.manaCost = this._abilities[id].manaCost;

			this._activeAbilityID = id;

			this._abilityButtons[id][0].button.alpha = 0;
			this._abilityButtons[id][0].isActive = false;

			this._abilityButtons[id][1].button.alpha = 1;
			this._abilityButtons[id][1].isActive = true;

			switch(this._selectedAbility.abilityType)
			{
				case AbilityTypes.diagonalSwap:
					this._dispatcher.emit(AbilityEvent.EV_DIAGONAL_SWAP_SELECTED);
					break;

				case AbilityTypes.knightSwap:
					this._dispatcher.emit(AbilityEvent.EV_KNIGHT_SWAP_SELECTED);
					break;

				case AbilityTypes.rotateLeft:
					this._dispatcher.emit(AbilityEvent.EV_ROTATE_LEFT_SELECTED);
					break;

				case AbilityTypes.rotateRight:
					this._dispatcher.emit(AbilityEvent.EV_ROTATE_RIGHT_SELECTED);
					break;

				case AbilityTypes.mirrorVertically:
					this._dispatcher.emit(AbilityEvent.EV_MIRROR_VERTICALLY_SELECTED);
					break;

				case AbilityTypes.mirrorHorizontally:
					this._dispatcher.emit(AbilityEvent.EV_MIRROR_HORIZONTALLY_SELECTED);
					break;
			}
		}
		else
		{
			this.stopSelectedAbility();
			this.removeActiveAbility();
		}
	}

	private disablingAbility(id: number)
	{
		this._abilityButtons[id][0].button.alpha = 0;
		this._abilityButtons[id][0].isActive = false;

		this._abilityButtons[id][1].button.alpha = 0;
		this._abilityButtons[id][1].isActive = false;

		this._abilityButtons[id][2].button.alpha = 1;
		this._abilityButtons[id][2].isActive = false;
	}

	private selectingAbility(id: number)
	{
		this._abilityButtons[id][0].button.alpha = 0;
		this._abilityButtons[id][0].isActive = false;

		this._abilityButtons[id][1].button.alpha = 1;
		this._abilityButtons[id][1].isActive = true;

		this._abilityButtons[id][2].button.alpha = 0;
		this._abilityButtons[id][2].isActive = false;
	}

	private notSelectingAbility(id: number)
	{
		this._abilityButtons[id][0].button.alpha = 1;
		this._abilityButtons[id][0].isActive = true;

		this._abilityButtons[id][1].button.alpha = 0;
		this._abilityButtons[id][1].isActive = false;

		this._abilityButtons[id][2].button.alpha = 0;
		this._abilityButtons[id][2].isActive = false;
	}

	private removeActiveAbility()
	{
		this._activeAbilityID = -1;
	}

	private stopSelectedAbility()
	{
		switch(this._selectedAbility.abilityType)
		{
			case AbilityTypes.diagonalSwap:
				this._dispatcher.emit(AbilityEvent.EV_DIAGONAL_SWAP_STOPPED);
				break;

			case AbilityTypes.knightSwap:
				this._dispatcher.emit(AbilityEvent.EV_KNIGHT_SWAP_STOPPED);
				break;

			case AbilityTypes.rotateLeft:
				this._dispatcher.emit(AbilityEvent.EV_ROTATE_LEFT_STOPPED);
				break;

			case AbilityTypes.rotateRight:
				this._dispatcher.emit(AbilityEvent.EV_ROTATE_RIGHT_STOPPED);
				break;

			case AbilityTypes.mirrorVertically:
				this._dispatcher.emit(AbilityEvent.EV_MIRROR_VERTICALLY_STOPPED);
				break;

			case AbilityTypes.mirrorHorizontally:
				this._dispatcher.emit(AbilityEvent.EV_MIRROR_HORIZONTALLY_STOPPED);
				break;
		}
	}
}
