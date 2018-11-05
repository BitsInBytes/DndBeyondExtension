//Todo:
//Damage container...contains effects?
//Saving throws (+obj / roller rewrite)
//Effect dies
//Testing new damage die changes
//Make each roll clickable
//Name clickable
//Execute actions rewrite

class Action
    extends UIObject
{
    static BuildAll()
    {
        var actions = [];

        $('.mon-stat-block__description-block').each(function()
        {
            $(this).find('.mon-stat-block__description-block-content').find('p').each(function()
            {
                var action = new Action($(this));

                if(action.Valid === true)
                {
                    actions.push(action);
                }
            });
        });

        return actions;
    }

    //Handles '.mon-stat-block__description-block-content' ~> <p>
    constructor(element)
    {
        super();

        this.Description = element.text().toLowerCase().trim();

        var name = this.MatchFirstAndRebuild(/^[a-zA-z0-9\s\(\)\-\–]{1,}\./g);

        if(name.toLowerCase() == "variant")
        {
            this.Valid = false;
        }
        else
        {
            this.Valid = true;
            this.Element = element;
            this.Name = name.replace('.','');
            this.AttackContainer = this.BuildAttackContainer();

            console.table(this.AttackContainer);

            this.Rollable = false;

            // if(this.RollContainer.DamageRolls !== null)
            // {
            //  this.Rollable = true;
            //  this.InjectClickToRollIntoDom();
            // }
        }
    }

    MatchFirstAndRebuild(regex)
    {
        var match = this.Description.match(regex);

        if(match === null)
        {
            return null;
        }

        //Take the "unprocessed" part of the description
        this.Description = this.Description.split(match[0]).join();;

        return match[0]
    }

    BuildAttackContainer()
    {
        var effectRolls = this.BuildRechargeEffectRoll();
        effectRolls = this.BuildEffectRolls(effectRolls);
        
        var toHitRoll = this.BuildToHitRoll();
        var damageRolls = this.BuildDamageContainers();

        return new AttackContainer(this.Name, toHitRoll, damageRolls, effectRolls);
    }

    BuildRechargeEffectRoll()
    {
        if(this.Name.includes("recharge"))
        {
            return new 
            [
                new Roll(1, 6, 0, "To Recharge")
            ]
        }

        return null;
    }

    BuildToHitRoll()
    {
        var toHit = this.MatchFirstAndRebuild(/(?:\+|\-)\d{1,}\sto\shit/g);

        if(toHit === null)
        {
            return null;
        }

        var reach = this.MatchFirstAndRebuild(/reach\s\d{1,}\sft\.\sor\srange\s[0-9/]{1,}\sft\./g);

        if(reach === null)
        {
            var reach = this.MatchFirstAndRebuild(/reach\s[0-9/]{1,}\sft/g);
        }

        if(reach === null)
        {
            var reach = this.MatchFirstAndRebuild(/range\s\d{1,}\sft\.\sor\srange\s[0-9/]{1,}\sft\./g);
        }

        if(reach === null)
        {
            var reach = this.MatchFirstAndRebuild(/range\s[0-9/]{1,}\sft/g);
        }

        var modifier = parseInt(toHit.replace('+','').replace(' to hit',''));

        return new HitRoll(modifier, "to hit", reach)
    }

    BuildDamageContainers()
    {
        var savingThrow = this.Description.match(/\sDC\s\d{1,}\s\w{1,}\ssaving\sthrow/g);
        var savingThrowText = null;

        if(savingThrow !== null)
        {
            var textParts = this.Description.split(/\sDC\s\d{1,}\s\w{1,}\ssaving\sthrow/g);
            this.Description = textParts.shift();
            savingThrowText = textParts.join();
        }

        //Splits the different damage choices so each can be processed
        var damageBodies = this.Description.split(/ damage, or /g);

        var damageContainers = [];
        var action = this;

        damageBodies.forEach(function(text) 
        {
            text = `${text} damage`;

            var damageContainer = action.BuildDamageContainer(text)                                                                                                                                    
            if(damageContainer !== null)
            {
                damageContainers.push(damageContainer);
            }
        });

        if(savingThrowText !== null)
        {
            var damageContainer = action.BuildDamageContainer(savingThrowText, savingThrow)                                                                                                                                    
            if(damageContainer !== null)
            {
                damageContainers.push(damageContainer);
            }
        }

        if(damageContainers.length !== 0)
        {
            return damageContainers;
        }

        return null;
    }

    BuildDamageContainer(rawRollText, savingThrow = null)
    {
        var rawDamageRolls = rawRollText.match(/\(\d{1,}d\d{1,}(?:\s(?:\+|\-)\s\d\)|\))\s\w{1,}\sdamage/g);

        if(rawDamageRolls === null)
        {
            return null;
        }

        var damageRolls = [];
        var action = this;

        rawDamageRolls.forEach(function(damageRollText)
        {
            damageRolls.push(action.BuildRoll(damageRollText));
        });

        return damageRolls;
    }

    BuildEffectRolls(effectRolls)
    { 
        var rawEffectRolls = this.Description.match(/\s\d{1,}d\d{1,}\s\w{1,}/g);

        if(rawEffectRolls === null)
        {
            return effectRolls;
        }

        var action = this;

        if(effectRolls === null)
        {
            effectRolls = [];
        }

        rawEffectRolls.forEach(function(damageRollText)
        {
            effectRolls.push(action.BuildRoll(damageRollText));
        });

        return damageRolls;
    }

    BuildRoll(rollText)
    {
        var sections = rollText.match(/[\w+-]{1,}/g);
        var dice = sections[0];
        var modifier = 0;
        var damageType = sections[3]

        //Contains modifier
        if(sections.length > 3)
        {
            var modOp = sections[1];
            var mod = sections[2];

            if(modOp === '+')
            {
                modifier = parseInt(mod);
            }
            else
            {
                modifier = parseInt(mod) * -1;
            }
        }

        var diceSplit = dice.split('d');
        var numberOfDice = parseInt(diceSplit[0]);
        var sidesOfDice = parseInt(diceSplit[1]);

        var roll = new DamageRoll(numberOfDice, sidesOfDice, modifier, damageType);

        return roll;
    }

    ExecuteRollContainer()
    {
        var attackRoll = this.RollContainer.AttackContainer;
        var damageRolls = this.RollContainer.DamageRolls;
        var mainAction = {};

        if(attackRoll === null)
        {
            mainAction =
            {
                Title: this.Name,
                MainRoll:
                {
                    Dice: 0,
                    LinkedRolls: [],
                    DiceFound: false
                }
            };
        }
        else
        {
            mainAction =
            {
                Title: this.Name,
                MainRoll:
                {
                    Description: attackRoll.Description,
                    Dice: attackRoll.NumberOfDice,
                    Sides: attackRoll.DieSides,
                    Modifier: attackRoll.Modifier,
                    LinkedRolls: []
                }
            };
        }

        damageRolls.forEach(function(damageContainer)
        {
            mainAction.MainRoll.LinkedRolls.push(
            {
                Description: damageContainer.Description,
                Dice: damageContainer.NumberOfDice,
                Sides: damageContainer.DieSides,
                Modifier: damageContainer.Modifier
            });
        });

        ExecuteActions([mainAction]);
    }

    InjectClickToRollIntoDom()
    {
        this.Rollable = true;
        var action = this;
        
        this.AddClickToRollToElement(this.Element.find('.action_title'), function()
        { 
            action.ExecuteRollContainer();
        });

        this.RollContainer.DamageRolls.forEach(function(roll)
        {
            action.AddClickToRollToElement($(`.${roll.Id}`), function()
            { 
                ExecuteActions(
                [{
                    Title: action.Name,
                    MainRoll: {
                        Dice: 0,
                        LinkedRolls: [{
                            Description: roll.Description,
                            Dice: roll.NumberOfDice,
                            Sides: roll.DieSides,
                            Modifier: roll.Modifier
                        }],
                        DiceFound: false
                    }
                }]);
            });
        });
    }
}