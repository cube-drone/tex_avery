
define(["engine/core_object",
        "engine/registry",
        "engine/command",
        "ui/history"], function( core, registry, command, history){

var public = {};

public.fork = function(){
    this.name = "fork";
}
public.fork.prototype = new core();
public.fork.prototype.use_target = true;
public.fork.prototype.look_at = function(){
    history.append("It's a common kitchen fork. Silverware." );
    history.append("You keep it around, just in case you run into a particularly gullible werewolf.");
}
public.fork.prototype.eat = function(){
    history.append("With great difficulty, you eat the fork." );
    history.append("It punctures your good bits.");
    history.append("It strikes you, as you're holding on to your perforated stomach, that this was a terrible idea.");
    command.get_root().die();
};
public.fork.prototype.lick = function(){
    history.append("Nobody's using this bad-boy now!");
}
registry.register_object( "fork", public.fork );

public.inventory = function(){
    this.name = "inventory"; 
    this.base_setup();
    this.register_special_verb( 'inventory' );
};

public.inventory.prototype = new core();
public.inventory.prototype.setup = function(){
    var fork = new public.fork();
    this.add_child( fork );
}

public.inventory.prototype.look_at = function(){
    history.append( "You are carrying:" );
    _.each( this.visible_children(), function( child ){ 
        history.append( "&nbsp;<strong class='object'>"+child.name+"</strong>" );
    });
}
public.inventory.prototype.inventory = public.inventory.prototype.look_at;

registry.register_object( "inventory", public.inventory );

return public;
});
