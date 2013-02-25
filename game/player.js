
define(["engine/objects",
        "engine/load",
        "ui/history",
        "ui/prompt", 
        "game/room",
        "game/sound",
        "game/inventory", 
        "game/bathroom", 
        "game/definition"], 
        function( objects, load, 
                    history, prompt, 
                    room, sound, inventory, bathroom, definition){

objects.set_file( "game/player" );
var public = {};

var wound = {
    look_at: function(){
        history.append(["There's a fresh <strong class='object'>wound</strong> on your arm, scabbed over, approximately ", 
            " where your <strong class='object'>AuthentiCat</strong> should be. It's ",
            " scabbed over, and seems to be healing reasonablly well." ]);
    },
    poke: function(){
        history.append("You don't want to poke at it, but you just can't resist. Ouch.");
    },
    pick_at: function(){
        history.append([ "You peel at the forming scab on your arm. It's disgusting and a ",
            " little bit painful, but you can't help it. Neat. "] );
    },
};
public.wound = objects.add_to_universe( "wound", wound );

var gauze = { 
    look_at: function(){
        history.append("You have a strip of bloodied <strong class='object'>gauze</strong> wrapped around your arm.");
    },
    remove: function(){
        history.append(["You unwrap the gauze from your arm, discarding it, revealing ", 
            " a fresh <strong class='object'>wound</strong> in your arm, ",
            " approximately where your <strong class='object'>AuthentiCat</strong> should be. Oh, boy. This is bad. "]);
        this.parent().remove_child('gauze');
        this.parent().add_child( new public.wound() );
        objects.get_root().recursive_find("definition").show_verb("authenticat");
    }
};
public.gauze = objects.add_to_universe( "gauze", gauze );

// The 'me' is the root visible object of the universe. 
var me = {
    init: function(){
        objects.set_root(this);
        var path_to_initial_location = "game/"+ this.get_state('current_location').name;
        room.change_location( path_to_initial_location, function(){
            load.load();   
        });
        history.append("The <strong class='object'>sound</strong> is muted." );
    },
    special_verbs:["look_around", 
        "debug", 
        "help", 
        "reset_universe", 
        "get_ye_flask" ],
    setup:function(){
        var bath = new bathroom.room();
        var inv = new inventory.inventory();
        var snd = new sound.sound();
        var def = new definition.definitions();
        this.add_child(inv);
        this.add_child(bath);
        this.add_child(snd);
        this.add_child(def);
        this.add_child( new public.gauze() );
        this.set_state('current_location', bath );
    },
    look_around: function(){
        var current_location = this.get_state('current_location');
        if( typeof(current_location.look_at) !== "undefined" ){
            current_location.look_at();
        }
    },
    get_ye_flask: function(){
        history.append("You cannot get ye flask.");
    },
    debug: function(){
        console.log( "This:" );
        console.log( this );
        console.log( "Visible Children:" );
        console.log( this.visible_children() );
        console.log( "Current Location:" );
        console.log( this.get_state('current_location'));
    },
    help: function(){
        history.append("Here are some commands you might try!", "help") 
        history.append("<strong class='object'>look around</strong> - Look around.", "help");
        history.append("<strong class='object'>inventory</strong> - Check out what you're holding.", "help");
        history.append("<strong class='object'>reset universe</strong> - Completely reset the entire universe.", "help");
        history.append("<strong class='object'>help</strong> - See this page.", "help");
    },
    reset_universe:function(){
        localStorage.clear();
        location.reload();
    },
    use:{
        'undefined': function(){
            history.append("<a href='http://www.youtube.com/watch?v=I9zpnLBtwwg'>Use me, use me, say that you'll use me.</a>");
        },
        'bathroom_mirror': function(obj){
            obj.look_at();
        }
    }
}

public.me = objects.add_to_universe( "me", me );

return public;

});
