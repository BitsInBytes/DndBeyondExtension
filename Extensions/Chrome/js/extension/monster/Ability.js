class Ability
	extends UIObject
{
	//Handles '.ability-block__stat'
	constructor(element)
	{
		super();
		
		var name = element.find('.ability-block__heading').text();
		var total = parseInt(element.find('.ability-block__score').text());
		var modifier = parseInt(element.find('.ability-block__modifier').text().replace('+','').replace('(','').replace(')',''));

		this.Name = name;
		this.Total = total;
		this.Modifier = modifier;
		this.Element = element;
	}

	InjectIntoDom()
	{
		var ability = this;
		this.AddClickToRollToElement(this.Element.find('.ability-block__heading'), function() { 
			ability.ExecuteSkillCheckRoll();
		});
	}

	ExecuteSkillCheckRoll()
	{
		var mainAction =
		{
			Title: this.Name,
			MainRoll: {
				Description: "Ability Check",
				Dice: 1,
				Sides: 20,
				Modifier: this.Modifier,
				LinkedRolls: []
			}
		};

		ExecuteActions([mainAction]);
	}
	
	static BuildAll()
	{
		var abilities = [];
		
		$('.ability-block__stat').each(function()
		{
			var ability = new Ability($(this));
			ability.InjectIntoDom();

			abilities.push(ability);
		});

		return abilities;
	}

	static GetAbility(abilities, name)
	{
		return abilities.filter(function(item){ return item.Name === name; })[0];
	}
}