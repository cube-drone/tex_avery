define(["engine/objects",
        "ui/history"], function( objects, history){
var public = {};

objects.set_file( "game/definition" );

var definitions = {
    setup: function(){
        this.hide_verb("x_array_specs");
        this.hide_verb("authenticat");
    },
    x_array_specs: function(){
        history.append("X-Array Specs", "narrator", "" +
" <p><strong>tl;dr: a phone had sex with VR goggles</strong></p> " + 
" <p>Specs are today's " +
" dominant display technology. They can display a transparent overlay " +
" over your vision, an opaque overlay over your vision, or simply fade " +
" into the background. There are dozens of models - from the market " +
" pioneer, the Google Glass line, to the Microsoft Visual Vision series, " +
" to the Samsung Galaxy of Gorgeous Bass Headset, every major hardware " +
" manufacturer has a foot in this race. </p> " +
" <p><em>Your</em> model is the \"Lemovo X-Array\" - well, it would " +
" be if you were wearing them. </p> "); 
    },
    authenticat: function(){
        history.append("AuthentiCat", "narrator", " "+
"<p><strong>tl;dr: your identity</strong></p> " + 
"<p>Being as everybody is net-savvy at this point, and everything "+ 
"is online at this point, the problems of authentication and " +
"authorization have become more and more crucial to address. </p>" +
"<p>Passwords are just so easy to break, and maintaining dozens " +
"and dozens of user-name/password pairs becomes unwieldy when " +
"one's life is distributed amongst dozens of different systems. " +
"In 2017, a small bio-tech firm, AuthentiCat (the logo of which " +
" is a small black cat with a lock for a head), released a consumer "+
" grade sub-dermal chip system.  Based on public-key crypto, each " +
" sub-dermal chip contains a password-protected private key and a " +
" Bluetooth connection that can be used to authenticate the user " +
" to a variety of sources. </p>" +
" <p>While there are security concerns - no system is unhackable - " +
" the AuthentiCat chips have proven more secure than most chip-and-pin " +
" systems, and financial providers have started to phase out cards in " +
" favour of AuthentiCats. Particularly paranoid " +
" users can keep their AuthentiCats extra-dermally, (key-chain FOBs " +
" being a particularly popular option) but these units are much " +
" more prone to theft. </p>" +
" <p>In 2023 the United States mandated AuthentiCat passports for "+
" travellers into the country. in order to smooth over border "+
" tensions after the 2018 Liberty Bell Incident. </p>  "+
" <p>At this point, just about everything in one's life can comfortably "+
" be authenticated and authorized with an AuthentiCat. Many people"+
" have their entire lives attached to this one single private key.</p>" );
    }
};
public.definitions = objects.add_to_universe( "definition", definitions );

return public;
});
