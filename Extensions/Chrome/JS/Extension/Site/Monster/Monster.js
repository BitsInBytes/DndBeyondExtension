class Monster
{
	constructor(settings)
	{
		this.Settings = settings;

		this.Exists = true;
        this.Name = "N/A";
		this.Icon = chrome.extension.getURL("images/icon48.png");
		
		this.Abilities = [];
		this.Skills = [];
	}

	static Initialize(settings)
	{
		let url = window.location.href.toLowerCase();

		if(settings.DndBeyond_MonstersEnabled === true)
		{
			if(url.includes(".com/monsters"))
			{
				var monster = new Monster(settings);

				//monster.Abilities = Ability.BuildAll();
				//monster.Skills = Skill.BuildAll(monster.Abilities);
				monster.Actions = Action.BuildAll();

				//monster.MakeMatchingNamesRollable();

				return monster;
			}
		}

		return { Exists: false };
	}

	MakeMatchingNamesRollable()
	{
		var self = this;

		$('.mon-stat-block__description-block').each(function()
		{
			var blockElement = $(this);

			self.Skills.forEach(function(skill)
			{
				skill.HookElementHtml(blockElement);
			});

			self.Actions.filter(item => item.Rollable === true).forEach(function(action)
			{
				skill.HookElementHtml(blockElement);
			});
		});
	}
}