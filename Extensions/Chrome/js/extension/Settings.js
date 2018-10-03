class Settings
{
    constructor(data) {
        this.DefaultSettingsObject(data);
    }

    DefaultSettingsObject(data) {
        //Introduced in 1.0
        if (data.DndBeyond_Enabled === undefined) {
            this.DndBeyond_Enabled = true;
        }
        else this.DndBeyond_Enabled = data.DndBeyond_Enabled;
    
        if (data.DndBeyond_SlackEnabled === undefined) {
            this.DndBeyond_SlackEnabled = false;
        }
        else this.DndBeyond_SlackEnabled = data.DndBeyond_SlackEnabled;

        if (data.DndBeyond_SlackToken === undefined) {
            this.DndBeyond_SlackToken = "";
        }
        else this.DndBeyond_SlackToken = data.DndBeyond_SlackToken;

        if (data.DndBeyond_SlackChannel === undefined) {
            this.DndBeyond_SlackChannel = "";
        }
        else this.DndBeyond_SlackChannel = data.DndBeyond_SlackChannel;

        //Introduced in 1.1
        if (data.DndBeyond_DiceRollerWidgetEnabled === undefined) {
            this.DndBeyond_DiceRollerWidgetEnabled = true;
        }
        else this.DndBeyond_DiceRollerWidgetEnabled = data.DndBeyond_DiceRollerWidgetEnabled;
        
        if (data.DndBeyond_MonstersEnabled === undefined) {
            this.DndBeyond_MonstersEnabled = true;
        }
        else this.DndBeyond_MonstersEnabled = data.DndBeyond_MonstersEnabled;

        //Introduced in 1.1.2
        if (data.DndBeyond_DiceRollerWidgetVerticalEnabled === undefined) {
            this.DndBeyond_DiceRollerWidgetVerticalEnabled = false;
        }
        else this.DndBeyond_DiceRollerWidgetVerticalEnabled = data.DndBeyond_DiceRollerWidgetVerticalEnabled;

        //Introduced in 1.2.0
        if (data.DndBeyond_BetaCode === undefined) {
            this.DndBeyond_BetaCode = "";
        }
        else this.DndBeyond_BetaCode = data.DndBeyond_BetaCode;

        //Introduced in 1.3.0
        if (data.DndBeyond_CharactersEnabled === undefined) {
            this.DndBeyond_CharactersEnabled = true;
        }
        else this.DndBeyond_CharactersEnabled = data.DndBeyond_CharactersEnabled;
    }
}