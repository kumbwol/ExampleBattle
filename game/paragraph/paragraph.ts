import { EffectTypes } from "../src/skill/effect/effectTypes";
import { ChanceTypes } from "../src/enemy/chance/chanceTypes";
import { TalkParagraph } from "../src/talkInteraction/talkParagraph";
import { MultipleChoicesParagraph } from "../src/talkInteraction/multipleChoicesParagraph";

export class Paragraph
{
	public static paragraph;

	constructor()
	{
		Paragraph.paragraph =
		{
			effect:
				{
					titles: [],
					texts: []
				},
			chance:
				{
					titles: [],
					texts: []
				},
			talkNPC:
				{
					tutorial0: []
				},
			playerMultipleChoices:
				{
					quest: []
				},
			quest:
				{
					titles: [],
					descriptions: []
				}
		};

		this.addChanceTitles();
		this.addChanceTexts();
		this.addEffectTitles();
		this.addEffectTexts();
		this.addQuestTitles();
		this.addQuestDescriptions();

		this.addTalkNPC();
		this.addPlayerMultipleChoices();
	}

	private addQuestTitles()
	{
		/*Paragraph.paragraph.quest.titles[QuestIDs.COLLECT_HERB] = "Gyógynövények";
		Paragraph.paragraph.quest.titles[QuestIDs.DEFEND_EGG] = "Tojás őrzés";
		Paragraph.paragraph.quest.titles[QuestIDs.MALNA_SZEDES] = "Málna szedés";
		Paragraph.paragraph.quest.titles[QuestIDs.CURSED_AMULET] = "Az amulett";*/
	}

	private addQuestDescriptions()
	{
		//Paragraph.paragraph.quest.descriptions[QuestIDs.COLLECT_HERB] = "Alma";
		//Paragraph.paragraph.quest.descriptions[QuestIDs.DEFEND_EGG] = "Körte";
		/*Paragraph.paragraph.quest.descriptions[QuestIDs.COLLECT_HERB] = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";
		Paragraph.paragraph.quest.descriptions[QuestIDs.DEFEND_EGG] = "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).";
		Paragraph.paragraph.quest.descriptions[QuestIDs.MALNA_SZEDES] = "A játék során minimum 5x tedd ki a málna alakzatot.";
		Paragraph.paragraph.quest.descriptions[QuestIDs.CURSED_AMULET] = "Az amulett minden érintésnél vörösen kezd izzani, és forróvá válik. Ráadásul néha mintha beszélne hozzád.";*/
	}

	private addTalkNPC()
	{
		Paragraph.paragraph.talkNPC.tutorial0[TalkParagraph.tutorialNPC_0_0] = "Ez az 1. szöveg amit mondani fogok.";
		Paragraph.paragraph.talkNPC.tutorial0[TalkParagraph.tutorialNPC_0_1] = "Ez a 2. ami elhagyja a számat.";
		Paragraph.paragraph.talkNPC.tutorial0[TalkParagraph.tutorialNPC_0_2] = "Ez a 3. és ezzel végeztem is.";
		Paragraph.paragraph.talkNPC.tutorial0[TalkParagraph.quest_cursed_amulet_0_0] = "Egy amulett a földön!";
		Paragraph.paragraph.talkNPC.tutorial0[TalkParagraph.quest_cursed_amulet_take_0_0] = "Az amulett felizzik mikor hozzáérsz...";
		Paragraph.paragraph.talkNPC.tutorial0[TalkParagraph.quest_cursed_amulet_take_0_1] = "Beteszed a zsebedbe, furcsán nehéz súlya van.";
		Paragraph.paragraph.talkNPC.tutorial0[TalkParagraph.quest_cursed_amulet_leave_0_0] = "Az amulett felizzik...";
		Paragraph.paragraph.talkNPC.tutorial0[TalkParagraph.quest_cursed_amulet_leave_0_1] = "Mintha sziszegne valamit, de nem érthető. Inkább tovább állsz.";
	}

	private addPlayerMultipleChoices()
	{
		Paragraph.paragraph.playerMultipleChoices.quest[MultipleChoicesParagraph.quest_cursed_amulet_0_0] = "Felveszed az amulettet.";
		Paragraph.paragraph.playerMultipleChoices.quest[MultipleChoicesParagraph.quest_cursed_amulet_0_1] = "Otthagyod a földön heverni.";
	}

