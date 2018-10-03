chrome.extension.sendMessage({}, function (response) {
	var readyStateCheckInterval = setInterval(function()
	{
		if (document.readyState === "complete")
        {
            clearInterval(readyStateCheckInterval);

            chrome.storage.sync.get([
                "DndBeyond_Enabled",
                "DndBeyond_SlackEnabled",
                "DndBeyond_SlackToken",
                "DndBeyond_SlackChannel",
                "DndBeyond_CharactersEnabled",
                "DndBeyond_MonstersEnabled",
                "DndBeyond_DiceRollerWidgetEnabled",
                "DndBeyond_DiceRollerWidgetVerticalEnabled",
                "DndBeyond_BetaCode"], function (data) {
                    
                var settings = new Settings(data);

                if (settings.DndBeyond_Enabled === true)
                {
                    //Global objects needed by DiceRoller.js
                    //TODO: Rewrite to not require global objects
                    GLOBAL_WIDGET_OBJECT = { exists: false };
                    GLOBAL_CHARACTER_OBJECT = { exists: false };
                    GLOBAL_MONSTER_OBJECT = { exists: false };

                    LightboxExtensions.Initialize();
                    Character.Initialize(settings);
                    DiceRollerWidget.Initialize(settings);

                    // if(GLOBAL_SETTINGS_OBJECT.DndBeyond_MonstersEnabled === true)
                    // {
                    //     if(url.includes(".com/monsters"))
                    //     {
                    //         GLOBAL_MONSTER_OBJECT = {
                    //             exists: true
                    //         };
    
                    //         //TODO: Port C# to JS
                    //         //From MonsterPage.js
                    //         //loadMonsterData();
                    //     }
                    // }
                }
		    });
		}
	}, 10);
});

//TODO: Replace with object invoke
//Used globally
function displayError(dataToDisplay) {
    console.error(dataToDisplay);

    $.notify(dataToDisplay, { position: "top right", className: "error" });
}

function displaySuccess(dataToDisplay) {
    console.info(dataToDisplay);

    $.notify(dataToDisplay, { globalPosition: "top right", className: "success" });
}