Parse.initialize("Eqk0K7rw41mCbZbO38mbLnzmenMtbZsfqzg4b6hl", "khelVPayee4ma0hrlNBrF4gDtrCL4Gi4SJWxUqeX");

var User = Parse.Object.extend("User");
var Album = Parse.Object.extend("Album");
var Sale = Parse.Object.extend("Sale");
var Song = Parse.Object.extend("Song");

Parse.Cloud.define("GetUsers", function(request, response) {
  var query = new Parse.Query("User");
  
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("User lookup failed");
    }
  });
});

Parse.Cloud.define("PostAlbum", function(request, response) {

	var album = new Album();

	album.set("Title", "Never Mind");
	album.set("Year", 2015);
	album.set("Price",29.36);

	album.save(null, {
	  success: function(album) {
	    // Execute any logic that should take place after the object is saved.
	    response.success('New album created with objectId: ' + album.id);
	  },
	  error: function(album, error) {
	    response.error('Failed to create new album, with error code: ' + error.message);
	  }
	});
});


Parse.Cloud.define("PostSale", function(request, response) {	
	var _user = new User();
	_user.id = request.params.userID;	
	var _album = new Album();
	_album.id = request.params.albumID;
	var sale = new Sale();
 	var rel_user_sale = sale.relation("FK_User");
  rel_user_sale.add(_user);
 	var rel_album_sale = sale.relation("FK_Album");
    rel_album_sale.add(_album);
	sale.save(null, {
	  success: function(sale) {
	    response.success('New sale created with objectId: ' + sale.id);
	  },
	  error: function(sale, error) {
	    response.error('Failed to create new sale, with error code: ' + error.message);
	  }
	});
});


Parse.Cloud.define("MoreListened", function(request, response) {
  var query = new Parse.Query("Song");
  query.descending("Replays");
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a song, with error code:" + error.message);
    }
  });
});


Parse.Cloud.define("BestSeller", function(request, response) {
  var query = new Parse.Query("Sale");
  query.descending("Sellers");
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a song, with error code:" + error.message);
    }
  });
});


Parse.Cloud.define("GetSongs", function(request, response) {
  var query = new Parse.Query("Song");
  
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a song, with error code:" + error.message);
    }
  });
});


  Parse.Cloud.define("PlaySong", function(request, response) {
    var song = new Parse.Object("Song");
    song.id = request.params.postId;
    song.increment("Replays");
    song.save().then(function() { 
      response.success();
    }, function(error) { 
      response.error(error);
    });
  });





