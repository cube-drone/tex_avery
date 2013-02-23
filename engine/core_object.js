// Core object for objects in the universe. 

define(["engine/state",
        "engine/registry"], function(state, registry){

var InteractiveObject = {};

// Every subclass of Interactive Object must define a name
//   and call 'base_setup'. 
// It's important to note that object initialization logic
//   shouldn't go in here - this function will be called 
//   _every single time_ that the object becomes a visible 
//   part of the game's hierarchy. Close the fridge door and
//  open it again? The "new orange();" call may occur. 
// Instead, setup belongs in the 'setup' function. Override that.
InteractiveObject = function(){
    this.name = "interactive_object";  
    this.base_setup();
};
registry.register_object( "interactive_object", InteractiveObject );

// IO is a subclass of WithState. 
//   every IO object has a name and state.
InteractiveObject.prototype = new state.WithState();

// Do not override this class. 
InteractiveObject.prototype.base_setup = function() {
    if( ! this.get_state("initialized") ){
        this.setup();
        this.set_state("initialized", true );
    }
}

// Include this object when listing things to use on other things.
InteractiveObject.prototype.use_target = function(){
    return ( typeof( this.use ) !== 'undefined' );   
};

// Override this class if you want to perform actions the _first time_
// that the object is created. 
InteractiveObject.prototype.setup = function() {
    return;
}

// Children is a list of Direct Descendants of this object. 
InteractiveObject.prototype.children = function() {
    return this.get_state("contains");
}

// The list of ALL visible descendants of this object. 
InteractiveObject.prototype.visible_children = function(){
    var hidden_objects = this.get_state("hidden_objects");
    var children = _.filter( this.children(), function(item){
        return !_.contains( hidden_objects, item.name );
    });
    _.each( children, function(child){
        if( typeof(child) !== 'undefined' && typeof(child.visible_children) !== 'undefined'){
            children = _.union( children, child.visible_children() );
        }
    });
    return children; 
};

// Find an object in this object's tree. 
InteractiveObject.prototype.recursive_find = function recursive_find(noun){
    if (this.name === noun){
        return this;
    }
    var visible_children = this.visible_children();
    if (visible_children.length > 0){
        var results = _.map(visible_children, 
            function(child){ return child.recursive_find(noun); }); 
        var list = _.filter( results, function( result ){ return result; } );
        if( list.length > 0 ){
            return list[0];
        }
    }
    return false;
};

InteractiveObject.prototype.parent = function( obj ){
    return this.get_state( "parent" );
};

InteractiveObject.prototype.add_child = function( obj ){
    var children = this.children();
    if(!_.any( children, function(child) {return child.name === obj.name;})){
        obj.set_state( "parent", this);
        children.push(obj);
        this.set_state("contains", children );
        return true;
    }
    return false;
};

InteractiveObject.prototype.remove_child = function( obj ){
    if( typeof(obj) !== "string" ){
        obj = obj.name;
    }
    var children = _.reject(this.children(), function(child){
        return obj === child.name;
    });
    this.set_state("contains", children);
};

InteractiveObject.prototype.remove_children = function(){
    this.set_state("contains", [] );
}

InteractiveObject.prototype.has_child = function( obj ){
    if( typeof(obj) !== "string" ){
        obj = obj.name;
    }
    return _.any( this.children(), function(child){
        return child.name === obj;
    });
}

InteractiveObject.prototype.has_visible_child = function( obj ){
    if( typeof(obj) !== "string" ){
        obj = obj.name;
    }
    return _.any( this.visible_children(), function(child){
        return child.name === obj;
    });
}

InteractiveObject.prototype.hide_child = function( obj ){
    if( typeof(obj) !== "string" ){
        obj = obj.name;
    }
    var hidden_children = this.get_state("hidden_objects");
    if(!_.any( hidden_children, function(hidden_child) {
            return hidden_child === obj;})){
        hidden_children.push(obj);
        this.set_state("hidden_objects", hidden_children );
        return true;
    }
    return false;
};

InteractiveObject.prototype.show_child = function( obj ){
    if( typeof(obj) !== "string" ){
        obj = obj.name;
    }
    var hidden_children = _.filter(this.get_state("hidden_objects"), function(child){
        return obj !== child;
    });
    this.set_state("hidden_objects", hidden_children);
};

// The list of verbs is calculated as :
//   the list of all functions _minus_ the list of functions that 
//   exist in the InteractiveObject prototype. 
// So, every function of a InteractiveSubject subclass is a verb, by
//   default. 
InteractiveObject.prototype.verbs = function(){ 
    return _.difference( _.keys( this.__proto__ ), 
                        _.keys( InteractiveObject.prototype ) );
}

// Only show verbs that haven't been hidden with 'hide_verb'. 
InteractiveObject.prototype.visible_verbs = function(){
    var hidden_verbs = this.get_state("hidden_verbs");
    return _.filter( this.verbs(), function( verb ){
        return !_.contains( hidden_verbs, verb );
    });
};

// Verbs can be hidden by calling "hide_verb" with that verb's name.
InteractiveObject.prototype.hide_verb = function( verb ){
    var hidden_verbs = this.get_state("hidden_verbs");
    if(!_.any( hidden_verbs, function(hidden_verb) {return hidden_verb === verb;})){
        hidden_verbs.push(verb);
        this.set_state("hidden_verbs", hidden_verbs );
        return true;
    }
    return false;
};

InteractiveObject.prototype.show_verb = function( verb ){
    var hidden_verbs = _.filter(this.get_state("hidden_verbs"), function(v){
        return v != verb;
    });
    this.set_state("hidden_verbs", hidden_verbs);
};

// Special commands don't require the noun. 
//  So, 'kitchen.go_north' would normally be activated by "go north kitchen"
//  but if it's registered as a special command in the constructor, 
//  it would instead be activated by 'go north'. 
InteractiveObject.prototype.register_special_verb = function( verb ){
    if( typeof( this.special_verbs ) === 'undefined') {
        this.special_verbs = [];
    }
    this.special_verbs.push( verb );
    this.hide_verb( verb );
}

InteractiveObject.prototype.get_special_verbs = function(){
    if( typeof( this.special_verbs ) === 'undefined') {
        return [];
    }
    return this.special_verbs;
}

InteractiveObject.prototype.delete = function(){
    if( this.get_state("parent") === null ){
        console.error("Cannot delete element without parent.");
    }
    this.get_state("parent").remove_child(this);
};

return InteractiveObject;
});
