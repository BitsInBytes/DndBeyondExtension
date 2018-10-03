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

		//'Talon.'
		var nameElement = element.find('strong');
		var name = nameElement.text();

		if(name.toLowerCase() == "variant")
		{
			this.Valid = false;
		}
		else
		{
			this.Valid = true;
			//'Talon'
			this.Name = name.replace('.','');
			this.CombatRollContainer = this.BuildCombatRollContainer(element);

			var uiObject = this;
			this.AddClickToRollToElement(nameElement, function() { 
				uiObject.ExecuteCombatRollContainer();
			});
		}
	}

	BuildCombatRollContainer(element)
	{
		//Melee Weapon Attack: +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage.
		var description = element.text().toLowerCase().replace(this.Name.toLowerCase(), '').trim();

		//1D20+4 to hit
		var attackRoll = this.BuildAttackRoll(description);
		//1D4+2 slashing damage
		var damageRoll = this.BuildDamageRoll(description);

		return new CombatRollContainer(attackRoll, damageRoll);
	}

	BuildAttackRoll(description)
	{
		//Melee Weapon
		// +4 to hit, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage.
		var attack = description.split('attack:');

		if(attack.length === 1)
		{
			return null;
		}

		//+4
		//, reach 5 ft., one target. Hit: 4 (1d4 + 2) slashing damage.
		//modifier = 4
		var modifier = parseInt(attack[1].trim().replace('+',''));

		return new Roll(1, 20, modifier, "to hit")
	}

	BuildDamageRoll(description)
	{
		//Melee Weapon Attack: +4 to hit, reach 5 ft., one target. 
		// 4 (1d4 + 2) slashing damage.
		var damage = description.split('hit:');

		if(damage.length === 1)
		{
			return null;
		}

		// 4 (
		//1d4 + 2) slashing damage.
		//
		//1d4 + 2
		// slashing damage.
		var damage = damage[1].split('(')[1].split(')');

		//1d4 + 2
		var dice = damage[0];
		//slashing 
		var damageType = damage[1].split('damage')[0].trim();
		var modifier = 0;

		if(dice.includes('+'))
		{
			//1d4 
			// 2
			var diceSplit = dice.split('+');
			//1d4
			dice = diceSplit[0].trim();
			//2
			modifier = parseInt(diceSplit[1].trim());
		}
		else if(dice.includes('-'))
		{
			//1d4 
			// 2
			var diceSplit = dice.split('-');
			//1d4
			dice = diceSplit[0].trim();
			//-2
			modifier = parseInt(diceSplit[1].trim()) * -1;
		}

		//1
		//4
		var diceSplit = dice.split('d');
		//1
		var numberOfDice = parseInt(diceSplit[0]);
		//4
		var sidesOfDice = parseInt(diceSplit[1]);

		return new Roll(numberOfDice, sidesOfDice, modifier, damageType + " damage")
	}

	ExecuteCombatRollContainer()
	{
		var attackRoll = this.CombatRollContainer.AttackRoll;
		var damageRoll = this.CombatRollContainer.DamageRoll;

		var mainAction =
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

		mainAction.MainRoll.LinkedRolls.push({
			Description: damageRoll.Description,
			Dice: damageRoll.NumberOfDice,
			Sides: damageRoll.DieSides,
			Modifier: damageRoll.Modifier
		});

		ExecuteActions([mainAction]);
	}

	static BuildAll()
	{
		var actions = [];

		$('.mon-stat-block__description-block').each(function()
		{
			if($(this).find('.mon-stat-block__description-block-heading').text().toLowerCase() == 'actions')
			{
				$(this).find('.mon-stat-block__description-block-content').find('p').each(function()
				{
					var action = new Action($(this));

					if(action.Valid === true)
					{
						actions.push(action);
					}
				});
			}
		});

		return actions;
	}
}