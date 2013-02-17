define(["engine/objects", 
        "game/talking_toaster",
        "game/room",
        "ui/history"], 
        function( objects, talking_toaster, room, history){

objects.set_file( "game/kitchen" );

var app = history.append;
var public = {};

var toaster = {
    look_at: function(){ 
        app("It's a Toastmaster");
    }, 
    debate: function(){
        var toasty = new talking_toaster.tree();
        toasty.start();
    },
    use: {
        'undefined': function() {
            app("Without bread, the <strong class='object'>toaster</strong> serves little purpose.");
        },
        'fork': function() {
            app("Seriously?");
            app("Okay, you electrocute yourself.");
            objects.get_root().die();
        },
        'bacon': function(obj) {
            app("You use the <strong class='object'>toaster</strong> to very clumsily cook the <strong class='object'>bacon</strong>." );
            app("Somehow this manages not to explode and kill everyone.");
            obj.set_state("cooked", true);
        },
        'me': function() {
            app("You lightly toast your hand." );
            app("ow. ow ow ow ow ow ow. ow." );
        }
    }
}
public.toaster = objects.add_to_universe( "toaster", toaster );

var cute_little_kitten = {
    look_at: function(){
        app("It's a cute little kitten.");
    }
}
public.cute_little_kitten = objects.add_to_universe( "cute_little_kitten", cute_little_kitten );

var stove = {
    look_at: function() {
        app("It's a small, greasy electric <strong class='object'>stove</strong>." ); 
    },
    lick: function() { 
        app("It tastes incomprehensibly vile, something like buttered rust." );
    },
    open: function() {
        app("You attempt to open the oven on the <strong class='object'>stove</strong>. ");
        app("However, it is stuck shut.");
    },
    take: function() {
        app("HNNNRRRRGGGGH. Nope. It's not going to budge." );
    },
    use: {
        'undefined':function(){
            app("You turn the <strong class='object'>stove</strong> on and off a couple of times.");
            app("Yep, working stove.");
        },
        'bacon':function(){
            app("You attempt to cook the bacon directly over the stove, but the grease dripping on to the element causes a fire.");
            app("Attempting to put out the fire, you, instead, manage to catch fire yourself." );
            app("Why - why do you have to wear such flammable clothing?");
            objects.get_root().die();
        },
        'me':function(){
            app("No.");
        },
        'fork':function(){
            app("You try to use the <strong class='object'>fork</strong> to wedge open the <strong class='object'>stove</strong>'s door.");
            app("Then, you realize that the stove is nothing more than a prop, and give up.");
        }
    }
}
public.stove = objects.add_to_universe( "stove", stove );

var bacon = { 
    look_at:function(){
        var un = "un";
        if(this.get_state('cooked')){
            un = "";
        };
        app("A kilogram of "+un+"cooked Maple Star Smokey Back <strong class='object'>Bacon</strong>, richly marbled with fat." ); 
    },
    eat:function(){
        if( this.get_state("cooked") ){
            app("You eat the rich, delicious, smoky bacon, thereby winning the game. ");
            objects.get_root().win();
        }
        else{
            app("You eat a full kilogram of uncooked bacon. Afterwards, you cry to yourself for a few minutes.");
            this.delete();
        }
    },
    lick: function(){
        app("... tastes like <strong class='object'>bacon</strong>."); 
    },
    smell: function(){
        app("It smells salty and fatty and an awful lot like <strong class='object'>bacon</strong>.");
    },
    take: function(){
        app("You <strong class='object'>stash</strong> the bacon on your person for later use.");
        this.delete();
        objects.get_root().recursive_find('inventory').add_child(this);
    },
    use: {
        'undefined': function(){
            this.eat();
        },
        'fork': function(){
            app("You lightly perforate the <strong class='object'>bacon</strong>.");
        },
        'toaster': function(){
            app("You use the toaster to very clumsily cook the <strong class='object'>bacon</strong>." );
            app("Somehow this manages not to explode and kill everyone.");
            this.set_state("cooked", true);
        },
        'stove': function(){
            app("You attempt to cook the bacon directly over the stove, but the grease dripping on to the element causes a fire.");
            app("Attempting to put out the fire, you, instead, manage to catch fire yourself." );
            app("Why - why do you have to wear such flammable clothing?");
            objects.get_root().die();
        }
    }
};
public.bacon = objects.add_to_universe( "bacon", bacon );

var mirror = {
    look_at:function(){
        app("It's <strong class='object'>me</strong>! God, I'm ugly." ); 
    },
    smash:function(){
        app("You smash the mirror. 7 years of bad luck are now all up on your plate.");
    },
    use:{
        'undefined': function(){ this.look_at(); } ,
        'bacon': function(){
            objects.get_root().win();
        },
        'stove': function(){
            app("Both of those things are attached to the walls.");
        },
        'fork': function(){
            app("It's as if there were two forks!");
        },
        'toaster': function(){
            this.smash();
        },
        'me': function() {
            this.look_at();
        }
    }
};
public.mirror = objects.add_to_universe( "mirror", mirror );

var fridge = {
    setup: function() {
        this.hide_verb("close");
        this.add_child( new public.bacon() );
        this.hide_child( "bacon" );
    },
    look_at: function(){
        app("It's a perfectly normal fridge." ); 
        if( this.get_state('open') ){
            if( this.has_child( "bacon" ) )
            {
                app("Inside is a package of bacon and a flask of mustard." );
            }
            else{
                app("There's a flask of mustard in there." );
            }
        };
    },
    lick: function(){
        app("Why? Why would you lick that? It tastes of bad decision-making skills." );
    },
    take: function(){
        app("Despite a pretty heroic effort, you cannot take the fridge with you.");
    },
    make_love_to: function(){
        app(".. good lord.");
    },
    open: function(){
        this.set_state('open', true); 
        this.show_verb("close");
        this.hide_verb("open");
        app( "You open the fridge. Inside the fridge is a cornucopia of.. well, nothing."); 
        this.show_child( "bacon" );
        if( this.has_child( "bacon" ) )
        {
            app("Just a package of <strong class='object'>bacon</strong> and a flask of mustard." );
        }
        else{
            app("Just a flask of mustard." );
        }
    },
    close: function(){
        this.set_state('open', false); 
        this.hide_verb("close");
        this.show_verb("open");
        app("You close the fridge.");
        this.hide_child( "bacon" );
    }
};
public.fridge = objects.add_to_universe( "fridge", fridge );

var kitchen = {
    special_verbs: ["go_north", "go_through_door"],
    setup: function(){
        this.add_child( new public.toaster() );
        this.add_child( new public.fridge() );
        this.add_child( new public.stove() );
        this.add_child( new public.mirror() );
        this.add_child( new public.cute_little_kitten() );
    },
    go_north_from: function(){
        room.change_location("game/north");
    },
    go_north: function(){
        this.go_north_from();
    },
    go_through_door: function(){
        this.go_north_from();
    },
    look_at:function(){
        var string = [ "You are standing in a small, tidy kitchen. ", 
        "It's unfamiliar to you, but it seems like most kitchens you've seen", 
        " before. There's a <strong class='object'>stove</strong>, a ", 
        " <strong class='object'>fridge</strong>, a <strong class='object'>toaster</strong>, ", 
        " a <strong class='object'>cute little kitten</strong>, ", 
        " and a <strong class='object'>mirror</strong>. " ];
        app( string );
    },
    
};
public.room = objects.add_to_universe( "kitchen", kitchen );

return public;
});
