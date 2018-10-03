class Roll
{
	constructor(numberOfDice, dieSides, modifier, description)
	{
		this.IsAttack = dieSides === 20;
		this.NumberOfDice = numberOfDice;
		this.DieSides = dieSides;
		this.Modifier = modifier;
		this.Description = description
	}
}