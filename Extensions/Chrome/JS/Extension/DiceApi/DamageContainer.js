class DamageContainer
	extends UniqueObject
{
	constructor(damageRolls, effectRolls)
	{
		super();
		
		this.DamageRolls = damageRolls;
		this.EffectRolls = effectRolls;
	}

	Clone()
	{
		var damageRolls = [];
		this.DamageRolls.forEach(roll =>
		{
			damageRolls.push(roll.Clone());
		});

		if(this.EffectRolls === null)
		{
			return new DamageContainer(damageRolls, null);
		}

		var effectRolls = [];
		this.EffectRolls.forEach(roll =>
		{
			effectRolls.push(roll.Clone());
		});

		return new DamageContainer(damageRolls, effectRolls);
	}

	ToString()
	{
		var value = "";
		this.DamageRolls.forEach(roll =>
		{
			if(value === "")
			{
				value = roll.ToString();
			}
			else
			{
				value = `${value} | ${roll.ToString()}`;
			}
		});

		if(this.EffectRolls === null)
		{
			return value;
		}

		this.EffectRolls.forEach(roll =>
			{
				if(value === "")
				{
					value = roll.ToString();
				}
				else
				{
					value = `${value} | ${roll.ToString()}`;
				}
			});

		return value;
	}
}