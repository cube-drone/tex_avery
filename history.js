// The History is the DOM list of all events. 
define(function() {
    
    return {
    pagebreak: function() {
        $("#history").append( "<li class='pagebreak'> </li>" );
    },
    append: function(message, author){
        if(typeof(author) === 'undefined'){ author = "narrator" }
        $("#history").append( "<li class='"+author+"'>"+ message +" </li> " );
        $("#history").scrollTop($("#history")[0].scrollHeight);
    }
}

});
