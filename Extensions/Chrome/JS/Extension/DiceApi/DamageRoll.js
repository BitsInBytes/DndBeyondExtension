class DamageRoll
	extends Roll
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
        return new DamageRoll(this.NumberOfDice, this.DieSides, this.Modifier, this.Description);
    }
}