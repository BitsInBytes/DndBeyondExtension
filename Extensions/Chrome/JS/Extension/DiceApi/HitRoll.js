class HitRoll
	extends Roll
{
	constructor(modifier, description, reach)
	{
		super();
		
		this.NumberOfDice = 1;
		this.DieSides = 20;
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