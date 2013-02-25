// The prompt is the bit that the user types in to. 
// The prompt is global to the DOM - highlander rules apply.
define(["ui/history"], function(history) {

var public = {};
var private = {};
var container_element = null;
var choices_mode = false;

private.template = "<input type='text' id='target' class='span10'></input>";

private.typeahead_fn = function() { return ["Default"]; };
private.callbacks = [];

public.register_typeahead = function( typeahead_fn ){
    private.typeahead_fn = typeahead_fn;
};

public.register_callback = function( callback_fn ){
    private.callbacks.push( callback_fn );
};

public.focus =  function() { 
    $("#target").focus();
};

public.hide = function(){
    $("#target").hide();
};

public.show = function(){
    if( !choices_mode ){
        $("#target").show();
    };
};

public.clear = function(){
    $("#target").val("");
};

public.val = function(){
    return $("#target").val();
};

public.hide_choices = function(){
    choices_mode = false;
    public.show();
    $(".choices").remove();
}

public.choices = function( object, choice_object, vertical ){
    choices_mode = true;
    $("#target").hide();
    $(".choices").remove();

    var btn_group = 'btn-group';
    if( vertical === true ){
        btn_group = 'btn-group-vertical';
    }

    var choices = $("<div class='choices btn-group "+btn_group+"'></div>");
    _.each( _.keys(choice_object), function(key){
        var choice = $("<button class='btn btn-large btn-inverse'>"+key+"</button>");
        var func = function(){
            history.append( "> " + key, "player");
            choice_object[key].apply(object); 
        }
        choice.click( func );
        choices.append( choice );
    });
    container_element.append( choices );
};

private.tab = function(evt){
    // If the user hits tab, put the first item from
    // the autocomplete into the #target bar, then 
    // hit enter.
    if( !choices_mode ){
        evt.preventDefault();
        var request = { 
            term: $("#target").val()
        };
        private.typeahead_fn( request, function(response){
            $("#target").val( response[0] );
            private.enter(evt);
        });
    }
};

private.enter = function(evt){
    var words = public.val();
    public.clear();
    public.hide();

    // Currently synchronous. Will look at asynchronous soon. 
    try{
        _.each( private.callbacks, function( callback_fn ){ callback_fn( words ); } ); 
    }
    catch(err){
        console.error( err.message );
        console.error( err );
    }

    $("#target").autocomplete( "close" );
    public.show();
    return evt;
};
public.enter = private.enter;

private.keypress = function(evt) {
    var TAB = 9;
    var ENTER = 13;
    switch(evt.keyCode){
        case TAB: 
            private.tab(evt);
            return;
        case ENTER:
            private.enter(evt);
            return;
        default:
            return evt;
    };
};

public.create = function( jquery_element ) {
    container_element = jquery_element; 
    // Add the element to the page.
    jquery_element.append(private.template);

    // Bind the enter function
    $("#target").bind('keydown', private.keypress);
    
    // Bind a function listing available options to the prompt. 
    $("#target").autocomplete({ 
        source:private.typeahead_fn, 
        minLength:0,
        delay: 0,
        position: { my : "right top", at: "right bottom" } })

    $(document).bind('keydown', public.focus);
};

return public;
});
