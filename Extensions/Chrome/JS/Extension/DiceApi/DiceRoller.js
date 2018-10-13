class DiceRoller
{
	constructor(settings)
	{
        this.Settings = settings;
    }
    
    DisplayMonsterResult(actions, html)
    {
        if (this.Settings.DndBeyond_SlackEnabled)
        {
            var slackMarkUp = html.replaceAll("<strong>", "*");
            slackMarkUp = slackMarkUp.replaceAll("</strong>", "*");
            slackMarkUp = slackMarkUp.replaceAll("</i>", "_");
            slackMarkUp = slackMarkUp.replaceAll("<i>", "_");
            slackMarkUp = slackMarkUp.replaceAll("<br />", "\n");
            slackMarkUp = slackMarkUp.replaceAll("<span style=\"background-color:Aqua; padding-right:3px; margin-right:10px;\" />", ">");
            slackMarkUp = slackMarkUp.replaceAll("<span style=\"background-color:#01FF70; padding-right:3px; margin-right:10px;\" />", ">");
            slackMarkUp = slackMarkUp.replaceAll("<span style=\"background-color:Honeydew; color:deeppink; font-size: 80%;\">", "`");
            slackMarkUp = slackMarkUp.replaceAll("</span>", "`");
    
            var name = "N/A";
            var icon = "";
    
            if (GLOBAL_CHARACTER_OBJECT.Exists)
            {
                name = GLOBAL_CHARACTER_OBJECT.Name;
                icon = GLOBAL_CHARACTER_OBJECT.Icon;
            }
            else if (GLOBAL_MONSTER_OBJECT.Exists)
            {
                name = GLOBAL_MONSTER_OBJECT.Name;
                icon = GLOBAL_MONSTER_OBJECT.Icon;
            }
            else if (GLOBAL_WIDGET_OBJECT.Exists)
            {
                name = GLOBAL_WIDGET_OBJECT.Name;
                icon = GLOBAL_WIDGET_OBJECT.Icon;
            }
    
            var fd = new FormData();
            fd.append("token", this.Settings.DndBeyond_SlackToken);
            fd.append("channel", this.Settings.DndBeyond_SlackChannel);
            fd.append("text", slackMarkUp);
            fd.append("as_user", "false");
            fd.append("username", name);
            fd.append("icon_url", icon);
    
            $.ajax({
                url: 'https://slack.com/api/chat.postMessage',
                data: fd,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (data) {
                    if (data.ok === true) {
                        displaySuccess("Slack message sent successfully!");
                    } else {
                        displayError("Slack message failed with response!");
                        console.log(data);
                    }
                },
                error: function () {
                    displayError("Slack message failed!");
                }
            });
        } else {
            var dialogOptions = {
                "modal": true,
                "resizable": false,
                "draggable": true,
                width: "auto",
                hide: {
                    effect: 'show',
                    duration: 250
                },
                hide: {
                    effect: 'fade',
                    duration: 250
                },
                open: function () {
                    var popup = $(this);
    
                    $('.ui-widget-overlay').bind('click', function () {
                        popup.dialog('close');
                    });
    
                    $('.DiceRollResultsRollAgainButton').bind('click', function () {
                        popup.dialog('close');
                        this.ExecuteActions(actions);
                    });
                },
            };
    
            //Create dialog
            var dialog = $('<div></div>').html(html + '<br /><center><button class="character-button-block DiceRollResultsRollAgainButton" style="width:120px;">Roll Again</button></center>').dialog(dialogOptions);
            var dialogContainer = dialog.parent();
    
            //Bring to z-top most
            dialogContainer.style('z-index', '999999999999', 'important');
    
            //Set header bar size
            var titleBar = dialogContainer.find(".ui-dialog-titlebar");
            titleBar.css('height', '2px');
            titleBar.css('padding', '0px');
    
            //Set header text
            titleBar.html('<span id="ui-id-2" class="ui-dialog-title" style="float: left; margin-top:2px;"><img src="' + chrome.extension.getURL("images/icon48.png") + '" width="20" height="20" style="margin-bottom:5px; margin-left: 5px;" alt="D&amp;D Beyond Interaction" title="D&amp;D Beyond Interaction"/>  Dice Roll Results</span>');
    
            //Header images
            var closeImage = '<img src="' + chrome.extension.getURL("images/closeicon.png") + '" width="15" height="15" alt="X" title="Close"/>';
    
            //Create header buttons
            dialogContainer.find(".ui-dialog-titlebar").append('<button type="button" class="widget-close-button ui-button ui-corner-all ui-widget ui-button-icon-only" title="Close" style="background-color: #bf3333; padding:4px; float: right; margin-top:4px; margin-right: 5px;">' + closeImage + '</button>');
    
            dialogContainer.find('.widget-close-button').click(function () {
                dialog.dialog('close');
            });
        }
    }
    
    ExecuteActions(actions)
    {
        var html = "";
        for (var i = 0, len = actions.length; i < len; i++) {
            if (html) {
                html = html + "<br />" + this.ExecuteAction(actions[i]);
            } else {
                html = html + this.ExecuteAction(actions[i]);
            }
        }
    
        this.DisplayMonsterResult(actions, html);
    }
    
    ExecuteAction(action)
    {
        var returnValue = "<strong><i>" + action.Title + "</i></strong><br />";
        var expression = "";
        var status = "";
    
        if (typeof action.MainRoll != 'undefined') {
            if (action.MainRoll.Dice > 0) {
                var rolledDice = this.RollDice(action.MainRoll, true);
    
                expression = this.BuildExpression(expression, rolledDice.Expression);
                returnValue = returnValue + rolledDice.Html;
                status = rolledDice.Status;
            }
        }
    
        if (typeof action.MainRoll.LinkedRolls != 'undefined') {
            var totalValue = 0;
    
            //Go through the multiple expression actions
            for (var i = 0, len = action.MainRoll.LinkedRolls.length; i < len; i++) {
                if (status == "Crit! ~ ") {
                    action.MainRoll.LinkedRolls[i].Dice = action.MainRoll.LinkedRolls[i].Dice * 2;
                }
    
                var rolledDice = this.RollDice(action.MainRoll.LinkedRolls[i], action.MainRoll.LinkedRolls.length > 1);
    
                //Reset - shared instance on char sheet
                if (status == "Crit! ~ ") {
                    action.MainRoll.LinkedRolls[i].Dice = action.MainRoll.LinkedRolls[i].Dice / 2;
                }
    
                expression = this.BuildExpression(expression, rolledDice.Expression);
                returnValue = returnValue + rolledDice.Html;
                totalValue = totalValue + rolledDice.TotalValue;
            }
    
            if (action.MainRoll.LinkedRolls.length > 1 && totalValue > 0) {
                returnValue = returnValue + "<br /><span style=\"background-color:#01FF70; padding-right:3px; margin-right:10px;\" /><strong>" + totalValue + " Total</strong><br />";
            }
        }
    
        if (expression) {
            returnValue = returnValue + "<br />" + "<span style=\"background-color:Honeydew; color:deeppink; font-size: 80%;\">" + expression + "</span><br />";
        }
    
        return returnValue;
    }
    
    RollDice(roll, isPartOfChain)
    {
        var rolls = "";
        var totalValue = 0;
        var status = "";
        var savingThrowText = "";
    
        //Roll the n amount of Dice
        for (var d = 0; d < roll.Dice; d++) {
            var value = Math.floor(Math.random() * roll.Sides) + 1;
    
            if (roll.Sides == 20 && roll.Dice == 1) {
                if (value == 1) {
                    status = "Fail! ~ ";
                } else if (value == 20) {
                    status = "Crit! ~ ";
                }
            }
    
            if (rolls) {
                rolls = rolls + "," + value;
            } else {
                rolls = value;
            }
    
            totalValue = totalValue + value;
        }
    
        if (roll.SavingThrow) {
            savingThrowText = "<span style=\"background-color:Aqua; padding-right:3px; margin-right:10px;\" /><strong>" + roll.SavingThrow + "</strong><br />";
        }
    
        //No dice, just saving throw
        if (typeof roll.DiceFound != 'undefined') {
            return {
                Html: "<br />" + savingThrowText,
                Expression: "",
                Status: ""
            };
        }
    
        //Finalize data
        rolls = rolls + " " + this.FormatNumber(roll.Modifier);
        totalValue = totalValue + roll.Modifier;
    
        var color = "#01FF70";
        if (isPartOfChain) {
            color = "Aqua";
        }
    
        return {
            Html: "<br /><span style=\"background-color:" + color + "; padding-right:3px; margin-right:10px;\" /><strong>" + status + totalValue + "</strong> " + ToTitleCase(roll.Description) + " ... <i>(" + rolls + ")</i><br />" + savingThrowText,
            Expression: roll.Dice + "d" + roll.Sides + " " + this.FormatNumber(roll.Modifier),
            Status: status,
            TotalValue: totalValue
        };
    }
    
    BuildExpression(exp, value)
    {
        if (exp) {
            exp = exp + " | " + value;
        } else {
            exp = value;
        }
    
        return exp;
    }
    
    FormatNumber(num)
    {
        if (num) {
            if (num >= 0) {
                return "+ " + num;
            } else {
                return num;
            }
        }
    
        return "";
    }
}