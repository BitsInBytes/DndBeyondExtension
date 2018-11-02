class DamageRoll
	extends Roll
{
	constructor(numberOfDice, dieSides, modifier, description, savingThrow)
	{
		super();
		
		this.NumberOfDice = numberOfDice;
		this.DieSides = dieSides;
		this.Modifier = modifier;
        this.Description = description;
        this.SavingThrow = savingThrow;
        this.Result = null;
    }

	Clone()
	{
        return new DamageRoll(this.NumberOfDice, this.DieSides, this.Modifier, this.Description, this.SavingThrow);
    }
}