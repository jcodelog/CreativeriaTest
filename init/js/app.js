/** Login function use parse user
  * Args: None
  * Returns: Successful message
 */  

function login_user(){

  var name = document.getElementById("username").value;
  var pass = document.getElementById("password").value;

  Parse.User.logIn(name,pass, {
  success: function(user) {  
    alert("Welcome!!");
    window.location.href="http://jcodelog.github.io/CreativeriaTest/init/";
  },
  error: function(user, error) {
    alert("wrong username or password");
  }
});
}

/** Logout function of parse user
  * Args: None
  * Returns: None
 */  


function logout(){
  Parse.User.logOut();
  window.location.href="http://jcodelog.github.io/CreativeriaTest/";
}

/** Show a alert message with important info
  * Args: None
  * Returns:  Help message
 */  

function alert_msg(){
  alert("Username: Creativeria\nPassword: 123456");
}

/** Simulate a play song
  * Args: 
  *       id: ID of the song to play
  *       albumID: ID of the album to play
  * Returns: Successful  message
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

/** Build html table for a song listview
  * Args: id: ID Song
  * Artist: Name of the artist
  * Title: Name of the song
  * Album: Name of the album
  * Replays: Number of replays
  * Duration: String with a rnd duration song
  * FK_Album: Foering key to album 
  * Returns: HTML with table form 
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

/** Build html table for a album listview
  * Args: 
  *   id: ID of the album
  *   Title: name of the album
  *   Artist: name of the artist
  *   Year: year when the album was published
  *   data: type operation (buy/replay)
  *   price: price of the album sell
  * Returns: String/html form with table construction
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

/** Make a table song header
  * Args: None
  * Returns: String/HTML header for a song table
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
 
/** Make a table song header
  * Args:
  *      data: play or sell state
  * Returns: String/HTML header for a song table 
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


/** Make join between the tables Albums-Artist-Songs
  * Args: None
  * Returns: A html build list with most listened songs
 */  

function most_listened(){
  $("#H_Title").html("<strong>Most Listened</strong> Songs");
  $("#tableHead").html(do_song_table());
  Parse.Cloud.run('MoreListened',{},{
    success: function(result) {   
    Parse.Cloud.run('GetAlbums', {}, {
      success: function(_resultAl) {
        Parse.Cloud.run('GetArtists', {}, {
          success: function(_resultAr) {   
             var ListView = data_inner_join(result,_resultAl,_resultAr);
             document.getElementById("ListView").innerHTML = ListView;
          }
        })
      }})
    },
    error: function(error) {
      response.error(error);
    }
  });
}

/** Make join between the tables Albums-Artist in best sellers order
  * Args: None
  * Returns: A html build list with best seller albums
 */  

function best_sellers(){ 
  $("#H_Title").html("<strong>Best</strong> Seller");
  $("#tableHead").html(do_album_table('Sales'));
  Parse.Cloud.run('BestSeller', {}, {
    success: function(result) {   
      Parse.Cloud.run('GetArtists', {}, {
        success: function(_result) {
           var ListView = album_join_by_sales(result,_result);
           document.getElementById("ListView").innerHTML = ListView;
        },
      });
     },
    error: function(error) {
      response.error(error);
    }
  });
}


/** Make join between the tables Albums-Artist in most listened order
  * Args: 
  * Returns: A html build list with most listened albums
 */  

function m_listened_album(){ 
  $("#H_Title").html("<strong>Most Listened</strong> Albums");
  $("#tableHead").html(do_album_table('Replays'));
  Parse.Cloud.run('BestAlbum', {}, {
    success: function(result) {   
      Parse.Cloud.run('GetArtists', {}, {
        success: function(_result) {     
           var ListView =  album_join_by_replays(result,_result);
           document.getElementById("ListView").innerHTML = ListView;
        },
      });
     },
    error: function(error) {
      response.error(error);
    }
  });
}

/** Create a sale relation between album and user 
  * Args:
  *     ID : User ID
  *     albumID: Album ID  
  * Returns: Successful  message
 */ 

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


/** Inner join bewtenn 3 tables
  * Args: 
  *     result: results from song table
  *     _resultAl: results from album table
  *     _resultAl: results from artist table
  * Returns: A string html build list with most listened albums
 */ 

function data_inner_join(TableSong,TableAlbum,TableArtist){
   var ListView = "";
   for(i=0; i<TableSong.length ;i++){
      for(j=0; j<TableAlbum.length; j++){
        for(k=0; k<TableArtist.length; k++){

          var data = JSON.stringify(TableSong[i]);
          var jsonobject = JSON.parse(data);

          var j_data = JSON.stringify(TableAlbum[j]);
          var al_jsonobject = JSON.parse(j_data);

          var k_data = JSON.stringify(TableArtist[k]);
          var ar_jsonobject = JSON.parse(k_data);

          if(jsonobject.FK_Album == al_jsonobject.objectId && jsonobject.FK_Artist == ar_jsonobject.objectId){
            ListView = ListView + song_Listview(jsonobject.objectId,ar_jsonobject.Name,
              jsonobject.Title,al_jsonobject.Title,jsonobject.Replays,jsonobject.Duration,jsonobject.FK_Album);
          }               
      }
    }
   }
   return ListView;
}

/** Inner join bewtenn  2 tables Album - Artist order by replays
  * Args: 
  *     TableAlbum: results from album table
  *     TableArtist: results from artist table
  * Returns: A string html build list with most replayed albums
 */ 
function album_join_by_replays(TableAlbum,TableArtist){
  var ListView = "";
   for(i=0; i<TableAlbum.length ;i++){
      for(j=0; j<TableArtist.length ;j++){                  
          var data = JSON.stringify(TableAlbum[i]);
          var jsonobject = JSON.parse(data); 
          var a_data = JSON.stringify(TableArtist[j]);
          var a_jsonobject = JSON.parse(a_data); 
          if(jsonobject.FK_Artist == a_jsonobject.objectId){
              ListView = ListView + album_Listview(jsonobject.objectId,jsonobject.Title,
                a_jsonobject.Name,jsonobject.Year,jsonobject.Replays,jsonobject.Price);
              break;
          }                  
      }
   }
   return ListView;
}

/** Inner join bewtenn 2 tables Album - Arist order by sales
  * Args: 
  *     TableAlbum: results from album table
  *     TableArtist: results from artist table
  * Returns: A string html build list with a best sellers albums
 */ 
function album_join_by_sales(TableAlbum,TableArtist){
  var ListView = "";
   for(i=0; i<TableAlbum.length ;i++){
      for(j=0; j<TableArtist.length ;j++){                  
          var data = JSON.stringify(TableAlbum[i]);
          var jsonobject = JSON.parse(data); 
          var a_data = JSON.stringify(TableArtist[j]);
          var a_jsonobject = JSON.parse(a_data); 

          if(jsonobject.FK_Artist == a_jsonobject.objectId){
              ListView = ListView + album_Listview(jsonobject.objectId,jsonobject.Title,
                a_jsonobject.Name,jsonobject.Year,jsonobject.Sales,jsonobject.Price);
              break;
          }                  
      }
   }
  return ListView;
}