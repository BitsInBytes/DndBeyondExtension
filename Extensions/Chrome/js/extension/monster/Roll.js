class Roll
{
	constructor(numberOfDice, dieSides, modifier, description)
	{
		this.Id = this.NewGuid();
		this.IsAttack = dieSides === 20;
		this.NumberOfDice = numberOfDice;
		this.DieSides = dieSides;
		this.Modifier = modifier;
		this.Description = description;
	}

	NewGuid()
	{
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
		{
		  var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		  return v.toString(16);
		});
	}
}