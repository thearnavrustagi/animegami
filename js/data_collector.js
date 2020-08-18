const $mal_api_URL="https://api.jikan.moe/v3/";var music_player={isLoaded:!1,list:[],data:{}};fetch_path_from_MAL_API=async a=>{var e={};return await fetch($mal_api_URL+a).then(a=>a.json()).then(a=>e=a).catch(a=>console.log(a)),e},getAnimeCatalog=async()=>({"Top Airing Anime":await fetch_path_from_MAL_API("top/anime/1/airing"),"Most Popular Anime":await fetch_path_from_MAL_API("top/anime/1/bypopularity"),"Top Rated Anime":await fetch_path_from_MAL_API("top/anime/1"),"Most Loved Anime":await fetch_path_from_MAL_API("top/anime/1/favorite")}),getMangaCatalog=async()=>({"Top Mangas":await fetch_path_from_MAL_API("top/manga/1"),"Top Oneshots":await fetch_path_from_MAL_API("top/manga/1/oneshots"),"Most Popular Mangas":await fetch_path_from_MAL_API("top/manga/1/bypopularity"),"Most Loved Mangas":await fetch_path_from_MAL_API("top/manga/1/favorite")}),searchAndGetIdOfSong=a=>{fetch(`https://www.googleapis.com/youtube/v3/search?q=${encodeURI(a)}&maxResults=10&key=AIzaSyCGawbOX6rX-9KcdtC-P6PvhQe01UxSoKE`,{method:"get",Authorization:"Bearer 103357063173-obtca2o08aindpd2i7pe85d094moinc6.apps.googleusercontent.com",Accept:"application/json"}).then(a=>a.json()).then(a=>{for(item of a.items)if("youtube#video"==item.id.kind){playTheSong(item.id.videoId);break}}).catch(a=>console.log(a))},fetchPlaylistVidsFromYoutube=async a=>{fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${a}&type=playlist&key=AIzaSyCGawbOX6rX-9KcdtC-P6PvhQe01UxSoKE`,{method:"get",Authorization:"Bearer 103357063173-obtca2o08aindpd2i7pe85d094moinc6.apps.googleusercontent.com",Accept:"application/json"}).then(a=>a.json()).then(a=>displayMusicCatalog(a.items)).catch(a=>console.log(a))},playTheSong=a=>{music_player.isLoaded||null==a?null!=a&&(music_player.list.push(a),getNextSongData()):(i=0,music_player.list.push(a),loadPlayerHTML(),playTheNextSong())},jumpToTheSong=a=>{a<=music_player.length&&a>-1?(i=a,playTheNextSong()):alert("this location is not present")},loadPlayerHTML=async()=>{music_div=gen("div"),fetch("bodies/music_player.html").then(a=>a.text()).then(a=>{music_div.innerHTML=a}),$("body").appendChild(music_div)},i=0,playTheNextSong=async()=>{try{id=music_player.list[i],console.log(id),null!=music_player.data[id]&&null!=music_player.data[id]||await getYoutubeVideoData(id),$("music-np").textContent=music_player.data[id].snippet.localized.title,music_player.isLoaded?updateYoutubeIframe(id):loadYoutubeIframe(id),getNextSongData()}catch{removeMusicPlayer()}i++},removeMusicPlayer=()=>{try{$("music_player").remove(),music_player.list=[],music_player.isLoaded=!1}catch(a){}},playThePrevSong=()=>{0==i?alert("this is the first song"):(i-=2,console.log(i),playTheNextSong())},playOrPause=()=>{console.log($("play-pause").className),hasClass($("play-pause").className.baseVal,"fa-pause")?(music_player.player.pauseVideo(),$("play-pause").className.baseVal="svg-inline--fa fa-play fa-w-14 fa-lg mx-2 music_player_hover",console.log($("play-pause").className.baseVal),$("vinyl-record").style.animationPlayState="paused"):(music_player.player.playVideo(),$("play-pause").className.baseVal="svg-inline--fa fa-pause fa-w-14 fa-lg mx-2 music_player_hover",$("vinyl-record").style.animationPlayState=null)},updateYoutubeIframe=async a=>{console.log(a),music_player.player.stopVideo(),music_player.player.loadVideoById(a)},getNextSongData=async()=>{try{id=music_player.list[i+1],null!=music_player.data[id]&&null!=music_player.data[id]||await getYoutubeVideoData(id),$("music-up-next").textContent=music_player.data[id].snippet.localized.title}catch(a){$("music-up-next").textContent="Uh oh this is the end of the playlist"}},getYoutubeVideoData=async a=>{await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${a}&key=AIzaSyCGawbOX6rX-9KcdtC-P6PvhQe01UxSoKE`,{method:"get",Authorization:"Bearer 103357063173-obtca2o08aindpd2i7pe85d094moinc6.apps.googleusercontent.com",Accept:"application/json"}).then(a=>a.json()).then(e=>music_player.data[a]=e.items[0]).catch(a=>console.log(a))},askClient=()=>{},loadYoutubeIframe=a=>{var e;function t(a){a.target.playVideo()}function o(a){a.data==YT.PlayerState.ENDED&&playTheNextSong()}function i(a){console.log(a)}console.log(a),$("youtube_vid_player").innerHTML="",console.log("loading"),console.log(a),music_player.isLoaded=!0,e=new YT.Player("youtube_vid_player",{sandbox:"allow-scripts",videoId:a,id:a,events:{onReady:t,onStateChange:o,onError:i}}),music_player.player=e,console.log(e)},searchAndDisplayResults=async(a,e)=>{if("anime"!=(e=e.trim().toLowerCase())&&"manga"!=e&&(e="anime",displayErrorMessage("defaulting to <p style='font-family: monospace'> type = anime </p> due to wrong option")),a.length>2){data=await fetch_path_from_MAL_API(`search/${e}?q=${a}&page=1`),console.log(data);try{$("catalog").remove()}catch(a){}if(0==data.results.length)displayErrorMessage("Sorry, No results were found for the query ' "+a+" '");else for(await renderCatalogRow(data,"Search Results For : "+a,e,"results",50),wHeight=window.innerHeight,i=0;i<wHeight;i++)setTimeout((function(){document.body.scrollTop++,document.documentElement.scrollTop++}),25)}else displayErrorMessage("the query is too short, query should be atleast 3 digits")},displayGenre=async(a,e)=>{data=await fetch_path_from_MAL_API(`genre/${e}/${a}/1`),renderCatalogRow(data,"Genre : "+data.mal_url.name,"anime",50)},displayErrorMessage=a=>{M.toast({html:a,classes:"notification blurred-backface"})};