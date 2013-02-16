define(["engine/objects",
        "ui/history"], function( objects, history){

objects.set_file( "game/inventory" );
var app = history.append;

var public = {};

var fork = {
    look_at: function(){
        app("It's a common kitchen fork. Silverware." );
        app("You keep it around, just in case you run into a particularly gullible werewolf.");
    },
    eat: function(){
        app("With great difficulty, you eat the fork." );
        app("It punctures your good bits.");
        app("It strikes you, as you're holding on to your perforated stomach, that this was a terrible idea.");
        objects.get_root().die();
    },
    lick: function(){
        app("Nobody's using this bad-boy now!");
    },
}
public.fork = objects.add_to_universe( "fork", fork );

var inventory = {
    special_verbs: ['inventory'], 
    setup: function(){
        var fork = new public.fork();
        this.add_child( fork );
    },
    look_at: function(){ 
        app( "You are carrying:" );
        _.each( this.visible_children(), function( child ){ 
            app( "&nbsp;<strong class='object'>"+child.name+"</strong>" );
        });
    },
    inventory: function(){
        this.look_at();
    }
}
public.inventory = objects.add_to_universe( "inventory", inventory );

return public;
});
