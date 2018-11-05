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

//                 var dr = new DiceRoller(settings);

// var attackRoll =       new AttackContainer(
//     "title",
//     new HitRoll(1,20,5,"desc",5),
//     [
//         new DamageContainer(
//             [new DamageRoll(1,4,1,"first",new SavingThrow(20, "wis")),
//             new DamageRoll(1,4,1,"second",new SavingThrow(20, "wis"))],

//             [new Roll(1,4,0,"days"),new Roll(1,12,0,"hours")]
//         ),
//         new DamageContainer(
//             [new DamageRoll(1,4,1,"first",new SavingThrow(20, "wis")),
//             new DamageRoll(1,4,1,"second",new SavingThrow(20, "wis"))],

//             null
//         ),
//     ],
//     [new Roll(1,4,0,"days"),new Roll(1,12,0,"hours")],
//     `Frightful Presence. Each creature of the dragon's choice that is within 120 feet of the dragon and aware of it must succeed on a DC 19 Wisdom saving throw or become frightened for 1 minute. A creature can repeat the saving throw at the end of each of its turns, ending the effect on itself on a success. If a creature's saving throw is successful or the effect ends for it, the creature is immune to the dragon's Frightful Presence for the next 24 hours.`
//     );

//                 var executedRoll = dr.ExecuteAttackRoll(attackRoll);

//                 dr.PublishExecutedAttackRoll(executedRoll);

// return;
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