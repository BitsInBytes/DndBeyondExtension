/*
	Comments are for example action description: 'Talon. Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage.'
*/
class Action
	extends UIObject
{
	//Handles '.mon-stat-block__description-block-content' ~> <p>
	constructor(element)
	{
		super();

		var nameElement = element.find('strong');
		nameElement.addClass('action_title');

		//'Talon.'
		var name = nameElement.text();

		if(name.toLowerCase() == "variant")
		{
			this.Valid = false;
		}
		else
		{
			this.Valid = true;
			this.Element = element;
			//'Talon'
			this.Name = name.replace('.','');
			//Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage.
			this.Description = element.text().toLowerCase().replace(this.Name.toLowerCase(), '').trim();
			this.CombatRollContainer = this.BuildCombatRollContainer();
			this.Rollable = false;

			if(this.CombatRollContainer.DamageRolls !== null)
			{
				this.Rollable = true;
				this.InjectClickToRollIntoDom();
			}
		}
	}

	BuildCombatRollContainer()
	{
		//1D20+4 to hit
		var attackRoll = this.BuildAttackRoll();
		//1D4+2 slashing damage
		var damageRolls = this.BuildDamageRolls();

		return new CombatRollContainer(attackRoll, damageRolls);
	}

	BuildAttackRoll()
	{
		//'Melee Weapon' , '+4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage.'
		var attack = this.Description.split('attack:');

		if(attack.length === 1)
		{
			return null;
		}

		//'+4' , ', reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage.'
		//modifier = 4
		var modifier = parseInt(attack[1].trim().replace('+',''));

		return new Roll(1, 20, modifier, "to hit")
	}

	//Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage.
	BuildDamageRolls()
	{
		//Injects a recharge description so it gets picked up as a damage roll
		if(this.Name.includes('Recharge'))
		{
			this.Description = `At the start of the monsters turn, roll (1d6) to recharge. ${this.Description}`;
		}

		// [ "(1d4 + 2)" ]
		var rolls = this.Description.match(/\((.*?)\)+/g);

		if(rolls !== null)
		{
			var damageRolls = [];
			var action = this;

			rolls.forEach(function(rawRollText) {
				var damageRoll = action.BuildDamageRoll(rawRollText)                                                                                                                                    
				if(damageRoll !== null)
				{
					damageRolls.push(damageRoll);
				}
			});

			if(damageRolls.length !== 0)
			{
				return damageRolls;
			}
		}

		return null;
	}

	BuildDamageRoll(rawRollText)
	{
		//(1d4 + 2)
		var damage = rawRollText;
		//slashing damage
		var damageDescription = this.Description.split(rawRollText)[1].trim().split(' ');

		//Makes sure we can find the "damage" text, meaning this is a damage roll
		if(damageDescription.length > 1 && damageDescription[1].toLowerCase().includes('damage'))
		{
			//slashing damage
			damageDescription = damageDescription[0] + ' ' + damageDescription[1].replace('.', '').replace(',', '');
		}
		else if(damageDescription.length > 1 && damageDescription[1].toLowerCase().includes('recharge'))
		{
			damageDescription = "recharge";
		}
		else
		{
			damageDescription = "";
		}

		//1d4+2
		var dice = damage.replace('(','').replace(')','').replace(' ', '');

		//Makes sure we are not capturing things like "(perception)" or ("2 actions")
		if(isNaN(parseInt(dice.charAt(0))))
		{
			return null;
		}

		var modifier = 0;

		if(dice.includes('+'))
		{
			//1d4 , 2
			var diceSplit = dice.split('+');
			//1d4
			dice = diceSplit[0];
			//2
			modifier = parseInt(diceSplit[1]);
		}
		else if(dice.includes('-'))
		{
			//1d4 , 2
			var diceSplit = dice.split('-');
			//1d4
			dice = diceSplit[0].trim();
			//-2
			modifier = parseInt(diceSplit[1].trim()) * -1;
		}

		//1 , 4
		var diceSplit = dice.split('d');
		//1
		var numberOfDice = parseInt(diceSplit[0]);
		//4
		var sidesOfDice = parseInt(diceSplit[1]);

		var roll = new Roll(numberOfDice, sidesOfDice, modifier, damageDescription)

		//Setting up this specific roll found, to be uniquely rollable outside of the main action later
		var hookedHtml = this.Element.html().replace(`${rawRollText} ${damageDescription}`,`<span class="${roll.Id}">${rawRollText} ${damageDescription}</span>`);

		//Replace html
		this.Element.html(hookedHtml);

		return roll;
	}

	ExecuteCombatRollContainer()
	{
		var attackRoll = this.CombatRollContainer.AttackRoll;
		var damageRolls = this.CombatRollContainer.DamageRolls;
		var mainAction = {};

		if(attackRoll === null)
		{
			mainAction =
			{
				Title: this.Name,
				MainRoll: {
					Dice: 0,
					LinkedRolls: [],
					DiceFound: false
				}
			};
		}
		else
		{
			mainAction =
			{
				Title: this.Name,
				MainRoll: {
					Description: attackRoll.Description,
					Dice: attackRoll.NumberOfDice,
					Sides: attackRoll.DieSides,
					Modifier: attackRoll.Modifier,
					LinkedRolls: []
				}
			};
		}

		damageRolls.forEach(function(damageRoll)
		{
			mainAction.MainRoll.LinkedRolls.push({
				Description: damageRoll.Description,
				Dice: damageRoll.NumberOfDice,
				Sides: damageRoll.DieSides,
				Modifier: damageRoll.Modifier
			});
		});

		ExecuteActions([mainAction]);
	}

	InjectClickToRollIntoDom()
	{
		this.Rollable = true;
		var action = this;
		
		this.AddClickToRollToElement(this.Element.find('.action_title'), function() { 
			action.ExecuteCombatRollContainer();
		});

		this.CombatRollContainer.DamageRolls.forEach(function(roll)
		{
			action.AddClickToRollToElement($(`.${roll.Id}`), function() { 
				ExecuteActions([{
					Title: action.Name,
					MainRoll: {
						Dice: 0,
						LinkedRolls: [{
							Description: roll.Description,
							Dice: roll.NumberOfDice,
							Sides: roll.DieSides,
							Modifier: roll.Modifier
						}],
						DiceFound: false
					}
				}]);
			});
		});
	}

	static BuildAll()
	{
		var actions = [];

		$('.mon-stat-block__description-block').each(function()
		{
			$(this).find('.mon-stat-block__description-block-content').find('p').each(function()
			{
				var action = new Action($(this));

				if(action.Valid === true)
				{
					actions.push(action);
				}
			});
		});

		return actions;
	}
}