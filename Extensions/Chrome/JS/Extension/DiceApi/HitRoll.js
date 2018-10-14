class HitRoll
	extends Roll
{
	constructor(numberOfDice, dieSides, modifier, description, reach)
	{
		super();
		
		this.NumberOfDice = numberOfDice;
		this.DieSides = dieSides;
		this.Modifier = modifier;
        this.Description = description;
        this.Reach = reach;
        this.Result = null;
    }

	Clone()
	{
        return new HitRoll(this.NumberOfDice, this.DieSides, this.Modifier, this.Description, this.Reach);
    }
}