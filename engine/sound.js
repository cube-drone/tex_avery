define(
    function(){

var public = {};

var sound_on = false;

var playlist_name = "sample";
var ambient_volume = 0.5;
var music_volume = 0.2;
var sfx_volume = 0.5;
var current_ambient = null;
var current_song = null;

var ambient_playlists = {};
var music_playlists = {};

public.register_playlist = function( name, ambient_playlist, music_playlist ){
    ambient_playlists[name] = ambient_playlist;
    music_playlists[name] = music_playlist;
};

public.set_playlist = function( name ){
    playlist_name = name;

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
    _.each( music_playlist, function(track, i){
        createjs.Sound.registerSound(track, "music_"+playlist_name + "_" + i)
    });
    if( song >= music_playlist.length ){
        song = 0;
        localStorage[ 'sound:'+playlist+':current_song' ] = JSON.stringify(song);
    }
}


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

var normalize = function( volume ){
    if( volume <= 0 ){
        return 0;
    }
    else if( volume > 100 ){
        return 1; 
    }
    else{
        return(volume/100);
    }
};

public.set_sfx_volume = function( volume ){
    sfx_volume = normalize( volume );
}

public.set_ambient_volume = function( volume ){
    ambient_volume = normalize(volume);
    if( current_ambient ){
        current_ambient.setVolume( ambient_volume );
    }
}

public.set_music_volume = function( volume ){
    music_volume = normalize(volume);
    if( current_song ){
        current_song.setVolume( music_volume );
    }
}

public.start = function(){
    sound_on = true;
    createjs.Sound.setMute(false);
};

public.is_on = function(){
    return sound_on;
};

public.stop = function(){
    sound_on = false;
    createjs.Sound.setMute(true);
};

public.register_sfx = function(path, title){
    createjs.Sound.registerSound(path, title)
}

public.sfx = function(title){
    if( sound_on ){
        sfx = createjs.Sound.play(title);
        sfx.setVolume( sfx_volume );
    };
};

return public;
});
