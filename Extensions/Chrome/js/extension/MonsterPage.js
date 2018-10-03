function loadMonsterData() {
    console.info("Loading monster data");

    $.ajax({
        contentType: 'application/json',
        dataType: 'json',
        url: GLOBAL_SERVICE_OBJECT.service_url + "/monster",
        method: 'POST',
        processData: false,
        data: JSON.stringify(getServicePayload(true)),
        success: function (data) {
            if (!data.monsterSupported) {
                displayError("Could not generate monster at runtime!");
            } else {
                appendMonsterName("Service call for dynamic monster succesfull", "[Dynamic Ready]", "yellow");

                replaceAllFromRootData(data);
            }
        },
        error: function () {
            displayError("Failed to get monster data from the extension service");
        }
    });
}

function appendMonsterName(log, publicText, color) {
    console.info(log);

    $(".monster-name").append("<span id='ExtensionHook' style='display: none; color: " + color + ";'>" + publicText + "<span>");
    $("#ExtensionHook").fadeIn("slow");
}

function replaceAllFromRootData(dataToUse) {
    GLOBAL_MONSTER_OBJECT = dataToUse.monster;

    jQuery.globalEval(dataToUse.javascriptContainer.monsterJavascript);

    //Skills block
    $('.ability-block').append('<center style="margin-left:0px;"><div class="info-block ExtensionFadeIn" style="display: none;"><span><strong>Athletics</strong> , <strong>Acrobatics</strong> , <strong>Sleight of Hand</strong> , <strong>Stealth</strong> , <strong>Arcana</strong> , <strong>History</strong> , <strong>Investigation</strong> , <strong>Nature</strong> , <strong>Religion</strong> , <strong>Animal Handling</strong> , <strong>Insight</strong> , <strong>Medicine</strong> , <strong>Perception</strong> , <strong>Survival</strong> , <strong>Deception</strong> , <strong>Intimidation</strong> , <strong>Performance</strong> , <strong>Persuasion</strong></span></div></center>');

    //ABILITIES - STR
    $('.ability-block').children('div').each(function (index) {
        var currentElement = $(this);
        $.each(GLOBAL_MONSTER_OBJECT.abilities, function (index) {
            if (currentElement.find(".ability-block__heading").text().toLowerCase() === GLOBAL_MONSTER_OBJECT.abilities[index].name.toLowerCase()) {
                currentElement.html('<img src="' + chrome.extension.getURL("images/icon16.png") + '" width="16" height="16" alt="D&amp;D Beyond Interaction" title="D&amp;D Beyond Interaction" class="ExtensionFadeIn" style="display: none" />' + currentElement.html());
                hookCurrentElement(currentElement, GLOBAL_MONSTER_OBJECT.abilities[index], false);
            }
        });
    });

    //skills / actions
    $("strong").each(function (index) {
        findAndReplaceFromData($(this));
    });

    var eventSet = false;

    $("em").each(function (index) {
        eventSet = findAndReplaceFromData($(this));
    });

    if (!eventSet) {
        $("span").each(function (index) {
            findAndReplaceFromData($(this));
        });
    }

    $(".ExtensionFadeIn").fadeIn("slow");
}

function findAndReplaceFromData(currentParentElement) {
    var currentElement = currentParentElement;
    var eventSet = false;

    $.each(GLOBAL_MONSTER_OBJECT.skills, function (index) {
        if (currentElement.html().toLowerCase() === GLOBAL_MONSTER_OBJECT.skills[index].name.toLowerCase()) {
            eventSet = true;
            hookCurrentElement(currentElement, GLOBAL_MONSTER_OBJECT.skills[index], false);
        }
    });

    $.each(GLOBAL_MONSTER_OBJECT.magicAbilities, function (index) {
        if (currentElement.html().toLowerCase() === GLOBAL_MONSTER_OBJECT.magicAbilities[index].name.toLowerCase()) {
            eventSet = true;
            hookCurrentElement(currentElement, GLOBAL_MONSTER_OBJECT.magicAbilities[index], true);
        }
    });

    //Actions
    $.each(GLOBAL_MONSTER_OBJECT.actions, function (index) {
        if (currentElement.html().toLowerCase() === GLOBAL_MONSTER_OBJECT.actions[index].name.toLowerCase()) {
            eventSet = true;
            hookCurrentElement(currentElement, GLOBAL_MONSTER_OBJECT.actions[index], true);
        }
    });

    if (!eventSet) {
        //Legendary Actions
        $.each(GLOBAL_MONSTER_OBJECT.legendaryActions, function (index) {
            if (currentElement.html().toLowerCase() === GLOBAL_MONSTER_OBJECT.legendaryActions[index].name.toLowerCase()) {
                eventSet = true;
                hookCurrentElement(currentElement, GLOBAL_MONSTER_OBJECT.legendaryActions[index], true);
            }
        });
    }

    return eventSet;
}

function hookCurrentElement(currentElement, data, includeImage) {
    currentElement.css('cursor', 'pointer');
    currentElement.css('color', 'MidnightBlue');
    currentElement.click(function (e) {
        jQuery.globalEval(data.javaScriptFunctionName + "();");
    });

    if (includeImage) {
        currentElement.before('<img src="' + chrome.extension.getURL("images/icon16.png") + '" width="16" height="16" alt="D&amp;D Beyond Interaction" title="D&amp;D Beyond Interaction"  class="ExtensionFadeIn" style="display: none; margin-right:5px;"/>');   
    }
}