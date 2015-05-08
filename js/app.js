

function log_user(name,pass){
  Parse.User.logIn(name,pass, {
  success: function(user) {  
    alert("Welcome!!");
    window.location.href="init.html";
  },
  error: function(user, error) {
    alert(error);
  }
});
}




/**
  *
  *
  *
 */ 

function play_song(id,id_album){
	Parse.Cloud.run('PlaySong', {postId: id , albumId: id_album}, {
	  success: function(result) {
	  	alert("Enjoy your song! ... Your replay has been scored"); 
      location.reload();  
	  },
	  error: function(error) {
	  }
	});
}

/**
  *
  *
  *
 */ 

function song_Listview(id,Artist,Title,Album,Replays,Duration,FK_Album){
	var str = "<tr>"+
        "<td>" + Artist   + "</td>"+
        "<td>" + Title    + "</td>"+
        "<td>" + Album    + "</td>"+
        "<td>" + Replays  + "</td>"+
        "<td>" + Duration + "</td>"+
        "<td><i class=\"fa fa-play-circle fa-2x\" onclick=\"play_song('"+id+"','"+FK_Album+"')\"></td>"+
      "</tr>";
      return str;             
}

/**
  *
  *
  *
 */ 

function album_Listview(id,Title,Artist,Year,data,price){
  var str = "<tr>"+
        "<td>" + Title   + "</td>"+
        "<td>" + Artist    + "</td>"+
        "<td>" + Year    + "</td>"+
        "<td>" + data  + "</td>"+
        "<td>" + price + "</td>"+
        "<td><i class=\"fa fa-shopping-cart fa-2x\" onclick=\"buy_album('"+id+"')\"></td>"+
      "</tr>";
      return str;             
}

/**
  *
  *
  *
 */ 

function do_song_table(){
  var str = "<tr><th>Artist</th>"+
  "<th>Title</th>"+
  "<th>Album</th>"+
  "<th>Replays</th>"+
  "<th>Duration</th>"+
  "<th>Play</th></tr>" ;
  return str;
}
 
/**
  *
  *
  *
 */ 

function do_album_table(data){
  var str = "<tr><th>Title</th>"+
  "<th>Artist</th>"+
  "<th>Year</th>"+
  "<th>"+data+"</th>"+
  "<th>Price</th>"+
  "<th>Buy</th></tr>" ;
  return str;
}     


/**
  *
  *
  *
 */ 
function more_listened(){
  $("#H_Title").html("Most Listened Songs");
  $("#tableHead").html(do_song_table());
  Parse.Cloud.run('MoreListened', {}, {
    success: function(result) {   
    Parse.Cloud.run('GetAlbums', {}, {
      success: function(_resultAl) {
        Parse.Cloud.run('GetArtists', {}, {
          success: function(_resultAr) {   
             var ListView = "";
             for(i=0; i<result.length ;i++){
                for(j=0; j<_resultAl.length; j++){
                  for(k=0; k<_resultAl.length; k++){
                    var data = JSON.stringify(result[i]);
                    var jsonobject = JSON.parse(data);

                    var j_data = JSON.stringify(_resultAl[j]);
                    var al_jsonobject = JSON.parse(j_data);

                    var k_data = JSON.stringify(_resultAr[k]);
                    var ar_jsonobject = JSON.parse(k_data);

                    if(jsonobject.FK_Album == al_jsonobject.objectId && jsonobject.FK_Artist == ar_jsonobject.objectId){
                      ListView = ListView + song_Listview(jsonobject.objectId,ar_jsonobject.Name,
                        jsonobject.Title,al_jsonobject.Title,jsonobject.Replays,jsonobject.Duration,jsonobject.FK_Album);
                    }               
                }
              }
             }
              document.getElementById("ListView").innerHTML = ListView;
          },
          error: function(error) {
          }
        });
      },
      error: function(error) {
      }
    });
    },
    error: function(error) {
      response.error(error);
    }
  });
}

/**
  *
  *
  *
 */ 
function best_sellers(){ 
  $("#H_Title").html("Best Seller");
  $("#tableHead").html(do_album_table('Sales'));
  Parse.Cloud.run('BestSeller', {}, {
    success: function(result) {   
      Parse.Cloud.run('GetArtists', {}, {
        success: function(_result) {
           var ListView = "";
           for(i=0; i<result.length ;i++){
              for(j=0; j<_result.length ;j++){                  
                  var data = JSON.stringify(result[i]);
                  var jsonobject = JSON.parse(data); 
                  var a_data = JSON.stringify(_result[j]);
                  var a_jsonobject = JSON.parse(a_data); 

                  if(jsonobject.FK_Artist == a_jsonobject.objectId){
                      ListView = ListView + album_Listview(jsonobject.objectId,jsonobject.Title,
                        a_jsonobject.Name,jsonobject.Year,jsonobject.Sales,jsonobject.Price);
                      break;
                  }                  
              }
           }
           document.getElementById("ListView").innerHTML = ListView;
        },
        error: function(error) {
        }
      });
     },
    error: function(error) {
      response.error(error);
    }
  });
}


/**
  *
  *
  *
 */ 
function m_listened_album(){ 
  $("#H_Title").html("Most Listened Albums");
  $("#tableHead").html(do_album_table('Replays'));
  Parse.Cloud.run('BestAlbum', {}, {
    success: function(result) {   
      Parse.Cloud.run('GetArtists', {}, {
        success: function(_result) {     
           var ListView = "";
           for(i=0; i<result.length ;i++){
              for(j=0; j<_result.length ;j++){                  
                  var data = JSON.stringify(result[i]);
                  var jsonobject = JSON.parse(data); 
                  var a_data = JSON.stringify(_result[j]);
                  var a_jsonobject = JSON.parse(a_data); 
                  if(jsonobject.FK_Artist == a_jsonobject.objectId){
                      ListView = ListView + album_Listview(jsonobject.objectId,jsonobject.Title,
                        a_jsonobject.Name,jsonobject.Year,jsonobject.Replays,jsonobject.Price);
                      break;
                  }                  
              }
           }
            document.getElementById("ListView").innerHTML = ListView;
        },
        error: function(error) {
        }
      });
     },
    error: function(error) {
      response.error(error);
    }
  });
}

function buy_album(id, _price){
  Parse.Cloud.run('BuyAlbum', {postId: id , userID: Parse.User.current().id  , albumID: id, price: _price}, {
    success: function(result) {
      alert("Enjoy your album! ... Your buy has been saved"); 
      location.reload();   
    },
    error: function(error) {
    }
  });
}