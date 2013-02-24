define(["engine/objects", 
        "engine/sound", 
        "ui/prompt",
        "game/room",
        "ui/history"], 
        function( objects, sound, prompt,  room, history){

objects.set_file( "game/bathroom" );

sound.register_playlist("apartment", 
    ["sounds/ambient-bathroom.ogg", "sounds/ambient-kitchen.ogg"], 
    ["sounds/tryad-the_final_rewind.mp3", "sounds/tryad-seduction.mp3", "sounds/tryad-our_lives_change.mp3"]);

sound.register_sfx( "sounds/sfx-flush.ogg", "flush" );

var app = history.append;
var public = {};

var mirror_conversation =  {
    start: function(){
        app( "You look in the mirror. ");
        app( "Your name is:"); 
        prompt.choices( this, {
            "Stanley Jevons": this.stanley,
            "Ke Jevons": this.ke, 
            "Melissa Jevons": this.melissa,
            "Xia Jevons": this.xia,
            "Salty Salty Jevons": this.salty
        });
    },
    stanley: function(){ this.set_name("Stanley"); },
    ke: function(){ this.set_name("Ke"); },
    melissa: function(){ this.set_name("Melissa"); },
    xia: function(){ this.set_name("Xia"); },
    salty: function(){ this.set_name("Salty Salty"); },
    set_name: function(name){
        var me = objects.get_root();
        me.set_state("name", name );
        app( "You identify as:");
        prompt.choices( this, { 
            "Female": this.female, 
            "Male": this.male,
            "Something else entirely": this.something_else
        });
    },
    female: function(){ this.gender("Female"); },
    male: function(){ this.gender("Male"); },
    something_else: function(){ this.gender("Undefined"); }, 
    gender: function(gender){
        var me = objects.get_root();
        me.set_state("gender", gender );
        app( "If you were to compare yourself to a refreshing beer, it would be a:" );
        prompt.choices( this, {
            "Tall, pale, blonde, a sleeve of Hefeveisen": this.wheat_beer, 
            "Medium-sized, creamy-tan, refeshing, a pint of Honey-Brown Ale": this.ale, 
            "Short and Stout": this.is_my_handle_this_is_my_spout
        });
    },
    wheat_beer: function(){ this.beer("Wheat"); },
    ale: function(){ this.beer("Ale"); },
    is_my_handle_this_is_my_spout: function(){ this.beer("Stout"); },
    beer: function( beer ){
        var me = objects.get_root();
        me.set_state("beer", beer);
        prompt.hide_choices();
        var mirror = new public.mirror();
        mirror.look_at();
    }
}
public.mirror_conversation = objects.add_to_universe( "mirror_conversation", mirror_conversation );

var mirror = {
    look_at:function(){
        var me = objects.get_root();
        if( me.get_state("name") !== null )
        {
            var beer = me.get_state("beer");
            var gender = me.get_state("gender");

            app("You look at yourself in the mirror." );
            app("You're not wearing any clothes. ");
            if( beer === "Wheat" ){
                app([" You're about six feet and change, with short, tidy ",
                    " blonde hair. You have blue eyes, and you're ", 
                    " slender - a little too slender, you think. You chastise ",
                    " yourself for not hitting the gym often enough." ]);
                if( gender === "Female" ){
                    app( [" Your breasts are a little smaller than you'd like, ", 
                         " but you still think they're cute. There's a little moustache", 
                         " sticker on your mirror - you line your face up with it and ", 
                         " say: "] );
                    app( "\"HELLO. I AM THE MAYOR OF MIRROR TOWN.\"", 'you' );
                    app( "I DECREE THAT COLLARED SHIRTS ARE NOW MANDATORY FOR ALL.", "you");
                    app( "ON PENALTY OF DEATH.", "you", "<iframe width=\"560\" height=\"315\" src=\"http://www.youtube.com/embed/FONN-0uoTHI\" frameborder=\"0\" allowfullscreen></iframe>" );
                }
                if( gender === "Male" ){
                    app( [" You didn't like the look of blonde chest hair, ",
                        " so you had it lasered off. You briefly make a Thor pose ", 
                        " into the mirror. RAAR. Maybe a little skinny to pull off Thor."] );
                }
            }
            if( beer === "Ale" ){
                app([ "You're about five-eight, with a crop of unkempt chestnut ",
                    " hair. Your eyes are bright green, and your skin is somewhere ", 
                    " in the mediterr-asian spectrum. You have a little bit of a paunch ",
                    " that you'd be happier without - you chastise yourself for not hitting ", 
                    " the gym often enough." ]); 
                if( gender === "Female" ){
                    app([" You arrange your hair a bit to try to get it from Flock of Seagulls ",
                        " to Rough Ponytail. "] ); 
                }
                if( gender === "Male" ){
                    app([" You've recently trimmed your chest hair into the Batman symbol. ",
                        " No regrets, although the required shaving has been an extra pain ",
                        " in the ass. I'm Batman. Batman is itchy. "]);
                }
            }
            if( beer === "Stout" ){
                app( [ "You're about five-four, with long, curly dark hair. ", 
                    " Your skin is a rich, chocolatey hue. "]); 
                if( gender === "Female" ){
                    app([" You're voluptuous. Curvaceous. Some might even say 'husky',", 
                        " although those people would probably regret it before too long.", 
                        " You like the way that you look, but you'd be happy to be a little", 
                        " less voluminous. Maybe some more time at the gym."] ); 
                }
                if( gender === "Male" ){
                    app([" You're stocky. Barrel-chested. Muscled.  If you were to grow ",
                        " a beard, you'd be a Tolkienesque dwarf. So you refuse to grow ",
                        " a beard.  You make a muscle at yourself in the mirror. CUBAN. ", 
                        "MUSCLE. CRISIS.  Okay, it's not as impressive as you'd like. ", 
                        "You should probably spend a little more time at the gym." ] );
                }
                if( gender === "Undefined" ){
                    app([" You're stocky - even a little barrel-chested. You think that ",
                        "you might want to spend a little more time at the gym."] );
                }
            }
            if( gender === "Undefined" ){
                app( ["You waggle your eyebrows at yourself in the mirror. Hey there, sexy!"] ); 
            }
            app([ "You have a long tattoo of a dragon running from your thighbone up", 
                " the side of your torso, alongside the Kanji character for \"SOUP\". It ", 
                " was a funny nod to a common joke (The tattoo artist said it meant 'Honor') ",
                " at the time, but you're starting to regret it. "] )
            // If you're not wearing specs: 
            app([ "You're not wearing your <strong class='object'>X Array Specs</strong>. Your vision is perfect, ",
                "but you're not used to seeing yourself without a thin veneer of augmented reality ",
                "painted over the scene. Where are your specs? " ]);
            objects.get_root().recursive_find("definition").show_verb("x_array_specs");
            
            // If you still have the gauze on: 
            if( objects.get_root().has_child('gauze') ){
                app([ "With a twinge of pain, your attention is drawn to your arm, which is ",
                    "wrapped in bloodied <strong class='object'>gauze</strong>, and <em>sore</em>. " ])
            } else {
                app([ "The <strong class='object'>wound</strong> on your arm ",
                        "has scabbed over." ]); 
            }
        }
        else
        {
            var convo = new public.mirror_conversation();
            convo.start();
        }
    },
    use:{
        'undefined': function(){ this.look_at(); } ,
        'me': function() {
            this.look_at();
        }
    }
};
public.mirror = objects.add_to_universe( "mirror", mirror );

var toilet = {
    look_at:function(){
        app(["It's a small, beige commode. There is nothing spectacular about", 
            " this toilet at all, except that it has been a little while since", 
            " its last cleaning."]);
    },
    smell:function(){
        app("Ungh. Needs a scrub. ");
    },
    taste:function(){
        app("No. You refuse to put your tongue on that. ");
    },
    flush:function(){
        app("You flush the toilet. Way to waste that water. <em>Champ.</em> ");
        sound.sfx("flush");
    },
    clean:function(){
        app("Not right now. You'll do it later. You promise. ");
    } 
};
public.toilet = objects.add_to_universe( "toilet", toilet );

var toiletries = {
    look_at:function(){
        app("Razor, shaving cream, soap, deoderant, toothbrush, general hygeine gear.");
    },
    take: function(){
        app([ "In many games, the solution to puzzles is to <em>take</em> every object that", 
            " you can pick up, and then <em>use</em> those objects on every concievable surface.",
            " This is not one of those games. You would feel silly carrying your entire bathroom worth ", 
            " of gear about. If you need the toiletries, you can come back to your bathroom. They're ",
            " not going anywhere." ]);
    }

};
public.toiletries = objects.add_to_universe("toiletries", toiletries );

var dried_blood = {
    look_at:function(){
        app("It's what appears to be your blood, congealing on the stall's drain." );
    }
};
public.dried_blood = objects.add_to_universe( "dried_blood", dried_blood );

var shower_stall = {
    setup: function(){
        this.add_child( new public.dried_blood() );
        this.hide_child( 'dried_blood' );
    },
    look_at:function(){
        app(["The shower stall is lined with beige tiles. It's your shower.", 
            " You find yourself often wishing that your apartment would", 
            " upgrade its dated water heater. Early in the morning, the water",
            " forms a gradient between lukewarm, lukecold, and freezing,",
            " usually over about 15 minutes. "]);
        if( this.has_child( 'dried_blood' ) ){
            app( ["The only thing that's out-of-the-ordinary",
                " about your shower stall is the <strong class='object'>dried blood</strong>",
                " spattered on the bottom of the stall. "]);
            this.show_child( 'dried_blood');
        }
        else{
            app( "It's been recently scrubbed." );
        }
    },
    clean: function(){
        app("You turn on the shower and scrub out the dried blood.");
        app("Yeah, you could totally take a shower in here, now!");
        this.remove_child('dried_blood');
        this.hide_verb('clean');
    },
}
public.shower_stall = objects.add_to_universe("shower_stall", shower_stall );

var bathroom = {
    special_verbs: ["leave_bathroom"],
    init: function(){
        sound.set_playlist("apartment");
        app( "You wake up in a haze, on the floor of your bathroom stall." );
    },
    setup: function(){
        this.add_child( new public.mirror() );
        this.add_child( new public.toilet() );
        this.add_child( new public.shower_stall() );
        this.add_child( new public.toiletries() );
    },
    leave_bathroom: function(){
        app(" You can't leave the bathroom. You can <em>never</em> leave the bathroom." );
        app(" At least, not until I write that part of the game. " );
        // TODO: leave the bathroom
        //room.change_location("game/apartment");
    },
    look_at:function(){
        app( ["Your bathroom is cramped and small. ", 
        "On one side of the bathroom is a large bathroom ",
        "<strong class='object'>mirror</strong> and a ",
        "sink. Next to the sink is a handful of assorted <strong class='object'>toiletries</strong>. ", 
        " On the other side of the",
        " bathroom is a <strong class='object'>shower stall</strong> ",
        " and a small <strong class='object'>toilet</strong>." ]);
    },
    
};
public.room = objects.add_to_universe( "bathroom", bathroom );

return public;
});
