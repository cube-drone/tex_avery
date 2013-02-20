define( ['engine/objects', 'engine/sound', 'ui/history'], 
    function(objects, sound_engine, history){

var public = {};

sound_engine.register_playlist("sample", ["sounds/clock.wav", "sounds/clock.wav"], []);

var volume = {
    setup: function(){
        this.set_state("volume", 50);
    },
    mute: function(){
        this.set_state("volume", 0 );
        history.append("Setting "+this.name.replace(/_/g, " ")+" to 0" );
    },
    turn_up: function(){
        var vol = this.get_state("volume");
        if( vol >= 91 ){
            return;
        }
        vol += 10;
        this.set_state("volume", vol);

        if( this.name === "ambient_volume" ){
            sound_engine.set_ambient_volume( vol );
        }
        if( this.name === "music_volume" ){
            sound_engine.set_music_volume( vol );
        }
        if( this.name === "sfx_volume" ){
            sound_engine.set_sfx_volume( vol );
        }

        history.append("Setting "+this.name.replace(/_/g, " ")+" to " + vol );
    },
    turn_down: function(){
        var vol = this.get_state("volume");
        if( vol <= 9 ){
            return;
        }
        vol -= 10;
        this.set_state("volume", vol);

        if( this.name === "ambient_volume" ){
            console.log( "ambient: " + vol );
            sound_engine.set_ambient_volume( vol );
        }
        if( this.name === "music_volume" ){
            sound_engine.set_music_volume( vol );
        }
        if( this.name === "sfx_volume" ){
            sound_engine.set_sfx_volume( vol );
        }

        history.append("Setting "+this.name.replace(/_/g, " ")+" to " + vol );

    }
}
public.ambient_volume = objects.add_to_universe( "ambient_volume", volume );
public.music_volume = objects.add_to_universe("music_volume", volume );
public.sfx_volume = objects.add_to_universe("sfx_volume", volume );

var sound = {
    setup: function(){
        this.set_state("mute", true);
        var ambient = new public.ambient_volume();
        var music = new public.music_volume();
        var sfx = new public.sfx_volume();
        this.add_child( ambient );
        this.add_child( music );
        this.add_child( sfx );
        this.hide_child( "ambient_volume" );
        this.hide_child( "music_volume" );
        this.hide_child( "sfx_volume" );
        this.hide_verb( "mute" );
    },
    unmute: function(){
        history.append( "You turn on the sound. ", "narrator" );
        
        sound_engine.start( 50, 50, 50, "sample" ); 
        
        this.show_child( "ambient_volume" );
        this.show_child( "music_volume" );
        this.show_child( "sfx_volume" );
        this.show_verb( "mute" );
        this.hide_verb( "unmute" );
    },
    mute: function(){
        history.append( "You mute the sound. ", "narrator" );

        sound_engine.stop();

        this.hide_child( "ambient_volume" );
        this.hide_child( "music_volume" );
        this.hide_child( "sfx_volume" );
        this.hide_verb( "mute" );
        this.show_verb( "unmute" );
    } 
}
public.sound = objects.add_to_universe("sound", sound);

return public;
});

