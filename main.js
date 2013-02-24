require(["ui/prompt", "game/player", "engine/command", "engine/load", "ui/history"], 
    function(prompt, player, command, load, history){

var version_check = function(){
    var major_version = "Hormel";
    var minor_version = "2";

    var local_major = localStorage['major_version'];
    var local_minor = localStorage['minor_version'];
        
    if( local_major !== major_version || typeof(local_major) === 'undefined' ||
        local_minor !== minor_version || typeof(local_minor) === 'undefined' ){
        localStorage.clear();
        console.log("Version change. Restarting universe." );
        localStorage['major_version'] = major_version;
        localStorage['minor_version'] = minor_version;
        location.reload();
    }
}

version_check();

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
