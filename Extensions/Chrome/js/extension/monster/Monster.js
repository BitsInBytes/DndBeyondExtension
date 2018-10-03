class Monster
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

		if(settings.DndBeyond_MonstersEnabled === true)
		{
			if(url.includes(".com/monsters"))
			{
				var monster = new Monster(settings);
				//TODO: Port C# to JS
				//From MonsterPage.js
				//loadMonsterData();
				monster.LoadAbilities();
				monster.LoadSkills();
				monster.LoadActions();
				
				return monster;
			}
		}

		return { Exists: false };
	}

	LoadAbilities()
	{
		//Foreach ability-block__stat
			//Name ability-block__heading
			//Total ability-block__score
			//Modifier ability-block__modifier - remove () ; cast to int
	}

	LoadSkills()
	{
		//Foreach mon-stat-block__tidbit-label
		//WHERE .text() == Skills
			//Foreach mon-stat-block__tidbit-data
				//Name skill-tooltip
				//Modifier data.ToString -> remove name -> trim -> to int
	}

	LoadActions()
	{
		//Foreach mon-stat-block__description-block
		//WHERE mon-stat-block__description-block-heading is 'Actions'
			//Foreach <P> (check monster C# for its logic)
	}
}