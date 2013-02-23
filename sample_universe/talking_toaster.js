define(["engine/objects",
        "ui/prompt",
        "ui/history"], function( objects, prompt, history){
var app = history.append;

var public = {};

objects.set_file( "sample_universe/talking_toaster" );

var toaster_conversation = { 
    start: function(){
        app("Hey, there, boy. I'm a ToastMaster.");
        this.state_1();
    },
    state_1: function(){
        prompt.choices(this, { 
            "Don't call me boy":this.dont_call_me_boy,
            "You're a <em>what</em> toaster?":this.youre_a_what
        });
    },
    dont_call_me_boy: function(){
        app("Okay, I won't. Boy.");
        prompt.choices(this, {
            "Fuck you, buddy.": this.fuck_you_buddy,
            "Okay, whatever.": this.okay_whatever
        });
    },
    fuck_you_buddy: function(){
        app("Conversation over.");
        prompt.hide_choices();
    },
    okay_whatever: function(){
        app("Whatever indeed.");
        this.state_1();
    },
    state_2:function(){
        prompt.choices(this, {
            "Could you toast bacon?":this.could_you_toast_bacon,
            "What about bagels?":this.what_about_bagels, 
            "Are you a debater?":this.are_you_a_debater
        });
    },
    youre_a_what: function(){
        app("A ToastMaster. Master of toast. King of making bread tastier.");
        this.state_2();
    },
    could_you_toast_bacon: function(){
        app("I probably could, but I'd get all greasy inside. Ugh. ");
        app("Please don't do that to me.");
        this.state_2();
    },
    what_about_bagels: function(){
        app("Yeah, I could toast the ever-loving <em>shit</em> out of bagels.");
        this.state_2();
    },
    are_you_a_debater: function(){
        app("A master debater.");
        this.state_1();
    }
};

public.tree = objects.add_to_universe( "toaster_conversation", toaster_conversation );

return public;
});
