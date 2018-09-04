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

					if (GLOBAL_SETTINGS_OBJECT.DndBeyond_Enabled === true) {


						GLOBAL_SERVICE_OBJECT = {
							exists: true,
							service_url: "https://localhost:44335/v3"
						};

						GLOBAL_WIDGET_OBJECT = {
							exists: true,
							name: "Dice Roller",
							icon: chrome.extension.getURL("images/icon48.png")
						};

						GLOBAL_CHARACTER_OBJECT = {
							exists: false
						};

						GLOBAL_MONSTER_OBJECT = {
							exists: false
						};

						GLOBAL_SETTINGS_OBJECT = defaultSettingsObject(data);

						let url = window.location.href.toLowerCase();

						//On character page (but not editing the character)
						if (url.includes("/profile/") && url.includes("/characters/") && !url.includes("/builder/")) {
							//loadCharacterData();
						}

						//createWidget();

						DiceRollerWidget.LoadWidget();



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

function getServicePayload(loadHtml) {
    var html = "";

    if (loadHtml) {
        html = document.documentElement.outerHTML;
    }

    return {
        name: $('meta[property="og:title"]').attr('content'),
        html: html,
        title: document.title,
        url: window.location.href,
        extensionVersion: "1.3.0",
        browser: getBrowser(),
        options: {
            DndBeyond_DiceRollerWidgetEnabled: GLOBAL_SETTINGS_OBJECT.DndBeyond_DiceRollerWidgetEnabled,
            DndBeyond_MonstersEnabled: GLOBAL_SETTINGS_OBJECT.DndBeyond_MonstersEnabled,
            DndBeyond_CharactersEnabled: GLOBAL_SETTINGS_OBJECT.DndBeyond_CharactersEnabled,
            DndBeyond_BetaCode: GLOBAL_SETTINGS_OBJECT.DndBeyond_BetaCode
        }
    };
}

function displayError(dataToDisplay) {
    console.error(dataToDisplay);

    $.notify(dataToDisplay, { position: "top right", className: "error" });
}

function getBrowser() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];

    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }

    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }

    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];

    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);

    return M[0];
}