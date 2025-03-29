console.log('Lets write javascript');
let currentSong = new Audio();
let songs;
let currFolder;
const previous = document.getElementById('previous');
const next = document.getElementById('next');
const play = document.getElementById('play');

// Hardcoded playlists and songs
const playlists = {
    "happy": ["Asal Mein.mp3", "Saari Ki Saari.mp3", "Bhula Diya.mp3", "Tera Zikr.mp3"],
    "mood": ["04 - Kambakkht Ishq - www.downloadming.com.mp3", "Galat Baat Hai - Main Tera Hero 128 Kbps.mp3"],
    "life": ["Humsafar- Badrinath Ki Dulhania 128 Kbps.mp3", "Isq Risk - Mere Brother Ki Dulhan 128 Kbps.mp3", "Kesariya - Brahmastra 128 Kbps.mp3", "Main Koi Aisa Geet Gaoon - Yes Boss 128 Kbps.mp3", "Tera Hone Laga Hoon - Ajab Prem Ki Ghazab Kahani 128 Kbps.mp3", "Ve Haaniyaan - Avvy Sra 128 Kbps.mp3"],
    "curve": ["Jeena Jeena - Badlapur.mp3", "Mere Bina - Crook.mp3", "Tere Hawaale - Laal Singh Chaddha.mp3", "Tu Hi Mera .mp3", "Tum Mile - Tum MMile.mp3"],
    "enjoy": ["Dil Tu Jaan Tu - Gurnazar 128 Kbps.mp3", "Tere Bin.mp3", "With You - AP Dhillon 128 Kbps.mp3", "Zaroor - Djjohal.fm.mp3"],
    "sad" : ["Kinni Kinni - Ghost (2023) 128 Kbps.mp3"],
    "sleep" : ["Baamulaiza - De Dana Dan 128 Kbps.mp3"]
};

const playlistInfo = {
    "curve": {
        "title": "Chill Songs",
        "description": "Songs for you",
        cover: "songs/curve/cover.jpg"
    },
    "enjoy": {
        "title": "Punjabi Hits!!",
        "description": "Songs for you",
        cover: "songs/enjoy/cover.jpg"
    },
    "happy": {
        "title": "Darshan Raval",
        "description": "Songs for you",
        cover: "songs/happy/cover.jpg"
    },
    "life": {
        "title": "Vibes",
        "description": "Songs for you",
        cover: "songs/life/cover.jpg"
    },
    "mood": {
        "title": "Enjoy!!",
        "description": "Songs for you",
        cover: "songs/mood/cover.jpg"
    },
    "sad": {
        title: "Relax",
        description: "Songs for you",
        cover: "songs/sad/cover.jpg"
    },
    "sleep": {
        title: "Sleep",
        description: "Songs for you",
        cover: "songs/sleep/cover.jpg"
    }
};

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    songs = playlists[folder] || [];

    // Show all the songs in playlist
    let songUL = document.querySelector(".songList ul");
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML += `
            <li>
                <img class="invert" width="34" src="images/music.svg" alt="">
                <div class="info">
                    <div>${song.replaceAll("%20", " ")}</div>
                    <div></div>
                </div>
                <div class="playnow">
                    <span>Play Now</span>
                    <img class="invert" src="images/play.svg" alt="">
                </div>
            </li>`;
    }

    // Attach an event listener to each song
    Array.from(document.querySelectorAll(".songList li")).forEach(e => {
        e.addEventListener("click", () => {
            playMusic(e.querySelector(".info div").innerHTML.trim());
        });
    });

}

function playMusic(track, pause = false) {
    currentSong.src = `https://raw.githubusercontent.com/muskankumari8/muskankumari8.github.io/main/songs/${currFolder}/` + track;
    if (!pause) {
        currentSong.play();
        play.src = "images/pause (1).svg";
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}

function displayAlbums() {
    console.log("Displaying albums");
    let cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = ""; // Clear existing content

    Object.keys(playlistInfo).forEach(folder => {
        let info = playlistInfo[folder];
        cardContainer.innerHTML += `
            <div data-folder="${folder}" class="card">
                <div class="play">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                            stroke-linejoin="round" />
                    </svg>
                </div>
                <img src="${info.cover}" alt="">
                <h2>${info.title}</h2>
                <p>${info.description}</p>
            </div>`;
    });

    // Load the playlist whenever card is clicked
    Array.from(document.querySelectorAll(".card")).forEach(e => {
        e.addEventListener("click", () => {
            console.log("Fetching Songs");
            getSongs(e.dataset.folder);
            playMusic(songs[0]);
        });
    });
}

async function main() {


    //get the list of all songs
    getSongs("curve");
    playMusic(songs[0], true);

    // Display all the albums on the page
    displayAlbums();


    //attach an event listener to play, next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "images/pause (1).svg"
        }
        else {
            currentSong.pause()
            play.src = "images/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })


    
   
// Add an event listener to previous
previous.addEventListener("click", () => {
    currentSong.pause();
    console.log("Previous clicked");
    
    let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop())); // Decoding URI and getting the last part of the URL
    if (index > 0) {
        playMusic(songs[index - 1]);
    } else {
        playMusic(songs[songs.length - 1]); // Loop back to the last song if at the beginning
    }
});

// Add an event listener to next
next.addEventListener("click", () => {
    currentSong.pause();
    console.log("Next clicked");

    let index = songs.indexOf(decodeURIComponent(currentSong.src.split("/").pop())); // Decoding URI and getting the last part of the URL
    if (index < songs.length - 1) {
        playMusic(songs[index + 1]);
    } else {
        playMusic(songs[0]); // Loop back to the first song if at the end
    }
});




    

    // Add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume > 0) {
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Add event listener to mute the track
    document.querySelector(".volume>img").addEventListener("click", e => {
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("images/volume.svg", "images/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else {
            e.target.src = e.target.src.replace("images/mute.svg", "images/volume.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })



}
main()
