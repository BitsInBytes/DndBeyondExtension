/*
	Anything that inherits from this will have the ability to manipulate the dom 
*/
class UIObject
	extends UniqueObject
{
	constructor()
	{
		super();
	}

	AddClickToRollToElement(element, clickCallBack)
	{
		element.style('cursor', "pointer", 'important');
		element.style('color', 'DarkBlue', 'important');
		element.style('font-weight', "boldest", 'important');
		element.style('text-decoration', "underline", 'important');
		element.attr('title', "Click to roll");
		element.click(clickCallBack);
	}
}