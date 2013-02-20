
define(["engine/objects",
        "engine/load",
        "ui/history",
        "ui/prompt", 
        "game/room",
        "game/sound",
        "game/inventory", 
        "game/kitchen"], 
        function( objects, load, history, prompt, room, sound, inventory, kitchen){

objects.set_file( "game/player" );
var public = {};

var me = {
    init: function(){
        objects.set_root(this);
        var path_to_initial_location = "game/"+ this.get_state('current_location').name;
        room.change_location( path_to_initial_location, function(){
            load.load();   
        });
        if( this.get_state('initialized') ){
            history.append("Welcome back.");            
        };
    },
    special_verbs:["die", 
        "win", 
        "look_around", 
        "debug", 
        "help", 
        "reset_universe", 
        "get_ye_flask" ],
    setup:function(){
        var inv = new inventory.inventory();
        var kit = new kitchen.room();
        var sou = new sound.sound();
        this.add_child(inv);
        this.add_child(kit);
        this.add_child(sou);
        this.set_state('current_location', kit );
        this.hide_verb('decompose');
        this.hide_verb('reflect');
    },
    die: function(){
        history.append("You have died. Way to go.");
        history.append("Your only option at this point is to reset the universe.");
        this.remove_children();
        this.set_state("dead", true);
        this.show_verb('decompose');
    },
    win: function(){
        history.append("You have won. Way to go.");
        history.append("Take this moment to reflect; both winning and dying end the game - is there any difference? ");
        history.append("If you would like to try to win another way, try resetting the universe. ");
        this.remove_children();
        this.set_state("won", true);
        this.show_verb('reflect');
    },
    decompose: function(){
        history.append("You create a stink.");
    },
    reflect: function(){
        history.append("No, <em>you</em> reflect. We can't do it for you.");
    },
    look_around: function(){
        if( this.get_state('dead') ){
            history.append("You can't look around. You're dead.");
            return;
        }
        if( this.get_state('won') ){
            history.append("You've won the game. You can go home, now.");
            return;
        }
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
        if( this.get_state("dead") ){
            history.append("Nobody can help you. You're dead." );
            history.append("Try resetting the universe." );
        }
        else
        {
            history.append("Here are some commands you might try!", "help") 
            history.append("inventory - Check out what you're holding.", "help");
            history.append("reset universe - Completely reset the entire universe.", "help");
            history.append("help - See this page.", "help");
        };
    },
    reset_universe:function(){
        localStorage.clear();
        location.reload();
    },
    use:{
        'undefined': function(){
            history.append("<a href='http://www.youtube.com/watch?v=I9zpnLBtwwg'>Use me, use me, say that you'll use me.</a>");
        },
        'fork': function(){
            history.append("You fork yourself. Ow. Smooth.");
        },
        'stove': function(){
            history.append("No. That is an awful idea.");
        },
        'bacon': function(bacon){
            bacon.eat();
        },
        'toaster': function(){
            history.append("You .. toast yourself. It is excruciatingly painful.");
        }
    }
}

public.me = objects.add_to_universe( "me", me );

return public;

});
