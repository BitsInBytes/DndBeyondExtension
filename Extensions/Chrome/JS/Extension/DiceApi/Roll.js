class Roll
	extends UniqueObject
{
	constructor(numberOfDice, dieSides, modifier, description)
	{
		super();
		
		this.NumberOfDice = numberOfDice;
		this.DieSides = dieSides;
		this.Modifier = modifier;
        this.Description = description;
        this.Result = null;
    }

	Clone()
	{
        return new Roll(this.NumberOfDice, this.DieSides, this.Modifier, this.Description);
    }

    get ModifierString()
    {
        var modifier = "";

        if(this.Modifier > 0)
        {
            modifier = ` + ${this.Modifier}`;
        }
        else if(this.Modifier < 0)
        {
            modifier = ` - ${this.Modifier * -1}`;
        }

        return modifier;
    }
    
    ToString()
    {
        return `${this.NumberOfDice}d${this.DieSides}${this.ModifierString}`;
    }

    Execute(hitRollResult = null)
    {
        var roll = this;

        if(hitRollResult !== null)
        {
            if(hitRollResult.Crit === true)
            {
                roll.NumberOfDice = roll.NumberOfDice * 2;
            }
        }

        var result = new RollResult(roll);
    
        for (var d = 0; d < roll.NumberOfDice; d++)
        {
            var rolledValue = Math.floor(Math.random() * roll.DieSides) + 1;
    
            if (roll.DieSides == 20 && roll.NumberOfDice == 1)
            {
                if (rolledValue == 1)
                {
                    result.Fail = true;
                }
                else if (rolledValue == 20)
                {
                    result.Crit = true;
                }
            }
    
            result.AddDieResult(rolledValue);
        }

        this.Result = result;

        return result;
    }
}