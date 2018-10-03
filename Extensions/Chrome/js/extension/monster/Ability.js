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
	}
	
	static BuildAll()
	{
		var abilities = [];
		
		$('.ability-block__stat').each(function()
		{
			abilities.push(new Ability($(this)));
		});

		return abilities;
	}
}