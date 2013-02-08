

$(document).ready(function() {
    $("#target").focus();

    var request_response = function(request){
	response_callback("Response"); 
    }

    var list_of_options = function(){ 
	return ["Look at trees.", "Look at other, better trees.", "Fuck you."]; 
    }
    
    var focus = function(evt) {
	$("#target").focus(); 
	return evt;
    };

    var response_callback = function( response ){
	$("#history").append( "<li class='computer'> $> "+ response +" </li> " );
	$("#prompt").show();
    }

    var enter = function(evt) {
	if( $('.typeahead').is(":visible") ){
	    console.log("typeahead'd");
	    return evt;
	}
	var words = $("#target").val();
	$("#history").append( "<li class='human'> $> " + words + " </li> " );
	$("#target").val("");
	$("#prompt").hide();
	request_response();
	return evt;
    };

    $(document).bind('keydown', focus);
    $("#target").bind('keydown.return', enter);
    
    $("#target").typeahead({ source:list_of_options })
});

