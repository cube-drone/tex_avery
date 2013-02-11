// The Mock History pretends to be a History element, but doesn't have any 
// dependencies on the DOM. It's used for testing. 
define(function() {
    
var history = [];
var pagebreaks = 0;

return {
    pagebreak: function() {
        pagebreaks ++;
    },
    append: function(message, author){
        history.push( message );
    },
    pop: function(){
        return history.pop();
    }
};

});
