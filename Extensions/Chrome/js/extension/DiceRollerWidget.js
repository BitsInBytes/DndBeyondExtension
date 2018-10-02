class DiceRollerWidget{

	"use strict";

    constructor() {    }

    static LoadWidget()
    {
        console.info("creating widget");

        if (GLOBAL_SETTINGS_OBJECT.DndBeyond_DiceRollerWidgetVerticalEnabled === false) {
            var options_width = 485; //Horizontal
        } else { 
            var options_width = 200; //Vertical
        }
    
        //Create widget
        var dialog = $(`<div id='DiceRollerWidget'>${DiceRollerWidget.getDiceRollerHtml()}</div>`)
                        .dialog({
                            modal: false,
                            resizable: false,
                            draggable: true,
                            width: options_width
                        })
                        .dialogExtend({
                            closable: true,
                            maximizable: false,
                            minimizable: true,
                            minimizeLocation: "left",
                            collapsable: false,
                            dblclick: "minimize"
                        });

        var dialogContainer = dialog.parent();
    
        //As DDB places global styles, we need to globally override ours after the fact
        var widget = $('#DiceRollerWidget');
        var widget_non_input_elements = widget.find("*").not('input').not('button');
        widget_non_input_elements.css('margin', '0px');
        widget_non_input_elements.css('padding', '0px');
        widget_non_input_elements.css('background-color', 'white');
        widget_non_input_elements.css('border-style', 'none');
    
        //Set header bar size
        var titleBar = dialogContainer.find(".ui-dialog-titlebar");
        titleBar.css('height', '2px');
        titleBar.css('padding', '0px');
    
        //Set header text
        titleBar.html(`<span id="ui-id-2" class="ui-dialog-title" style="float: left; margin-top:2px;"><img src="${chrome.extension.getURL("images/icon48.png")}" width="20" height="20" style="margin-bottom:5px; margin-left: 5px;" alt="D&amp;D Beyond Interaction" title="D&amp;D Beyond Interaction"/>  Dice Roller</span>`);
    
        //Header images
        var closeImage = `<img src="${chrome.extension.getURL("images/close_icon.png")}" width="15" height="15" alt="X" title="Close"/>`;
        var restoreImage = `<img src="${chrome.extension.getURL("images/restore_icon.png")}" width="15" height="15" alt="[]" title="Restore"/>`;
        var minimizeImage = `<img src="${chrome.extension.getURL("images/minimize_icon.png")}" width="15" height="15" alt="_" title="Minimize"/>`;
    
        //Create header buttons
        dialogContainer.find(".ui-dialog-titlebar").append(`<button type="button" class="widget-close-button ui-button ui-corner-all ui-widget ui-button-icon-only" title="Close" style="background-color: #bf3333; padding:4px; float: right; margin-top:4px; margin-right: 5px;">${closeImage}</button>`);
        dialogContainer.find(".ui-dialog-titlebar").append(`<button type="button" class="widget-minimize-restore-button css-state-restore ui-button ui-corner-all ui-widget ui-button-icon-only" style="background-color: blueviolet; padding:4px; float: right; margin-top:4px; margin-right: 5px;">${restoreImage}</button>`);

        //Close button function
        dialogContainer.find('.widget-close-button').click(function () {
            dialog.dialog('close');
        });

        //Restore / Minimize toggle function
        let restore_minimize_button = dialogContainer.find('.widget-minimize-restore-button');

        restore_minimize_button.click(function () {
            //Toggle
            if (restore_minimize_button.hasClass("css-state-restore")) {
                restore_minimize_button.removeClass("css-state-restore");
                restore_minimize_button.html(minimizeImage);
                dialog.dialogExtend('restore');
    
                dialog.dialog("option", "position", { my: "center", at: "center", of: window });
    
            } else {
                restore_minimize_button.addClass("css-state-restore");
                restore_minimize_button.html(restoreImage);
                dialog.dialogExtend('minimize');
            }
        });
    
        DiceRollerWidget.setUpDiceRollerEvents();
    
        //Allow it to follow scroll
        dialogContainer.style('position', 'fixed', 'important');
    
        //Minimize to tray
        dialog.dialogExtend('minimize');
    }

    static getDiceRollerHtml() {
        var getDiceRollerDie = (die) => {
            return `
                <td style="width:33%;">
                    <center>
                        <table style="width: 150px;">
                            <tr>
                                <td>
                                    <center>
                                        <img id="d${die}_img" src="${chrome.extension.getURL(`images/d${die}.png`)}" alt="D${die}" title="D${die}" style="cursor: pointer" height="50" width="50"/>
                                        <table>
                                            <tr>
                                                <td style="vertical-align: middle;">
                                                    <center>
                                                        <div># Dice</div>
                                                        <input style="width:60px; text-align: center;" type="number" id="d${die}_dice" step="1" max="300" min="0" value="0">
                                                    </center>
                                                </td>
                                                <td style="vertical-align: middle;">
                                                    <center>
                                                        <div>Modifier</div>
                                                        <input style="width:60px; text-align: center;" type="number" id="d${die}_mod" step="1" max="1000" min="-1000" value="0">
                                                    </center>
                                                </td>
                                            </tr>
                                        </table>
                                    </center>
                                 </td>
                            </tr>
                        </table>
                    </center>
                </td>`;
        };

        var roll_reset_buttons = `
            <br />
            <table style="width: 100%;">
                <tr>
                    <td style="width:50%;">
                        <center>
                            <button id="diceRollerRollButton" class="character-button-block" style="width:120px;" autofocus>Roll</button>
                        </center>
                    </td>
                    <td style="width:50%;">
                        <center>
                            <button id="diceRollerResetButton" class="character-button-block" style="width:120px;">Reset</button>
                        </center>
                    </td>
                </tr>
            </table>
        `;

        if (GLOBAL_SETTINGS_OBJECT.DndBeyond_DiceRollerWidgetVerticalEnabled === false) {
            //Horizontal
            return `
            <p>
                 <table style="width: 100%;">
                     <tr>
                         ${getDiceRollerDie(4)}
                         ${getDiceRollerDie(6)}
                         ${getDiceRollerDie(8)}
                     </tr>
                 </table>
                 <br />
                 <table style="width: 100%;">
                     <tr>
                         ${getDiceRollerDie(10)}
                         ${getDiceRollerDie(12)}
                         ${getDiceRollerDie(20)}
                     </tr>
                 </table>
                 ${roll_reset_buttons}
             </p>`;
    
        } else {
            //Vertical
            var buildVertDieTable = (die) => {
                return `
                    <table style="width: 100%;">
                        <tr>
                            ${getDiceRollerDie(die)}
                         </tr>
                    </table>`;
            };

            return `
            <p>
                ${buildVertDieTable(4)}
                <br />
                ${buildVertDieTable(6)}
                <br />
                ${buildVertDieTable(8)}
                <br />
                ${buildVertDieTable(10)}
                <br />
                ${buildVertDieTable(12)}
                <br />
                ${buildVertDieTable(20)}
                ${roll_reset_buttons}
            </p>`;
        }
    }

    static setUpDiceRollerEvents() {
        $("#diceRollerRollButton").click(function () {
            var buildActionContainersFromDiceRoller = () => {
                var buildActionContainerFromDie = (die) => {
                    return {
                        Title: `D${die}`,
                        MainRoll: {
                            Description: "",
                            Dice: Number($(`#d${die}_dice`).val()),
                            Sides: Number(die),
                            Modifier: Number($(`#d${die}_mod`).val())
                        }
                    }
                };
        
                var actions = [];
                var tempActions = [
                    buildActionContainerFromDie(4),
                    buildActionContainerFromDie(6),
                    buildActionContainerFromDie(8),
                    buildActionContainerFromDie(10),
                    buildActionContainerFromDie(12),
                    buildActionContainerFromDie(20)
                ];
            
                $.each(tempActions, function (index) {
                    if (tempActions[index].MainRoll.Dice != 0) {
                        actions.push(tempActions[index]);
                    }
                });
            
                return actions;
            };

            var actions = buildActionContainersFromDiceRoller();
    
            if (actions.length === 0) {
                return;
            }
    
            ExecuteActions(actions);
        });

        var resetDie = (die) => {
            $(`#d${die}_dice`).val('0');
            $(`#d${die}_mod`).val('0');
        };
    
        $("#diceRollerResetButton").click(function () {
            resetDie(4);
            resetDie(6);
            resetDie(8);
            resetDie(10);
            resetDie(12);
            resetDie(20);
        });

        var hookDiceRollerDieActions = (die) =>
        {
            var hookDiceRollerElementWithMouseWheel = (element) => {
                element.on("mousewheel", function (event) {
                    event.preventDefault();
                    var currentElement = $(this);
                    var inc = parseFloat(currentElement.attr('step'));
                    var max = parseFloat(currentElement.attr('max'));
                    var min = parseFloat(currentElement.attr('min'));
                    var currVal = parseFloat(currentElement.val());
            
                    // If blank, assume value of 0
                    if (isNaN(currVal)) {
                        currVal = 0.0;
                    }
            
                    // Increment or decrement numeric based on scroll distance
                    if (event.deltaFactor * event.deltaY > 0) {
                        if (currVal + inc <= max) {
                            currentElement.val(currVal + inc);
                        }
                    } else {
                        if (currVal - inc >= min) {
                            currentElement.val(currVal - inc);
                        }
                    }
                });
            };

            hookDiceRollerElementWithMouseWheel($(`#d${die}_dice`));
            hookDiceRollerElementWithMouseWheel($(`#d${die}_mod`));
        
            $(`#d${die}_img`).click(function () {
                ExecuteActions([{
                    Title: `D${die}`,
                    MainRoll: {
                        Description: "",
                        Dice: 1,
                        Sides: Number(die),
                        Modifier: 0
                    }
                }]);
            });
        };
    
        hookDiceRollerDieActions(4);
        hookDiceRollerDieActions(6);
        hookDiceRollerDieActions(8);
        hookDiceRollerDieActions(10);
        hookDiceRollerDieActions(12);
        hookDiceRollerDieActions(20);
    }
}