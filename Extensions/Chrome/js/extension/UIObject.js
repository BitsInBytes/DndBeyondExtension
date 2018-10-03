/*
	Anything that inherits from this will have the ability to manipulate the dom 
*/
class UIObject
{
	AddClickToRollToElement(element, clickCallBack) {
		element.css('cursor', "pointer");
		element.css('color', "DarkRed");
		element.css('font-weight', "boldest");
		element.css('text-decoration', "underline");
		element.attr('title', "Click to roll");
		element.click(clickCallBack);
	}
}