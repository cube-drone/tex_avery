// Tools for string manipulations. 
define(function() {
return {
    clean: function( words ){
        return words.toLowerCase()
            .replace(/[\W]/g, ' ')
            .replace(/\s+/g, ' ')
            .replace(/\s*$/g, '')
            .replace(/^\s*/g, '');
    },
    endswith: function( string, suffix ){
        return string.indexOf(suffix, string.length - suffix.length) !== -1;
    },
    verb_in_command: function( verb, command ){
        return command.indexOf(verb.replace("_", " ")) !== -1;
    }
};
});
