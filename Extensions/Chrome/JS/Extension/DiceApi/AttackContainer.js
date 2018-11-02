class AttackContainer
	extends UniqueObject
{
	constructor(title, hitRoll, damageContainers, effectRolls)
	{
		super();
		
		this.Title = title;
		this.HitRoll = hitRoll;
		this.DamageContainers = damageContainers;
		this.EffectRolls = effectRolls;
	}

	Clone()
	{
		var damageRolls = [];
		this.DamageContainers.forEach(damageContainer =>
		{
			damageRolls.push(damageContainer.Clone());
		});

		var effectRolls = [];
		this.EffectRolls.forEach(effectRoll => 
		{
			effectRolls.push(effectRoll.Clone());
		});

		return new AttackContainer(this.Title, this.HitRoll.Clone(), damageRolls, effectRolls);
	}

	ToString()
	{
		var damageValue = "";
		this.DamageContainers.forEach(damageContainer => 
		{
			damageValue = `${damageContainer.ToString()}`;
		});

		var effectValue = "";
		this.EffectRolls.forEach(effectRoll => 
		{
			effectValue = `${effectValue} | ${effectRoll.ToString()}`;
		});

		`${this.ToHit.ToString()}${damageValue}${effectValue}`;
	}
}