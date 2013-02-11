require(["prompt", "core_object", "command", "history"], function(prompt, core_object, command, history){

$(document).ready(function() {

    prompt.create( $("#prompt") );
    prompt.focus();
    history.append("You're in a room with a <strong>fridge</strong>.");
    
    var fridge = new core_object.sample_objects.fridge();        
    command.set_root( fridge );

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
