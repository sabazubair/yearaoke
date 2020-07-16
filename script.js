// 1. create namespace obj
const karaoke = {};
// 2. save api key as a property
karaoke.apiKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWYwMGE5Yzg5MDk0Y2QwNDNiNzFlNzI5In0sImlhdCI6MTU5Mzg3ODk4NCwiZXhwIjoxNjI1NDE0OTg0fQ.wWto2hXHZfw7EM4cyNNS8q-9lTiPWGVGGszJXoFsDXc";
// 3. save url endpoint as a property
karaoke.retroBaseUrl = "https://retroapi.hackeryou.com/api";
// 19.
karaoke.lyricBaseUrl = "https://api.lyrics.ovh/v1";
// --- Cache the variables you'll be using a lot so JS will not to go searching for it everytime they're called. ---
// 23.
karaoke.$lyrics = $(".lyrics");
// 24.
karaoke.$songTitle = $(".songTitle");
// 25.
karaoke.$artist = $(".artist");
// 28.
karaoke.$curtain = $(".curtain");

// 8. define karaoke.getRetroDetails
// We can pass ADDITIONAL info by using a data field in our ajax request. Remember to match key name exactly as it's typed in the api documentation
// The more a function does, the less reuseable it becomes.
// This AJAX call returns /years --> a promise
karaoke.getRetroDetails = () => {
  const yearsResponse = $.ajax({
    url: `${karaoke.retroBaseUrl}/years`,
    dataType: "json",
    method: "GET",
    data: {
      apiKey: karaoke.apiKey,
    },
  });
  return yearsResponse;
};

// 20.
karaoke.getLyrics = (artist, title) => {
  const lyricsResponse = $.ajax({
    url: `${karaoke.lyricBaseUrl}/${artist}/${title}`,
    method: "GET",
    dataType: "json",
  });
  // 22.
  return lyricsResponse;
};

// Refactor - Implicit Return
// karaoke.getLyrics = (artist, title) =>
//   $.ajax({
//     url: karaoke.lyricBaseUrl,
//     method: "GET",
//     dataType: "json",
//     data: {
//       artist: artist,
//       title: title,
//     },
//   });

// 10. obtain random year from the array of years we passed in
karaoke.getRandomElement = (array) => {
  const i = Math.floor(Math.random() * array.length);
  return array[i];
};

// 11.
karaoke.setSong = () => {
  // 33. ------- //
  // 7. on initialization, pull in data...alternatively: this occurs on click but that would expose our users to the wait time.
  // retroDetails returns a promise; that's why we can call .then
  const retroDetails = karaoke.getRetroDetails();
  // 9. View response in the console
  retroDetails.then((res) => {
    // --- begin ---
    // console.log(res) - array of 36 elements
    const randomYear = karaoke.getRandomElement(res);
    // console.log(randomYear); - singular year
    // 12.
    const songArray = randomYear.songs;
    // console.log(songArray);
    // 13.
    const randomSong = karaoke.getRandomElement(songArray);
    // --- end ---
    // console.log(res);
    // 14. save return value of randomSong in this variable
    // const song = karaoke.setSong(res);
    // 15. pull out info and pass it into song lyric api call
    // 36. refactored to accept randomSong
    karaoke.getSongInfo(randomSong);
  });
  // ------- //
  // 35. remove return randomSong, store in song, pass song info
  // return randomSong;
};

// 17. Refactored
karaoke.formatArtist = (artist) =>
  artist.split(" feat.")[0].replace(" and", " &").trim();
// karaoke.formatArtist = (artist) => {
//   const soloArtist = artist.split(" feat.")[0];
//   const formattedArtist = soloArtist.replace(" and", " &").trim();
//   return formattedArtist;
// };

// 16. retrieve song title & artist from song object
karaoke.getSongInfo = (song) => {
  const title = song.title;
  const artist = song.artist;
  // 27. APPEND
  karaoke.$songTitle.append(title);
  karaoke.$artist.append(artist);
  // 18.
  const formattedArtist = karaoke.formatArtist(artist);
  // console.log(formattedArtist);
  // 21.
  const lyricsData = karaoke.getLyrics(formattedArtist, title);
  // 22. + 26 - APPEND
  lyricsData.then((results) => karaoke.$lyrics.append(results.lyrics));
};

// 30.
karaoke.refreshSong = () => {
  karaoke.$songTitle.empty();
  karaoke.$artist.empty();
  karaoke.$lyrics.empty();
  karaoke.setSong();
};

// 4. create document.ready
// 5. create init method; init helps us compartmentalize our functionality. On page initialized: do this.
karaoke.init = () => {
  // console.log("app is initialized");
  // 31.
  karaoke.setSong();
  // 29.
  let curtainOpen = true;
  karaoke.$curtain.on("click", () => {
    // 37.
    if (curtainOpen) {
      karaoke.refreshSong();
    }
    curtainOpen = !curtainOpen;
  });
};

// 6. call init method within doc.ready
$(document).ready(function () {
  karaoke.init();
});
