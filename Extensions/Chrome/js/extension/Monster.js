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

				return monster;
			}
		}

		return { Exists: false };
	}
}