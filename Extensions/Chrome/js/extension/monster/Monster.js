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

				this.Abilities = Ability.BuildAll();
				this.Skills = Skill.BuildAll(this.Abilities);
				this.Actions = Action.BuildAll();

				return monster;
			}
		}

		return { Exists: false };
	}
}