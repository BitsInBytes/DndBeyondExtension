class RollResult
{
	constructor(roll)
	{
        this.Roll = roll;
        this.TotalRolledValue = 0;
        this.IndividualRollResults = [];
        this.Fail = false;
        this.Crit = false;
    }
    
    AddDieResult(value)
    {
        this.IndividualRollResults.push(value);

        this.TotalRolledValue = this.TotalRolledValue + value;
    }

    get TotalValue()
    {
        return this.TotalRolledValue + this.Roll.Modifier;
    }

    get Status()
    {
        var status = "";

        if(this.Crit === true)
        {
            status = "Crit! ~ "
        }
        else if(this.Fail === true)
        {
            status = "Fail! ~ "
        }

        return status;
    }

    ToString()
    {
        return this.IndividualRollResults.join(',') + this.Roll.ModifierString;
    }
}