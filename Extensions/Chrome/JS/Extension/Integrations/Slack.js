class SlackIntegration
{
    static Post(htmlBlocks)
    {
        htmlBlocks.forEach(html =>
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
    
            $.ajax(
            {
                url: 'https://slack.com/api/chat.postMessage',
                data: fd,
                processData: false,
                contentType: false,
                type: 'POST',
                success: function (data)
                {
                    if (data.ok === true)
                    {
                        displaySuccess("Slack message sent successfully!");
                    }
                    else
                    {
                        displayError("Slack message failed with response!");
                        console.log(data);
                    }
                },
                error: function ()
                {
                    displayError("Slack message failed!");
                }
            });    
        });
    }
}