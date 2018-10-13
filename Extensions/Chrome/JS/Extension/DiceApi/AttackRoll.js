class AttackRoll
	extends UniqueObject
{
	constructor(title, hitRoll, damageRolls, effectRolls)
	{
		super();
		
		this.Title = title;
		this.HitRoll = hitRoll;
		this.DamageRolls = damageRolls;
		this.EffectRolls = effectRolls;
	}

	Clone()
	{
		var damageRolls = [];
		this.DamageRolls.forEach(damageRoll => {
			damageRolls.push(damageRoll.Clone());
		});

		var effectRolls = [];
		this.EffectRolls.forEach(effectRoll => {
			effectRolls.push(effectRoll.Clone());
		});

		return new AttackRoll(this.Title, this.HitRoll.Clone(), damageRolls, effectRolls);
	}

	ToString()
	{
		var damageValue = "";
		this.DamageRolls.forEach(damageRoll => {
			damageValue = `${damageRoll.ToString()}`;
		});

		var effectValue = "";
		this.EffectRolls.forEach(effectRoll => {
			effectValue = `${effectValue} | ${effectRoll.ToString()}`;
		});

		`${this.ToHit.ToString()}${damageValue}${effectValue}`;
	}
}