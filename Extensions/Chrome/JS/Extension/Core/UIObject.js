/*
	Anything that inherits from this will have the ability to manipulate the dom 
*/
class UIObject
{
	AddClickToRollToElement(element, clickCallBack) {
		element.style('cursor', "pointer", 'important');
		element.style('color', 'DarkBlue', 'important');
		element.style('font-weight', "boldest", 'important');
		element.style('text-decoration', "underline", 'important');
		element.attr('title', "Click to roll");
		element.click(clickCallBack);
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