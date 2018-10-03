class Skill
	extends UIObject
{
	//Handles '.mon-stat-block__tidbit-data'
	constructor(element)
	{
		super();
		
		var name = element.find('.skill-tooltip').text();
		var modifier = parseInt(element.text().replace(name, '').replace('+','').trim());
		
		this.Name = name;
		this.Modifier = modifier;
	}

	static BuildAll()
	{
		var skills = [];

		$('.mon-stat-block__tidbit').each(function()
		{
			if($(this).find('.mon-stat-block__tidbit-label').text().toLowerCase() == 'skills')
			{
				$(this).find('.mon-stat-block__tidbit-data').each(function()
				{
					skills.push(new Skill($(this)))
				});
			}
		});

		return skills;
	}
}