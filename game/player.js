
define(["engine/objects",
        "engine/load",
        "ui/history",
        "ui/prompt", 
        "game/room",
        "game/sound",
        "game/inventory", 
        "game/bathroom"], 
        function( objects, load, history, prompt, room, sound, inventory, bathroom){

objects.set_file( "game/player" );
var public = {};

var wound = {
    special_verbs: ["what_is_an_authenticat"],
    look_at: function(){
        history.append(["There's a fresh wound on your arm, scabbed over, approximately ", 
            " where your AuthentiCat should be. "]);
    },
    what_is_an_authenticat: function(){
        // TODO: first of all, this displays like ass.
        // TODO: second of all, the code looks ugly. 
        history.append("You reflect on what an AuthentiCat is. ", "narrator", " "+
"Being as everybody is net-savvy at this point, and everything "+ 
"is online at this point, the problems of authentication and " +
"authorization have become more and more crucial to address. <br/>" +
"Passwords are just so easy to break, and maintaining dozens " +
"and dozens of user-name/password pairs becomes unwieldy when " +
"one's life is distributed amongst dozens of different systems. " +
"In 2017, a small bio-tech firm, AuthentiCat (the logo of which " +
" is a small black cat with a lock for a head), released a consumer "+
" grade sub-dermal chip system.  Based on public-key crypto, each " +
" sub-dermal chip contains a password-protected private key and a " +
" Bluetooth connection that can be used to authenticate the user " +
" to a variety of sources. <br/>" +
" While there are security concerns - no system is unhackable - " +
" the AuthentiCat chips have proven more secure than most chip-and-pin " +
" systems, and financial providers have started to phase out cards in " +
" favour of AuthentiCats. Particularly paranoid " +
" users can keep their AuthentiCats extra-dermally, (key-chain FOBs " +
" being a particularly popular option) but these units are much " +
" more prone to theft. <br/> " +
" In 2023 the United States mandated AuthentiCat passports for "+
" travellers into the country. in order to smooth over border "+
" tensions after the 2018 Liberty Bell Incident. <br />  "+
" At this point, just about everything in one's life can comfortably "+
" be authenticated and authorized with an AuthentiCat. Many people"+
" have their entire lives attached to this one single private key. " );
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
        history.append("You have a strip of bloodied gauze wrapped around your arm.");
    },
    remove: function(){
        history.append(["You unwrap the gauze from your arm, discarding it, revealing ", 
            " a fresh <strong class='object'>wound</strong> in your arm, ",
            " approximately where your AuthentiCat should be. Oh, boy. This is bad. "]);
        this.parent().remove_child('gauze');
        this.parent().add_child( new public.wound() );
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
        if( this.get_state('initialized') ){
            history.append("Welcome back.");            
        };
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
        this.add_child(inv);
        this.add_child(bath);
        this.add_child(snd);
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
        history.append("inventory - Check out what you're holding.", "help");
        history.append("reset universe - Completely reset the entire universe.", "help");
        history.append("help - See this page.", "help");
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
