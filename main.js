require(["ui/prompt", "game/player", "engine/command", "ui/history"], 
    function(prompt, player, command, history){

$(document).ready(function() {

    prompt.create( $("#prompt") );
    prompt.focus();
    
    var me = new player.me();
    command.set_root( me );
    me.look_around();

    prompt.register_callback( function(text){
        history.append( "> " + text, 'player');
        command.command(text);
        return true;
    });

    prompt.register_typeahead( function(){
        return command.get_actions(); 
    });

    // If the user hits a keyboard key anywhere in the document, move focus
    //      to the prompt element. 
    $(document).bind('keydown', prompt.focus );

});

});
