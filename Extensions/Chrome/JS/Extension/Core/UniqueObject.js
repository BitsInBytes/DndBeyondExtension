/*
	Anything that inherits from this will have a unique Id in memory
*/
class UniqueObject
{
    constructor()
    {
        this.Id = this.NewGuid();
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