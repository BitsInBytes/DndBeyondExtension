class DamageRoll
	extends UniqueObject
{
	constructor(rolls)
	{
		super();
		
		this.Rolls = rolls;
	}

	Clone()
	{
		var rolls = [];
		this.Rolls.forEach(roll => {
			rolls.push(roll.Clone());
		});

		return new DamageRoll(rolls);
	}

	ToString()
	{
		var value = "";
		this.Rolls.forEach(roll => {
			value = `${value} | ${roll.ToString()}`;
		});

		return value;
	}
}