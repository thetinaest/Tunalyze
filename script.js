var userSearch = '';
var selection = document.getElementById("selection");
var searchResults = document.getElementById('search-results');
var myLibrary = document.getElementById('my-library');
var searchType = document.getElementById('resultType');


document.getElementById("form").addEventListener("submit", function(event) {
  event.preventDefault();
  var userInput = document.getElementById("searchbar").value;
  document.getElementById("searchbar").value = '';
  userSearch = userInput.replace(/ /g,"_");
  searchResults.innerHTML = '';

  if (selection.value == "byLyrics") {
    var apikey = "4a108961639704b98c6cb459f88e8e82";
    var params = "?q_lyrics=" + userSearch + "&page_size=3&page=1&s_track_rating=desc&apikey=" + apikey;
    var apiURL = "http://api.musixmatch.com/ws/1.1/track.search";
    var apiURLAndParams = apiURL + encodeURIComponent(params);
    var urlWithProxy = "https://octoproxymus.herokuapp.com?secret=walrus&url=" + apiURLAndParams;
  
    fetch(urlWithProxy)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var song = data['message'].body.track_list[0].track.track_name;
        var artist = data['message'].body.track_list[0].track.artist_name;
        var songLi = document.createElement('li');
        document.getElementById('initialLi').setAttribute("style", "display:none;")
        var li = document.createElement('li');
        li.innerText = 'Song: "' + song + '" by ' + artist;
        songLi.innerText = 'Song: "' + song + '" by ' + artist;
        resultType.innerText = "Song & Artist:"
        searchResults.appendChild(songLi);
        myLibrary.appendChild(li);
        // save song and artist to localstorage
        var savedSearches = localStorage.getItem("songs");
        if (!savedSearches) {
          localStorage.setItem("songs", JSON.stringify([{song: song, artist: artist}]));
          return;
        }
        savedSearches = JSON.parse(savedSearches);
        savedSearches.push({song: song, artist: artist});
        localStorage.setItem("songs", JSON.stringify(savedSearches));
      });
  }

    if (selection.value == "byArtist") {  
    fetch("https://theaudiodb.com/api/v1/json/2/search.php?s=" + encodeURI(userSearch))
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        var artists = data["artists"];
        var artist = artists[0].strArtist;
        var genre = artists[0].strGenre;
        var artistLi = document.createElement('li');
        var genreLi = document.createElement('li');
        resultType.innerText = "Artist & Genre:"
        artistLi.innerText = 'Artist: ' + artist;
        genreLi.innerText = "Genre: " + genre;
        searchResults.appendChild(artistLi);
        searchResults.appendChild(genreLi);
        //save artist and genre to localstorage
        var savedArtist = localStorage.getItem("artists");
        if (!savedArtist) {
          localStorage.setItem("artists", JSON.stringify([{artist: artist, genre: genre}]));
          return;
        }
        savedArtist = JSON.parse(savedArtist);
        savedArtist.push({artist: artist, genre: genre});
        localStorage.setItem("artists", JSON.stringify(savedArtist));
    });
  }
});

function displayLibrary() {
  var savedSearches = localStorage.getItem("songs");
  var savedArtist = localStorage.getItem("artists");
  savedSearches = JSON.parse(savedSearches);
  savedArtist = JSON.parse(savedArtist);
  if (savedSearches) {
    document.getElementById('initialLi').setAttribute("style", "display: none;");
    for (var i=0; i < savedSearches.length; i++) {
      var li = document.createElement('li');
      li.innerText = 'Song: "' + savedSearches[i].song + '" by: ' + savedSearches[i].artist;
      myLibrary.appendChild(li);
    }
  }

}


displayLibrary();