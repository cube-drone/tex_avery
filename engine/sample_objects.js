// Sample objects for use in testing.
define(["engine/core_object",
        "engine/registry", 
        "ui/history"], function(core_object, registry, history){

var sample_objects = {}

sample_objects.orange = function(){
    this.name = "orange";    
    this.base_setup();
    this.register_special_verb( 'think_orangey_thoughts' );
};
sample_objects.orange.prototype = new core_object();
sample_objects.orange.prototype.use_target = true;
sample_objects.orange.prototype.look_at = function(){
    history.append("It's .. orange." );
}
sample_objects.orange.prototype.eat = function(){
    history.append("The orange is delicious.");
    this.delete();
}
sample_objects.orange.prototype.think_orangey_thoughts = function(){
    history.append("Your mind turns to thoughts of orange.");
}
registry.register_object( "orange", sample_objects.orange );

sample_objects.fridge = function(){
    this.name = "fridge";
    this.base_setup();
};
sample_objects.fridge.prototype = new core_object();
sample_objects.fridge.prototype.setup = function(){
    this.hide_verb("close");
    var orange = new sample_objects.orange();
    this.add_child( orange );
    this.hide_child( orange );
}
sample_objects.fridge.prototype.use_target = true;
sample_objects.fridge.prototype.default_state = {
    open: false,
};
sample_objects.fridge.prototype.smell = function() {
    history.append("It smells fridgy.");
};
sample_objects.fridge.prototype.eat = function() {
    history.append("You can't fit the entire thing in your mouth.");
};
sample_objects.fridge.prototype.look = function() {
    if( ! this.get_state('open') ){ 
        history.append("It's a Fridgit Jones 5000.");
    }
    else{
        history.append("It's an open Fridgit Jones 5000.");
        if(this.has_child('orange')){
            history.append("There's an orange in there. ");
        }
    }
};
sample_objects.fridge.prototype.open = function() {
    if( ! this.get_state('open') ){
        this.set_state('open', true); 
        this.show_verb("close");
        this.hide_verb("open");
        history.append( "You open the fridge." );
        this.show_child( "orange" );
        if( this.has_child( "orange" ) )
        {
            history.append( "There's an orange in there." );
        }
    }
    else{
        history.append( "The fridge remains open." );
    }
};
sample_objects.fridge.prototype.close = function() {
    if( this.get_state('open') ){
        this.set_state('open', false); 
        this.show_verb("open");
        this.hide_verb("close");
        history.append( "You close the fridge.");
        this.hide_child( "orange" );
    }
    else{
        history.append( "The fridge remains closed.");
    }
};
sample_objects.fridge.prototype.take = function() {
    history.append( "The fridge is a little too heavy for that." );
};
sample_objects.fridge.prototype.use = function(obj){
    if( typeof(obj) === "undefined" ){
        history.append( "Use the fridge? Okay. You use it." );
    }
    else if( obj.name === "orange" ){
        history.append( "You rub the orange sensually against the fridge." );
    }
    else{
        history.append( "I'm not sure how to use that on the orange." );
    }
};

registry.register_object( "fridge", sample_objects.fridge );

return sample_objects;
});
