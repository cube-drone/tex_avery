// The prompt is the bit that the user types in to. 
// The prompt is global to the DOM - highlander rules apply.
define(function() {

var public = {};
var private = {};

private.template = "<input type='text' id='target' class='span9'></input>";

private.typeahead_fn = function() { return ["Default"]; };
private.typeahead = function() { return private.typeahead_fn(); };
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
    $("#target").show();
};

public.clear = function(){
    $("#target").val("");
};

public.val = function(){
    return $("#target").val();
};

private.enter = function(evt) {
    // If the typeahead is visible, enter shouldn't trigger nothin'
    if( $('.typeahead').is(":visible") ){
        return evt;
    }

    var words = public.val();
    public.clear();
    public.hide();

    // Currently synchronous. Will look at asynchronous soon. 
    _.each( private.callbacks, function( callback_fn ){ callback_fn( words ); } ); 

    public.show();
    return evt;
};

public.create = function( jquery_element ) {
    // Add the element to the page.
    jquery_element.append(private.template);

    // Bind the enter function
    $("#target").bind('keydown.return', private.enter);
    
    // Bind a function listing available options to the prompt. 
    $("#target").typeahead({ source: private.typeahead })
};

return public;
});
