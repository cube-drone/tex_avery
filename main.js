require(["ui/prompt", 
            "game/player",
            "game/journal", 
            "engine/command", 
            "engine/load", 
            "engine/sound", 
            "ui/history"], 
    function(prompt, player, journal, command, load, sound, history){

createjs.Sound.setMute(true);
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

    var histoggle = false;
    $("#toggle_history").click( function(){
        if( histoggle ){
            $("#history").css('overflow-y', 'hidden');
            histoggle = false;
        }
        else{
            $("#history").css('overflow-y', 'scroll');
            histoggle = true;
        }
        prompt.focus();
    });
    $("#view_journal").click( function(){
        var j = new journal();
        var j_text = "<ul class='journal'><li>"+j.get_journal().join("</li>\n<li>") + "</li></ul>";
        history.dialog( "Journal", j_text ); 
    });
    $("#toggle_sound").click( function(){
        if( sound.is_on() ){
            $("#target").val("mute sound");
            prompt.enter();
            prompt.focus();
        } else {
            $("#target").val("unmute sound");
            prompt.enter();
            prompt.focus();
        };
    });

});

});
