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
		var skill = this;
		var skills = element.text().trim().split(', ');
	
		skills.forEach(function(item)
		{
			var skillParts = item.split(' ');

			if(skillParts[0] === skill.Name)
			{
				var modifier = parseInt(skillParts[1].replace('+','').trim());
				skill.Modifier = modifier;
			}
		});
	}

	InjectIntoDom()
	{
		this.Id = this.NewGuid();

		$(`#extension_monster_skills_${this.Ability.Name}`).append(`<span id="${this.Id}">${this.Name}</span>, `);
		
		var skill = this;
		this.AddClickToRollToElement($(`#${this.Id}`), function() { 
			skill.ExecuteSkillCheckRoll();
		});

		this.Element = $(`#${this.Id}`);
	}

	HookElementHtml(element)
	{
		var skill = this;

		//Inject the span into all linked skill text
		element.find('a').each(function() {
			if($(this).text() === skill.Name)
			{
				$(this).click(function(e) {
					e.preventDefault();
				});

				var id = skill.NewGuid();

				$(this).html(`<span class="${id}">${skill.Name}</span>`);

				skill.AddClickToRollToElement($(`.${id}`), function() { 
					skill.ExecuteSkillCheckRoll();
				});
			}
		});
	}

	ExecuteSkillCheckRoll()
	{
		var mainAction =
		{
			Title: this.Name,
			MainRoll: {
				Description: "Skill Check",
				Dice: 1,
				Sides: 20,
				Modifier: this.Modifier,
				LinkedRolls: []
			}
		};

		ExecuteActions([mainAction]);
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
					var skillsDom = $(this);

					skills.forEach(function(item)
					{
						item.OverrideAbilityModifier(skillsDom);
					});
				});

				var currentHtml = skillsBlock.html();
				skillsBlock.removeClass('mon-stat-block__tidbit');
				skillsBlock.html('');

				/*
					There are actually no con skills
					As well, wisdom has so many skills, we place it last as it looks the best
				*/
				var filteredAbilities = abilities.filter(item => item.Name !== "CON" && item.Name !== "WIS");
				filteredAbilities.push(abilities.filter(item => item.Name === "WIS")[0]);

				filteredAbilities.forEach(function(item)
				{
					skillsBlock.append
					(`
						<div class="mon-stat-block__tidbit">
							<span class="mon-stat-block__tidbit-label">${item.Name}</span>
							<span id="extension_monster_skills_${item.Name}" class="mon-stat-block__tidbit-data" />
						</div>
					`);
				});

				skills.forEach(function(item)
				{
					item.InjectIntoDom();
				});

				skillsBlock.append(currentHtml);
			}
		});

		return skills;
	}
}