// Tools for string manipulations. 
define(["engine/synonyms"], function(synonyms){
return {
    clean: function( words ){
        words = words.toLowerCase();
        words = words.replace(/[\W]/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/\s*$/g, '')
            .replace(/^\s*/g, '');
        return words;
    },
    ends_with: function( string, suffix ){
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
    },
    verb_in_command: function( verb, command ){
        return _.any( synonyms.find(verb), function(synonym) {
            return command.indexOf(synonym.replace(/_/g, " ")) !== -1 });
    },
    strip_from_end: function( words, strip ){
        if( this.ends_with( words, strip )){
            return words.substring(0, words.length - (strip.length+1) );
        }
        else{
            return words;
        }
    }
};
});
