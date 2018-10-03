﻿class Character
{
	constructor(settings)
	{
		this.Settings = settings;

		this.Exists = true;
        this.Name = "N/A";
        this.Icon = chrome.extension.getURL("images/icon48.png");
	}

    static Initialize(settings)
    {
		let url = window.location.href.toLowerCase();

		if(settings.DndBeyond_CharactersEnabled === true)
		{
			if (url.includes("/profile/") && url.includes("/characters/") && !url.includes("/builder/")) {
				var char = new Character(settings);

				char.loadCharacterData();

				return char;
			}
		}

		return { Exists: false };
	}
	
	loadCharacterData()
	{
		var character = this;
		
		$(".ct-character-tidbits").waitUntilExists(function () {
			character.Icon = $('.ct-character-tidbits__avatar').css('background-image').replace('url(', '').replace(')', '').replace(/\"/gi, "");
			character.Nname = $('.ct-character-tidbits__name').text();
		});
	
		//Short Rest Hit Point Dice; On checkbox click
		$(".ct-reset-pane__hitdie").waitUntilExists(function () {
			var hitDie = $(this);
	
			var hitPointDice = hitDie.text().split('(')[1].replace("Hit Die: ", "").split(' ')[0];
	
			hitDie.find(".ct-slot-manager__slot").click(function () {
				var mainAction = {
					Title: "Hit Dice",
					MainRoll: {
						Dice: 0,
						LinkedRolls: [],
						DiceFound: false
					}
				};
	
				character.createLinkedRolls(hitPointDice, "Healing", mainAction);
	
				ExecuteActions([mainAction]);
			});
	
			//character.loadInDie(init.find('.ct-signed-number__sign'));
		});
	
		//Initiative; On box click
		$(".ct-initiative-box__value").waitUntilExists(function () {
			var init = $(this);
	
			character.MakeElementClickable(init);
	
			init.click(function () {
				ExecuteActions([{
					Title: "Initiative",
					MainRoll: {
						Description: "",
						Dice: 1,
						Sides: 20,
						Modifier: Number(init.text().replace("+", "")),
						LinkedRolls: []
					}
				}]);
			});
		});
	
		//Abilities; On number box click
		$(".ct-ability-summary").waitUntilExists(function () {
			var element = $(this);
	
			var ability = element.find('.ct-ability-summary__primary');
			character.MakeElementClickable(ability);
	
			ability.click(function () {
				ExecuteActions([{
					Title: element.find('.ct-ability-summary__label').text() + " Check",
					MainRoll: {
						Description: "",
						Dice: 1,
						Sides: 20,
						Modifier: Number(ability.find('.ct-signed-number').text()),
						LinkedRolls: []
					}
				}]);
			});
		});
	
		//Saving Throws; On number box click
		$(".ct-saving-throws-summary__ability").waitUntilExists(function () {
			var element = $(this);
	
			var name = element.find('.ct-saving-throws-summary__ability-name');
			var save = element.find('.ct-signed-number');
	
			character.MakeElementClickable(save);
	
			save.click(function () {
				ExecuteActions([{
					Title: name.text().toUpperCase() + " Saving Throw",
					MainRoll: {
						Description: "",
						Dice: 1,
						Sides: 20,
						Modifier: Number(save.text()),
						LinkedRolls: []
					}
				}]);
			});
		});
	
		//Skills; On number box click
		$(".ct-skills__item").waitUntilExists(function () {
			var element = $(this);
	
			var name = element.find('.ct-skills__col--skill');
			var skillMod = element.find('.ct-signed-number');
	
			//Override homebrew honor sanity values
			if (name.text() === "Honor" || name.text() === "Sanity") {
				var stat = element.find('.ct-skills__col--stat');
				var operation = element.find('.ct-signed-number__sign');
				var mod = element.find('.ct-signed-number__number');
	
				var modNumber = parseInt(mod.text());
				var calculatedMod = Math.floor((modNumber - 10) / 2);
	
				if (modNumber < 10) {
					operation.html("-");
					calculatedMod = calculatedMod * -1;
				}
	
				mod.html(calculatedMod);
	
				if (name.text() === "Honor") {
					stat.html("HNR");
				}
				else {
					stat.html("SAN");
				}
			}
	
			character.MakeElementClickable(skillMod);
	
			skillMod.click(function () {
				ExecuteActions([{
					Title: name.text(),
					MainRoll: {
						Description: "",
						Dice: 1,
						Sides: 20,
						Modifier: Number(skillMod.text()),
						LinkedRolls: []
					}
				}]);
			});
		});
	
		//Spells Tab
		$(".ct-spells-spell").waitUntilExists(function () {
			var mainAction = {};
	
			var element = $(this);
			var name = element.find('.ct-spell-name');
			var canTripAtWill = element.find('.ct-spells-spell__at-will');
	
			//Add cast to cantrip
			canTripAtWill.empty();
			canTripAtWill.append('<div class="ct-spells-spell__action"><button class="ct-theme-button ct-theme-button--filled ct-button character-button character-button-block-small"><span class="ct-button__content">Cast</span></button></div>');
	
			var toHit = element.find('.ct-spells-spell__tohit');
			if (toHit.length) {
				mainAction = {
					Title: name.text(),
					MainRoll: {
						Description: "To Hit",
						Dice: 1,
						Sides: 20,
						Modifier: Number(toHit.text()),
						LinkedRolls: []
					}
				}
			} else {
				mainAction = {
					Title: name.text(),
					MainRoll: {
						Dice: 0,
						LinkedRolls: [],
						DiceFound: false
					}
				}
	
				var toSave = element.find('.ct-spells-spell__save');
				if (toSave.length) {
					mainAction.MainRoll.LinkedRolls.push({
						DiceFound: false,
						SavingThrow: toSave.find('.ct-spells-spell__save-label').text().toUpperCase() + ' ' + toSave.find('.ct-spells-spell__save-value').text()
					});
				}
			}
	
			var damageElement = element.find('.ct-spells-spell__damage');
			if (damageElement.length) {
				var damageValueElement = damageElement.find('.ct-damage__value');
				if (damageValueElement.length) {
					var damageText = damageValueElement.text();
					var toolTip = damageElement.find('.ct-tooltip');
					var damageType = toolTip.attr('data-original-title');
	
					character.createLinkedRolls(damageText, damageType, mainAction);
				}
	
				var healingValueElement = damageElement.find('.ct-spell-damage-effect__healing');
				if (healingValueElement.length) {
					var healingText = healingValueElement.text();
					var healingToolTip = damageElement.find('.ct-tooltip');
					var healingType = healingToolTip.attr('data-original-title');
	
					character.createLinkedRolls(healingText, healingType, mainAction);
				}
			}
	
			//On cast button, only if spell slots exist
			var castButton = element.find('.ct-theme-button');
			castButton.click(function () {
				var button = $(this);
	
				if (!button.hasClass('character-button--disabled')) {
					ExecuteActions([mainAction]);
				}
			});
		});
	
		//Spells Panel //NOT YET READY
		//$(".ct-spell-pane").waitUntilExists(function () {
		//	var mainAction = {};
	
		//	var element = $(this);
		//	var name = element.find('.ct-spell-name');
		//	var canTripAtWill = element.find('.ct-spell-caster__casting-actions');
	
		//	//Add cast to cantrip
		//	canTripAtWill.empty();
		//	canTripAtWill.append('<div class="ct-spell-caster__casting-action"><button class="ct-theme-button ct-theme-button--filled ct-button character-button character-button"><span class="ct-button__content">Spell Slot<span class="ct-spell-caster__casting-action-count ct-spell-caster__casting-action-count--spellcasting">4</span></span></button></div>');
	
		//	//To hit does not exist, we must find it
		//	var toHit = element.find('.ct-spells-spell__tohit');
		//	if (toHit.length) {
		//		mainAction = {
		//			Title: name.text(),
		//			MainRoll: {
		//				Description: "To Hit",
		//				Dice: 1,
		//				Sides: 20,
		//				Modifier: Number(toHit.text()),
		//				LinkedRolls: []
		//			}
		//		}
		//	} else {
		//		mainAction = {
		//			Title: name.text(),
		//			MainRoll: {
		//				Dice: 0,
		//				LinkedRolls: [],
		//				DiceFound: false
		//			}
		//		}
	
		//		//Go through labels to see if there is a save
		//		var propertyRows = element.find('.ct-property-list__property');
		//		if (propertyRows.length) {
		//			propertyRows.each(function () {
		//				var propertyRow = $(this);
		//				if (propertyRow.find('.ct-property-list__property-label').text() === 'Attack/Save:') {
		//					mainAction.MainRoll.LinkedRolls.push({
		//						DiceFound: false,
		//						SavingThrow: propertyRow.find('.ct-property-list__property-content').text().toUpperCase()
		//					});
		//				}
		//			});
		//		}
		//	}
	
		//	//On cast button, only if spell slots exist
		//	var castButton = element.find('.ct-theme-button');
		//	castButton.click(function () {
		//		var button = $(this);
	
		//		if (!button.hasClass('character-button--disabled') &&
		//			!button.hasClass('ct-button--increase') &&
		//			!button.hasClass('ct-button--decrease')) {
	
		//			var newMainAction = jQuery.extend(true, {}, mainAction);
	
		//			var damageElement = element.find('.ct-spell-caster__modifier');
		//			if (damageElement.length) {
		//				var damageValueElement = damageElement.find('.ct-spell-caster__modifier-amount');
		//				if (damageValueElement.length) {
		//					var damageText = damageValueElement.text();
	
		//					//For healing
		//					damageText.replace("Regain ", "");
		//					damageText.replace(" Hit Points", "");
	
		//					var toolTip = damageElement.find('.ct-tooltip');
		//					var damageType = toolTip.attr('data-original-title');
	
		//					character.createLinkedRolls(damageText, damageType, newMainAction);
		//				}
		//			}
	
		//			ExecuteActions([mainAction]);
		//		}
		//	});
		//});
	
		//Combat Tab, all rows
		$(".ct-combat-attack").waitUntilExists(function () {
			var mainAction = {};
	
			var element = $(this);
			var name = element.find('.ct-combat-attack__label');
			var toHit = element.find('.ct-combat-attack__tohit');
	
			//To Hit Exists
			if (toHit.length) {
				var toHitMod = toHit.find('.ct-signed-number');
				mainAction = {
					Title: name.text(),
					MainRoll: {
						Description: "To Hit",
						Dice: 1,
						Sides: 20,
						Modifier: Number(toHitMod.text()),
						LinkedRolls: []
					}
				}
			} else {
				mainAction = {
					Title: name.text(),
					MainRoll: {
						Dice: 0,
						LinkedRolls: [],
						DiceFound: false
					}
				}
	
				var toSave = element.find('.ct-combat-attack__save');
				if (toSave.length) {
					mainAction.MainRoll.LinkedRolls.push({
						DiceFound: false,
						SavingThrow: toSave.find('.ct-combat-attack__save-label').text().toUpperCase() + ' ' + toSave.find('.ct-combat-attack__save-value').text()
					});
				}
			}
	
			var damageRows = element.find('.ct-damage__value');
			if (damageRows.length) {
				damageRows.each(function () {
					var damageValueElement = $(this);
					var damageText = damageValueElement.text();
					var toolTip = element.find('.ct-tooltip');
					var damageType = toolTip.attr('data-original-title');
	
					var newMainAction = jQuery.extend(true, {}, mainAction);
					character.createLinkedRolls(damageText, damageType, newMainAction);
	
					character.MakeElementClickable(damageValueElement);
	
					damageValueElement.click(function () {
						ExecuteActions([newMainAction]);
					});
				});
			}
		});
	}
	
	MakeElementClickable(element) {
		element.css('cursor', "pointer");
		element.css('color', "DarkRed");
		element.css('font-weight', "bold");
		element.attr('title', "Click to roll");
	}
	
	loadInDie(element) {
		//var html = '<img class="extension-icon-fadein" src="' +
		//	chrome.extension.getURL("images/icon16.png") +
		//	'" width="14" height="14" style="margin-bottom:3px; margin-right:3px; display:none;" alt="D&amp;D Beyond Interaction" title="D&amp;D Beyond Interaction"/>';
	
		//element.prepend(html);
	
		//$('.extension-icon-fadein').fadeIn(250);
	}
	
	createLinkedRolls(damageAmount, damageType, mainAction) {
		var damageParts = [];
		var modifier = 0;
	
		//This means it is "straight" damage (like just N)
		if (!damageAmount.includes("+") && !damageAmount.includes("d"))
			damageAmount = "0d0+" + damageAmount;
	
		//Has modifier
		if (damageAmount.includes("+")) {
			var parts = damageAmount.split("+");
			modifier = parts[1];
	
			damageParts = parts[0].split("d");
		} else if (damageAmount.includes("-")) {
			var parts = damageAmount.split("-");
			modifier = '-' + parts[1];
	
			damageParts = parts[0].split("d");
		} else {
			damageParts = damageAmount.split("d");
		}
	
		mainAction.MainRoll.LinkedRolls.push({
			Description: damageType,
			Dice: Number(damageParts[0]),
			Sides: Number(damageParts[1]),
			Modifier: Number(modifier)
		});
	}
}