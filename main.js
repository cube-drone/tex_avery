require(["ui/prompt", "game/player", "engine/command", "ui/history"], 
    function(prompt, player, command, history){

$(document).ready(function() {

    prompt.register_callback( function(text){
        history.append( "> " + text, 'player');
        command.command(text);
        return true;
    });

    prompt.register_typeahead( function(request, response){
        response( _.filter( command.get_actions(), function(action){
            return action.indexOf(request.term.toLowerCase()) !== -1;   
        })); 
    });
    
    prompt.create( $("#prompt") );
    prompt.focus();
    
    var me = new player.me();

    // If the user hits a keyboard key anywhere in the document, move focus
    //      to the prompt element. 
    $(document).bind('keydown', prompt.focus );

});

});
