Parse.initialize("Eqk0K7rw41mCbZbO38mbLnzmenMtbZsfqzg4b6hl", "khelVPayee4ma0hrlNBrF4gDtrCL4Gi4SJWxUqeX");

var User = Parse.Object.extend("User");
var Album = Parse.Object.extend("Album");
var Sale = Parse.Object.extend("Sale");
var Song = Parse.Object.extend("Song");


/* API PARSE SAAS - for use creativeria REST-API 
 * take pase_api from parse-initialize.js
 * All methods are type POST
 */


/* INIT */

/**
 *  GET METHODS  
 */

/** Obtains all users 
  * Args: None
  * Returns: All users from creativeria_test 
  * Type: POST
  * URL: https://parse_api/functions/GetUsers
 */ 
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

/** Obtains a list of songs in descending order
  * Args: None 
  * Returns: Songs most listened for their replays
  * Type: POST
  * URL: URL: https://parse_api/functions/MoreListened
 */ 
Parse.Cloud.define("MoreListened", function(request, response) {
  var query = new Parse.Query("Song");
  query.descending("Replays");
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a songs, with error code:" + error.message);
    }
  });
});

/** Obtains a list of songs in descending order
  * Args: None
  * Returns: Songs by the best sellers
  * Type: POST
  * URL: URL: https://parse_api/functions/BestSeller
 */ 
Parse.Cloud.define("BestSeller", function(request, response) {
  var query = new Parse.Query("Album");
  query.descending("Sales");
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a songs, with error code:" + error.message);
    }
  });
});

/** Obtains a list of albums in descending order
  * Args: None
  * Returns: Albums by number of replays
  * Type: POST
  * URL: URL: https://parse_api/functions/BestAlbum
 */ 
Parse.Cloud.define("BestAlbum", function(request, response) {
  var query = new Parse.Query("Album");
  query.descending("Replays");
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a songs, with error code:" + error.message);
    }
  });
});

/** Obtains a list of songs
  * Args: None
  * Returns: All songs from database
  * Type: POST
  * URL: URL: https://parse_api/functions/GetSongs
 */ 
Parse.Cloud.define("GetSongs", function(request, response) {
  var query = new Parse.Query("Song");
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a songs, with error code:" + error.message);
    }
  });
});

/** Obtain a list with all artists
  * Args:   None
  * Returns: All artists 
  * Type: POST
  * URL: URL: https://parse_api/functions/GetArtists
 */ 
Parse.Cloud.define("GetArtists", function(request, response) {
  var query = new Parse.Query("Artist");
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a songs, with error code:" + error.message);
    }
  });
});


/** Obtains a list with all albums
  * Args: None
  * Returns: A successful message
  * Type: POST
  * URL: URL: https://parse_api/functions/GetAlbums
 */ 
Parse.Cloud.define("GetAlbums", function(request, response) {
  var query = new Parse.Query("Album");
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a songs, with error code:" + error.message);
    }
  });
});

/** Obtains a unique artist
  * Args: 
  *       ArtistId: Id of the artist to get
  * Returns: A successful message
  * Type: POST
  * URL: URL: https://parse_api/functions/GetArtist
 */ 
Parse.Cloud.define("GetArtist", function(request, response) {
  var query = new Parse.Query("Artist");
  query.equal("objectId",request.params.ArtistId);
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a artist, with error code:" + error.message);
    }
  });
});

/** Obtains a unique album
  * Args:
  *       id: ID of the album to get 
  * Returns: A successful message
  * Type: POST
  * URL: URL: https://parse_api/functions/GetAlbum
 */ 
Parse.Cloud.define("GetAlbum", function(request, response) {
  var query = new Parse.Query("Album");
  query.equalTo("objectId",request.params.id);
  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Failed to get a album, with error code:" + error.message);
    }
  });
});


/**
 *  POST METHODS 
 */

 /**  Insert a album into the database
  * Args: 
  *       name: name of the album
  *       year: year when the album was published
  *       price: price of the album
  * Returns: A message to success
  * Type: POST
  * URL: URL: https://parse_api/functions/PostAlbum
 */ 
Parse.Cloud.define("PostAlbum", function(request, response) {

	var album = new Album();

	album.set("Title", request.params.name);
	album.set("Year",  request.params.year);
	album.set("Price", request.params.price);

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

/** Post a sale relation
  * Args: 
  *     userID: user id
  *     albumID: user id 
  * Returns: a message to success
  * Type: POST
  * URL: URL: https://parse_api/functions/PostSale
 */ 
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



/**
 *  UPDATE METHODS 
 */

/** Register a play for a unique song
  * Args:   
  *       postID: Song ID
  *       albumID: Album ID
  * Returns: Response of success or message error
  * Type: POST
  * URL: URL: https://parse_api/functions/PlaySong
 */ 
  Parse.Cloud.define("PlaySong", function(request, response) {
    var song = new Parse.Object("Song");
    song.id = request.params.postId;
    song.increment("Replays");
    song.save().then(function() {     
      var album = new Parse.Object("Album");
      album.id = request.params.albumId;
      album.increment("Replays");
      album.save(null, {
        success: function(sale) {
          response.success('success');
        },
        error: function(sale, error) {
          response.error('Failed to create new replay');
        }
      });


    }, function(error) { 
      response.error(error);
    });
  });

/** To buy a album and register sell relation
  * Args: 
  *       postID: Album id to buy
  *       userID: Current user ID
  *       price:  Album Price
  * Returns:  Success message with sale id 
  * Type: POST
  * URL: https://parse_api/functions/BuyAlbum
 */ 

  Parse.Cloud.define("BuyAlbum", function(request, response) {
    /*Album sale increment*/
    var album = new Parse.Object("Album");
    album.id = request.params.postId;
    album.increment("Sales");
    album.save().then(function() { 
    
    /*User <-> Album Relation with a rnd sell price*/
    var _user = new User();
    _user.id = request.params.userID; 
   
    var _album = new Album();
    _album.id = request.params.albumID;
    
    var sale = new Sale();
    var rnd = parseFloat(Math.min(10+
      (Math.random()*(30 - 10)),30).toFixed(2));


    /* Declare relation betwenn user and album */
    var rel_user_sale = sale.relation("FK_User");
    rel_user_sale.add(_user);
    var rel_album_sale = sale.relation("FK_Album");
    rel_album_sale.add(_album);
    sale.set("Price",rnd);
    
    sale.save(null, {
      success: function(sale) {
        response.success('New sale created with objectId: ' + sale.id);
      },
      error: function(sale, error) {
        response.error('Failed to create new sale, with error code: ' + error.message);
      }
    });

    }, function(error) { 
      response.error(error);
    });
  });