	private addChanceTitles()
	{
		Paragraph.paragraph.chance.titles[ChanceTypes.luck] = "Luck";
		Paragraph.paragraph.chance.titles[ChanceTypes.rage] = "Rage";
		Paragraph.paragraph.chance.titles[ChanceTypes.spell] = "Spell";
	}

	private addChanceTexts()
	{
		Paragraph.paragraph.chance.texts[ChanceTypes.luck] = "Constant luck";
		Paragraph.paragraph.chance.texts[ChanceTypes.rage] = "The less HP enemy has, the more chance to activate";

		/*Paragraph.paragraph.chance.texts[ChanceTypes.luck] = "Konstans szerencse.";
		Paragraph.paragraph.chance.texts[ChanceTypes.rage] = "Hiányzó HP alapján nő az esély.";
		Paragraph.paragraph.chance.texts[ChanceTypes.spell] = "A másodlagos képesség manna költségétől függően teljesülhet, vagy sem.";*/
	}

	private addEffectTitles()
	{
		Paragraph.paragraph.effect.titles[EffectTypes.damage] = "Damage";
		Paragraph.paragraph.effect.titles[EffectTypes.jokerform] = "Jokerform";
		Paragraph.paragraph.effect.titles[EffectTypes.penetrate] = "Penetrating damage";
		Paragraph.paragraph.effect.titles[EffectTypes.bloodOath] = "Blood oath";
		Paragraph.paragraph.effect.titles[EffectTypes.sacrifice] = "Sacrifice";
		Paragraph.paragraph.effect.titles[EffectTypes.shield] = "Shield";
		Paragraph.paragraph.effect.titles[EffectTypes.manaRegen] = "Mana regeneration";
		Paragraph.paragraph.effect.titles[EffectTypes.heal] = "Heal";
		Paragraph.paragraph.effect.titles[EffectTypes.manaDrain] = "Mana drain";
		Paragraph.paragraph.effect.titles[EffectTypes.manaCost] = "Mana cost";
		Paragraph.paragraph.effect.titles[EffectTypes.noEffect] = "Nothing";
	}

	private addEffectTexts()
	{
		Paragraph.paragraph.effect.texts[EffectTypes.damage] = "X damage to the enemy.";
		Paragraph.paragraph.effect.texts[EffectTypes.heal] = "Heals X health point for its user.";
		Paragraph.paragraph.effect.texts[EffectTypes.shield] = "Gives X shield.";
		/*Paragraph.paragraph.effect.texts[EffectTypes.damage] = "X sebzést okoz az ellenfélnek.";
		Paragraph.paragraph.effect.texts[EffectTypes.jokerform] = "A mezők X% eséllyel JOKER-é alakulnak.";
		Paragraph.paragraph.effect.texts[EffectTypes.penetrate] = "Elvesz X életpontot az ellenféltől, az armorét figyelmen kívűl hagyva.";
		Paragraph.paragraph.effect.texts[EffectTypes.bloodOath] = "Elvesz X életpontot a használójától, az armorát figyelmen kívűl hagyva.";
		Paragraph.paragraph.effect.texts[EffectTypes.sacrifice] = "X sebzést okoz a használójának.";
		Paragraph.paragraph.effect.texts[EffectTypes.shield] = "Ad X védelmet a felhasználójának, a felhasználó új köre kezdetén megfeleződik.";
		Paragraph.paragraph.effect.texts[EffectTypes.manaRegen] = "Visszatölt X manapontot a használójának.";
		Paragraph.paragraph.effect.texts[EffectTypes.heal] = "Visszatölt X életpontot a használójának.";
		Paragraph.paragraph.effect.texts[EffectTypes.manaDrain] = "Elvesz X manapontot az ellenféltől.";
		Paragraph.paragraph.effect.texts[EffectTypes.manaCost] = "Elvesz X manapontot a használójától.";
		Paragraph.paragraph.effect.texts[EffectTypes.noEffect] = "Nincs itt semmi látnivaló, csak érdekelt mi lesz, ha egy hosszú szöveget írok ide be. Remélem megérted!";*/
	}
}
