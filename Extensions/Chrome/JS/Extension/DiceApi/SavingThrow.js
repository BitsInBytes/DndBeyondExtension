class SavingThrow
{
	constructor(dc, abilityType)
	{
		this.DC = dc;
		this.AbilityType = abilityType;
	}

	ToString()
	{
		return `${this.DC} ${this.AbilityType.toTitleCase()} Saving Throw`;
	}
}