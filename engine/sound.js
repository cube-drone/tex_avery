define(
    function(){

var public = {};

var ambient_volume = 0;
var music_volume = 0;
var sfx_volume = 0;
var current_ambient = null;
var current_song = null;

var sound_on = false;
var ambient_playlists = {};
var music_playlists = {};

public.register_playlist = function( name, ambient_playlist, music_playlist ){
    ambient_playlists[name] = ambient_playlist;
    music_playlists[name] = music_playlist;
};

public.start = function(ambient_vol, music_vol, sfx_vol, playlist_name){
    
    // 'global' variables
    sound_on = true;
    ambient_volume = (ambient_vol/100);
    music_volume = (music_vol/100);
    sfx_volume = (sfx_vol/100); 

    var playlist = "";
    if( typeof(localStorage['sound:current_playlist']) !== 'undefined' ){
        var playlist = localStorage[ 'sound:current_playlist']; 
    }
    
    if( playlist != playlist_name) {
        localStorage['sound:current_playlist'] = playlist_name;
        playlist = playlist_name;
    }

    var song = 0;
    if( typeof(localStorage['sound:'+playlist+':current_song']) !== 'undefined' ){
        var song = JSON.parse(localStorage[ 'sound:'+playlist+':current_song' ]);
    }
    else{
        localStorage['sound:'+playlist+':current_song'] = JSON.stringify(0);
    }

    var ambient = 0;
    if( typeof(localStorage['sound:'+playlist+':current_ambient']) !== 'undefined' ){
        var ambient = JSON.parse(localStorage[ 'sound:'+playlist+':current_ambient' ]);
    }
    else{
        localStorage['sound:'+playlist+':current_ambient'] = JSON.stringify(0);
    }
    
    // Ambient Sound
    var ambient_playlist = ambient_playlists[playlist_name];
    _.each( ambient_playlist, function(track, i){
        createjs.Sound.registerSound(track, "ambient_"+playlist_name + "_" + i)
    });
    if( ambient >= ambient_playlist.length ){
        ambient = 0;
        localStorage[ 'sound:'+playlist+':current_ambient' ] = JSON.stringify(ambient);
    }

    // Music  
    var music_playlist = music_playlists[playlist_name];
    _.each( music_playlist, function(track){
        createjs.Sound.registerSound(track, "music_"+playlist_name + "_" + i)
    });
    if( song >= music_playlist.length ){
        song = 0;
        localStorage[ 'sound:'+playlist+':current_song' ] = JSON.stringify(song);
    }
};

var nextAmbient = function(evt){
    var playlist = localStorage[ 'sound:current_playlist']; 
    var ambient = JSON.parse(localStorage[ 'sound:'+playlist+':current_ambient' ]);
    ambient += 1;
    if( ambient >= ambient_playlists[playlist].length ){
        ambient = 0;
    }
    localStorage[ 'sound:'+playlist+':current_ambient' ] = JSON.stringify(ambient);
    
    var ambient_id = "ambient_"+playlist+"_"+ambient;
    current_ambient = createjs.Sound.play(ambient_id);
    current_ambient.setVolume( ambient_volume ); 
    current_ambient.addEventListener( "complete", nextAmbient );
    console.log( ambient_id );
}

var nextSong = function(evt){
    var playlist = localStorage[ 'sound:current_playlist']; 
    var song = JSON.parse(localStorage[ 'sound:'+playlist+':current_song' ]);
    song += 1;
    if( song >= music_playlists[playlist].length ){
        song = 0;
    }
    localStorage[ 'sound:'+playlist+':current_song' ] = JSON.stringify(song);
    
    var music_id = "music_"+playlist+"_"+song;
    current_song = createjs.Sound.play(music_id);
    current_song.setVolume( music_volume );
    current_song.addEventListener( "complete", nextSong );
}

var loadHandler = function(evt){
    var playlist = localStorage[ 'sound:current_playlist']; 
    var song = JSON.parse(localStorage[ 'sound:'+playlist+':current_song' ]);
    var ambient = JSON.parse(localStorage[ 'sound:'+playlist+':current_ambient' ]);
    
    var ambient_id = "ambient_"+playlist+"_"+ambient;
    var music_id = "music_"+playlist+"_"+song;

    if( ambient_id == evt.id ){
        current_ambient = createjs.Sound.play(ambient_id);
        current_ambient.setVolume( ambient_volume ); 
        current_ambient.addEventListener( "complete", nextAmbient );
    }
    if( music_id == evt.id ){
        current_song = createjs.Sound.play(music_id);
        current_song.setVolume( music_volume );
        current_song.addEventListener( "complete", nextSong );
    }
}

createjs.Sound.addEventListener("loadComplete", loadHandler);

public.set_sfx_volume = function( volume ){
    sfx_volume = (volume/100);
}

public.set_ambient_volume = function( volume ){
    ambient_volume = (volume/100);
    if( current_ambient ){
        current_ambient.setVolume( ambient_volume );
    }
}

public.set_music_volume = function( volume ){
    music_volume = (volume/100);
    if( current_song ){
        current_song.setVolume( music_volume );
    }
}


public.stop = function(){
    sound_on = false;
    createjs.Sound.stop();
};

public.sfx = function(path){
    if( sound_on ){

    };
};

return public;
});
