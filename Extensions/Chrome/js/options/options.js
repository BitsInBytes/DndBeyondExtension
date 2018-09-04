$(document).ready(function () {
    chrome.storage.sync.get([
        "DndBeyond_Enabled",
        "DndBeyond_SlackEnabled",
        "DndBeyond_SlackToken",
        "DndBeyond_SlackChannel",
        "DndBeyond_DiceRollerWidgetEnabled",
        "DndBeyond_DiceRollerWidgetVerticalEnabled",
        "DndBeyond_MonstersEnabled",
        "DndBeyond_CharactersEnabled",
        "DndBeyond_BetaCode"], function (data) {
        
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

        //Introduced in 1.2.0
        if (data.DndBeyond_CharactersEnabled === undefined) {
            data.DndBeyond_CharactersEnabled = true;
        }

        $('#enabled').prop('checked', data.DndBeyond_Enabled);

        $('#widgetEnabled').prop('checked', data.DndBeyond_DiceRollerWidgetEnabled);
        $('#widgetVerticalEnabled').prop('checked', data.DndBeyond_DiceRollerWidgetVerticalEnabled);

        $('#charactersEnabled').prop('checked', data.DndBeyond_CharactersEnabled);
        $('#monstersEnabled').prop('checked', data.DndBeyond_MonstersEnabled);

        $('#slackEnabled').prop('checked', data.DndBeyond_SlackEnabled);
        $('#token').val(data.DndBeyond_SlackToken);
        $('#channel').val(data.DndBeyond_SlackChannel);

        $('#betaCode').val(data.DndBeyond_BetaCode);
    });

    $("#saveButton").click(function () {
        updateChromeSettings();
    });
});

function updateChromeSettings() {
    var obj = {
        DndBeyond_Enabled: $('#enabled').is(":checked"),

        DndBeyond_DiceRollerWidgetEnabled: $('#widgetEnabled').is(":checked"),
        DndBeyond_DiceRollerWidgetVerticalEnabled: $('#widgetVerticalEnabled').is(":checked"),

        DndBeyond_CharactersEnabled: $('#charactersEnabled').is(":checked"),
        DndBeyond_MonstersEnabled: $('#monstersEnabled').is(":checked"),

        DndBeyond_SlackEnabled: $('#slackEnabled').is(":checked"),
        DndBeyond_SlackToken: $('#token').val(),
        DndBeyond_SlackChannel: $('#channel').val(),

        DndBeyond_BetaCode: $('#betaCode').val()
    };
    
    chrome.storage.sync.set(obj, function () {
        alert('Settings Saved!');
    });
}