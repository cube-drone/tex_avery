
// The History is the DOM list of all events. 
var history = {
    messages: [],
    authors: [],
    pagebreak: function() {
        $("#history").append( "<li class='pagebreak'> </li>" );
    },
    append: function(message, author){
        if(typeof(author) === 'undefined'){ author = "narrator" }
        history.messages.push(message);
        history.authors.push(message);
        $("#history").append( "<li class='"+author+"'>"+ message +" </li> " );
        $("#history").scrollTop($("#history")[0].scrollHeight);
    }
}

// The prompt is the bit that the user types in to. 
var prompt = {
    focus: function() { 
        $("#target").focus();
    },
    hide: function(){
        $("#prompt").hide();
    },
    show: function(){
        $("#prompt").show();
    },
    clear: function(){
        $("#target").val("");
    }
}

// Tools n' such
var tools = {
    wrappers: {
        event_bubble: function( fn ){
            return function( evt ){ fn(); return evt; } 
        }
    }
}

$(document).ready(function() {
    $("#target").focus();

    var request_response = function(request){
        history.append("Response");
        response_callback();
    }

    var list_of_options = function(){ 
        return ["Look at trees.", "Look at other, better trees.", "Fuck you."]; 
    }

    var response_callback = function(){
        prompt.show();
    }

    var enter = function(evt) {
        // If the typeahead is visible, enter shouldn't trigger nothin'
        if( $('.typeahead').is(":visible") ){
            return evt;
        }
        var words = $("#target").val();
        
        history.append( words, "player" );
        prompt.clear();
        prompt.hide();
        request_response(words);

        return evt;
    };

    // If the user hits a keyboard key anywhere in the document, move focus
    //      to the prompt element. 
    $(document).bind('keydown', tools.wrappers.event_bubble( prompt.focus ));

    $("#target").bind('keydown.return', enter);
    
    // Bind a function listing available options to the prompt. 
    $("#target").typeahead({ source:list_of_options })
});

