require(["prompt", "history"], function(prompt, history){

$(document).ready(function() {

    prompt.create( $("#prompt") );
    prompt.focus();
    history.append("Greetings, <strong>human</strong>.");

    prompt.register_callback( function(text){
        history.append( "> " + text, 'player');
        history.append("Response");
        return true;
    });

    prompt.register_typeahead( function(){
        return ["Look at trees.", "Look at other, better trees.", "Fuck you."]; 
    });

    // If the user hits a keyboard key anywhere in the document, move focus
    //      to the prompt element. 
    $(document).bind('keydown', prompt.focus );

});

});
