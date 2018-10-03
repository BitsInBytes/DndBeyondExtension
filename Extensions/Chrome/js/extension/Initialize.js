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
                    
                defaultSettingsObject(data);

                GLOBAL_SETTINGS_OBJECT = data;

                if (GLOBAL_SETTINGS_OBJECT.DndBeyond_Enabled === true)
                {
                    defaultSettingsObject(data);

                    //TODO: Object
                    //From: Lightbox.js
                    addDownloadButtonToLightbox();

                    if(GLOBAL_SETTINGS_OBJECT.DndBeyond_DiceRollerWidgetEnabled === true)
                    {
                        GLOBAL_WIDGET_OBJECT = {
                            exists: true,
                            name: "Dice Roller",
                            icon: chrome.extension.getURL("images/icon48.png")
                        };

                        DiceRollerWidget.LoadWidget();
                    }

                    let url = window.location.href.toLowerCase();

                    if(GLOBAL_SETTINGS_OBJECT.DndBeyond_CharactersEnabled === true)
                    {
                        if (url.includes("/profile/") && url.includes("/characters/") && !url.includes("/builder/")) {
                            GLOBAL_CHARACTER_OBJECT = {
                                exists: true
                            };

                            //TODO: Object
                            //From: CharacterPage.js
                            loadCharacterData();
                        }
                    }

                    if(GLOBAL_SETTINGS_OBJECT.DndBeyond_MonstersEnabled === true)
                    {
                        if(url.includes(".com/monsters"))
                        {
                            GLOBAL_MONSTER_OBJECT = {
                                exists: true
                            };
    
                            //TODO: Port C# to JS
                            //From MonsterPage.js
                            //loadMonsterData();
                        }
                    }
                }
		    });
		}
	}, 10);
});

function defaultSettingsObject(data) {
    //Introduced in 1.0
    if (data.DndBeyond_Enabled === undefined) {
        data.DndBeyond_Enabled = true;
    }

    if (data.DndBeyond_SlackEnabled === undefined) {
        data.DndBeyond_SlackEnabled = false;
    }

    if (data.DndBeyond_SlackToken === undefined) {
        data.DndBeyond_SlackToken = "";
    }

    if (data.DndBeyond_SlackChannel === undefined) {
        data.DndBeyond_SlackChannel = "";
    }

    //Introduced in 1.1
    if (data.DndBeyond_DiceRollerWidgetEnabled === undefined) {
        data.DndBeyond_DiceRollerWidgetEnabled = true;
    }
    
    if (data.DndBeyond_MonstersEnabled === undefined) {
        data.DndBeyond_MonstersEnabled = true;
    }

    //Introduced in 1.1.2
    if (data.DndBeyond_DiceRollerWidgetVerticalEnabled === undefined) {
        data.DndBeyond_DiceRollerWidgetVerticalEnabled = false;
    }

    //Introduced in 1.2.0
    if (data.DndBeyond_BetaCode === undefined) {
        data.DndBeyond_BetaCode = "";
    }

    //Introduced in 1.3.0
    if (data.DndBeyond_CharactersEnabled === undefined) {
        data.DndBeyond_CharactersEnabled = true;
    }
}

function displayError(dataToDisplay) {
    console.error(dataToDisplay);

    $.notify(dataToDisplay, { position: "top right", className: "error" });
}

function displaySuccess(dataToDisplay) {
    console.info(dataToDisplay);

    $.notify(dataToDisplay, { globalPosition: "top right", className: "success" });
}