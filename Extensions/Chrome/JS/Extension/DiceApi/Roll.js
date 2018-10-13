class Roll
	extends UniqueObject
{
	constructor(numberOfDice, dieSides, modifier, description)
	{
		super();
		
		this.IsAttack = dieSides === 20;
		this.NumberOfDice = numberOfDice;
		this.DieSides = dieSides;
		this.Modifier = modifier;
		this.Description = description;
	}
}