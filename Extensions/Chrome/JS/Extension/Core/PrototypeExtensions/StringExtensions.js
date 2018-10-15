String.prototype.regexReplaceAll = function(searchMask, replaceMask)
{
    var regEx = new RegExp(searchMask, "ig");
    return this.replace(regEx, replaceMask);
};

String.prototype.stringReplaceAll = function (target, replacement)
{
    return this.split(target).join(replacement);
};

String.prototype.toTitleCase = function ()
{
    return this.replace(/\w\S*/g, function (txt)
    {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};