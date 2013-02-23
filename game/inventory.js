define(["engine/objects",
        "ui/history"], function( objects, history){

objects.set_file( "game/inventory" );
var app = history.append;

var public = {};

var inventory = {
    special_verbs: ['inventory'], 
    setup: function(){
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
