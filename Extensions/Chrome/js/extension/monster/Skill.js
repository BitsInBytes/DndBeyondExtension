class Skill
	extends UIObject
{
	//Handles '.mon-stat-block__tidbit-data'
	constructor(name, ability)
	{
		super();

		this.Element = null;
		this.Name = name;
		this.Modifier = ability.Modifier;
		this.Ability = ability;
	}

	OverrideAbilityModifier(element)
	{
		var name = element.find('.skill-tooltip').text();
		var modifier = parseInt(element.text().replace(name, '').replace('+','').trim());
		
		this.Element = element;
		this.Modifier = modifier;
	}

	InjectIntoDom()
	{
		var idName = `extension_skill_${this.Name.split(' ').join('')}`;

		$(`#extension_monster_skills_${this.Ability.Name}`).append(`<span id="${idName}">${this.Name}</span>, `);

		this.AddClickToRollToElement($(`#${idName}`), function() { 
			alert('test');
			//uiObject.ExecuteCombatRollContainer();
		});
	}

	static BuildStub(name, ability)
	{
		return new Skill(name, ability);
	}

	static BuildAll(abilities)
	{
		var str = Ability.GetAbility(abilities, "STR");
		var dex = Ability.GetAbility(abilities, "DEX");
		var int = Ability.GetAbility(abilities, "INT");
		var con = Ability.GetAbility(abilities, "CON");
		var wis = Ability.GetAbility(abilities, "WIS");
		var cha = Ability.GetAbility(abilities, "CHA");

		var skills =
		[
			Skill.BuildStub("Athletics", str),

			Skill.BuildStub("Acrobatics", dex),
			Skill.BuildStub("Sleight Of Hand", dex),
			Skill.BuildStub("Stealth", dex),

			Skill.BuildStub("Arcana", int),
			Skill.BuildStub("History", int),
			Skill.BuildStub("Investigation", int),
			Skill.BuildStub("Nature", int),
			Skill.BuildStub("Religion", int),

			Skill.BuildStub("Animal Handling", wis),
			Skill.BuildStub("Insight", wis),
			Skill.BuildStub("Medicine", wis),
			Skill.BuildStub("Perception", wis),
			Skill.BuildStub("Survival", wis),

			Skill.BuildStub("Deception", cha),
			Skill.BuildStub("Intimidation", cha),
			Skill.BuildStub("Performance", cha),
			Skill.BuildStub("Persuasion", cha)
		];

		$('.mon-stat-block__tidbit').each(function()
		{
			var skillsBlock = $(this);

			if($(this).find('.mon-stat-block__tidbit-label').text().toLowerCase() == 'skills')
			{
				$(this).find('.mon-stat-block__tidbit-data').each(function()
				{
					var skillName = $(this).find('.skill-tooltip').text();
					var skillDom = $(this);

					skills.forEach(function(item)
					{
						if(item.Name === skillName)
						{
							item.OverrideAbilityModifier(skillDom);
						}
					});
				});

				skillsBlock.html(``);
				skillsBlock.removeClass('mon-stat-block__tidbit');

				abilities.forEach(function(item)
				{
					//There are actually no con skills
					if(item.Name !== "CON")
					{
						skillsBlock.append
						(
							`
								<div class="mon-stat-block__tidbit">
									<span class="mon-stat-block__tidbit-label">${item.Name}</span>
									<span id="extension_monster_skills_${item.Name}" class="mon-stat-block__tidbit-data" />
								</div>
							`
						);
					}
				});

				skills.forEach(function(item)
				{
					item.InjectIntoDom();
				});
			}
		});

		return skills;
	}
}