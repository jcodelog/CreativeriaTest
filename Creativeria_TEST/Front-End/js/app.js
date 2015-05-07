var User = Parse.Object.extend("User");
var Album = Parse.Object.extend("Album");
var Sale = Parse.Object.extend("Sale");
var Song = Parse.Object.extend("Song");


Parse.User.logIn("Juan", "123456", {
  success: function(user) {

    
  },
  error: function(user, error) {
    alert(error);
  }
});


Parse.Cloud.run('MoreListened', {}, {
  success: function(result) {   
   var ListView = "";
   for(i=0; i<result.length ;i++){
   		var data = JSON.stringify(result[i]);
   		var jsonobject = JSON.parse(data); 	
    	ListView = ListView + parse_html_Listview(jsonobject.objectId,"asd",
    		jsonobject.Title,"sd",jsonobject.Replays,jsonobject.Duration,jsonobject.FK_Album);
   }
		document.getElementById("ListView").innerHTML = ListView;
   },
  error: function(error) {
  	response.error(error);
  }
});


function buy_album(id){
	Parse.Cloud.run('PostSale', {userID: Parse.User.current().id, albumID: id}, {
	  success: function(result) {
	  	document.getElementById("msg_view").innerHTML = info_msg();	   
	  },
	  error: function(error) {
	  }
	});
}



function play_song(id){
	Parse.Cloud.run('PlaySong', {postId: id}, {
	  success: function(result) {
	  	document.getElementById("msg_view").innerHTML = success_msg();	   
	  },
	  error: function(error) {
	  }
	});
}


function success_msg(){
	var str =   "<div class=\"alert bg-green white alert-dismissable\">" +
          			"<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">×</button>"+ 
          			"<strong>Enjoy your song!</strong> The reply has been saved"+
    			"</div>";
	return str;
}

function info_msg(){
	var str = "<div class=\"alert bg-gray white alert-dismissable\">"+
          		"<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-hidden=\"true\">×</button>"+
          		"<strong>Enjoy your album!</strong>The buy has been saved"+
   			 "</div>";
	return str;
}


function parse_html_Listview(id,Artist,Title,Album,Replays,Duration,fk_album){
	var str = "<tr>"+
        "<td>" + Artist   + "</td>"+
        "<td>" + Title    + "</td>"+
        "<td>" + Album    + "</td>"+
        "<td>" + Replays  + "</td>"+
        "<td>" + Duration + "</td>"+
        "<td><i class=\"fa fa-play-circle fa-2x\" onclick=\"play_song('"+id+"')\"></i> &nbsp;<i class=\"fa fa-shopping-cart fa-2x\" onclick=buy_album('"+fk_album+"')></i> </td>"+
      "</tr>";
      return str;             
}
