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
                    GLOBAL_SETTINGS_OBJECT = settings;
                    GLOBAL_WIDGET_OBJECT = DiceRollerWidget.Initialize(settings);
                    GLOBAL_CHARACTER_OBJECT = Character.Initialize(settings);
                    GLOBAL_MONSTER_OBJECT = Monster.Initialize(settings);

                    LightboxExtensions.Initialize();
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

String.prototype.replaceAll = function(searchMask, replaceMask) {
    var regEx = new RegExp(searchMask, "ig");
    return this.replace(regEx, replaceMask);
};