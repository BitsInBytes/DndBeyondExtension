class DiceRoller
{
	constructor(settings)
	{
        this.Settings = settings;
    }

    ExecuteAttackRoll(originalAttackRoll)
    {
        /*
            We need to deep clone all the objects because 'crits' double the dice count.
            If we double the objects dice, its doubled forever without cloning due to object reference.
        */
        var attackRoll = originalAttackRoll.Clone();

        attackRoll.HitRoll.Execute();

        attackRoll.DamageContainers.forEach(damageContainer =>
        {
            damageContainer.DamageRolls.forEach(roll => {
                roll.Execute(attackRoll.HitRoll.Result);
            });
        });

        attackRoll.EffectRolls.forEach(effectRoll =>
        {
            effectRoll.Execute();
        });

        return attackRoll;
    }

    PublishExecutedAttackRoll(attackRoll)
    {
        if(this.Settings.DndBeyond_SlackEnabled)
        {
            //Nothing for now
        }

        this.DisplayExecutedAttackRoll(attackRoll);
    }
    
    DisplayExecutedAttackRoll(attackRoll)
    {
        var html = `<strong><i>${attackRoll.Title.toTitleCase()}</i></strong>`;

        html = `${html}<br /><br />${this.GetRollResultHtml(attackRoll.HitRoll.Result)}`;
        html = `${html}<br /><strong>Damage</strong><br />`;

        var damageHtml = ``;
        attackRoll.DamageContainers.forEach(damageContainer => {
            if(damageHtml !== ``)
            {
                damageHtml = `${damageHtml}<br /><strong>Or</strong><br />`;
            }

            damageHtml = `${damageHtml}<br />`;
            
            damageContainer.DamageRolls.forEach(roll => {
                damageHtml = `${damageHtml}${this.GetRollResultHtml(roll.Result)}`;
            })

            damageHtml = `${damageHtml}${this.GetRollGroupTotalHtml(damageContainer.DamageRolls)}`;
        });
        
        html = `${html}${damageHtml}`;

        if(attackRoll.EffectRolls !== null)
        {
            html = `${html}<br /><strong>Additional Effects</strong><br /><br />`;

            attackRoll.EffectRolls.forEach(roll => {
                html = `${html}${this.GetRollResultHtml(roll.Result)}`;
            })
        }

        this.PopUp(html);
    }

    GetRollResultHtml(result)
    {
        var lineStart = `<span style="background-color:aqua; padding-right:3px; margin-right:5px;" />`;

        var valueDescription = `<strong>${result.Status}${result.TotalValue}</strong>`;
        var rolledValues = ` ... <i>(${result.ToString()})</i>`
        var savingThrow = ``;
        var reachText = ``;

        if(result.Roll instanceof DamageRoll && result.Roll.SavingThrow !== null)
        {
            savingThrow = `${lineStart}<i>(${result.Roll.SavingThrow.ToString()})</i><br />`;
        }

        if(result.Roll instanceof HitRoll && result.Roll.Reach !== null)
        {
            reachText = ` <i>(${result.Roll.Reach} Feet)</i>`;
        }

        return `${lineStart}${valueDescription} ${result.Roll.Description.toTitleCase()}${reachText}${rolledValues}<br />${savingThrow}`;
    }

    GetRollGroupTotalHtml(rolls)
    {
        var total = 0;
        rolls.forEach(roll => {
            total = total + roll.Result.TotalValue;
        })

        var lineStart = `<span style="background-color:#01FF70; padding-right:3px; margin-right:5px;" />`;
        var valueDescription = `<strong>${total} Total</strong>`;

        return `${lineStart}${valueDescription}<br />`;
    }

    PopUp(html)
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
                        //this.ExecuteActions(actions);
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
}