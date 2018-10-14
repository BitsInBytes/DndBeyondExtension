class DamageContainer
	extends UniqueObject
{
	constructor(damageRolls)
	{
		super();
		
		this.DamageRolls = damageRolls;
	}

	Clone()
	{
		var rolls = [];
		this.DamageRolls.forEach(roll => {
			rolls.push(roll.Clone());
		});

		return new DamageContainer(rolls);
	}

	ToString()
	{
		var value = "";
		this.DamageRolls.forEach(roll => {
			value = `${value} | ${roll.ToString()}`;
		});

		return value;
	}
}