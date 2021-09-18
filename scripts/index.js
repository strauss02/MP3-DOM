/****************** Constants ******************/

const songsContainer = document.getElementById("songs-container")

const playButton = document.querySelector(".resume-button")
const pauseButton = document.querySelector(".pause-button")
const timeMarkStart = document.querySelector(".time-start")
const completedProgressBar = document.querySelector(".progressbar-completed")
const progressBar = document.querySelector(".progressbar")

const songInfo = document.getElementsByClassName("song-details")
const timeMark = document.getElementsByClassName("time-mark")
const songImage = document.getElementsByClassName("sidebar-pic")

const COLOR_RANGE = 300

const noSong = {
    title: "nothing is being played",
    artist: "",
    album: "",
    duration: 0,
    id: 0,
    coverArt: "./images/note.png",
}

let secondCount = 0
let globalInterval

/****************** Main Functions ******************/

/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {String} songId - the ID of the song to play
 */
function playSong(songId) {
    // change bar-left song descriptions according to the song selected by id.
    let song = getSongById(songId)
    let songInfo = document.getElementsByClassName("song-details")
    let timeMark = document.getElementsByClassName("time-mark")
    let songImage = document.getElementsByClassName("sidebar-pic")

    songImage[0].setAttribute("src", song.coverArt)
    timeMark[1].innerText = convertSecondsToMinutes(song.duration)
    songInfo[0].innerText = song.title
    songInfo[1].innerText = song.artist
    songInfo[2].innerText = song.album

    changeSong()
    resumePlayback()

    songBeingPlayed = song
}

/**
 * Creates a song DOM element based on a song object.
 * coverArt gets file path as argument
 */
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    let imgTemplate = createElement("img", [], ["album-img"], { src: coverArt })
    let spanWithImg = createElement("span", [imgTemplate], ["data-cell", "album-img-container"], [])
    let spanTitle = createElement("span", [title], ["data-cell", "song-title"])
    let spanAlbum = createElement("span", [album], ["data-cell", "song-album"])
    let spanArtist = createElement("span", [artist], ["data-cell", "song-artist"])
    let spanDuration = createElement("span", [convertSecondsToMinutes(duration)], ["data-cell", "song-duration"])
    let buttonPlay = createElement("button", ["Play"], ["play-button"])
    let buttonRemove = createElement("button", ["Remove"], ["remove-button"])
    let secretId = createElement("span", [id], ["secret-id"], { hidden: true })

    const children = [spanWithImg, spanTitle, spanAlbum, spanArtist, spanDuration, buttonPlay, buttonRemove, secretId]
    const classes = ["song-data-container"]
    const attrs = {}

    return createElement("div", children, classes, attrs)
}

/**
 * Creates a playlist DOM element based on a playlist object.
 */

function createPlaylistElement({ id, name, songs, duration, coverArt }) {
    let cardImg = createElement("img", [], ["card-album-img"], { src: coverArt })

    let cardImgContainer = createElement("div", [cardImg], ["card", "card-album-img-container"])

    let infoText = createElement("p", [name], [])

    let durationText = createElement("p", [`${duration} | ${songs.length} songs`], [])

    let cardPlaylistInfo = createElement("div", [infoText], ["card", "card-playlist-info"])

    let cardPlaylistDuration = createElement("div", [durationText], ["card", "card-playlist-duration"])

    const children = [cardImgContainer, cardPlaylistInfo, cardPlaylistDuration]
    const classes = ["playlist-card"]
    const attrs = {}
    return createElement("div", children, classes, attrs)
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"})
 *
 * createElement("div", ["just text"], ["nana", "banana"], {id: "bla"})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 */
function createElement(tagName, children = [], classes = [], attributes = {}) {
    newElement = document.createElement(tagName)
    newElement.append(...children)

    for (className of classes) {
        newElement.classList.add(className)
    }

    //go through the added attributes object. for each id value pair, use the setAttribute method to add the attribute to the element.
    for (i = 0; i < Object.keys(attributes).length; i++) {
        newElement.setAttribute(Object.keys(attributes)[i], Object.values(attributes)[i])
    }
    return newElement
}

function addSong(title, album, artist, duration, id = getVacantId(player.songs), coverImage) {
    assertStringNotEmpty(title, album, artist)
    assertIsNumber(id)
    assertIdNotUsed(id, player.songs)

    let newSong = {
        id: id,
        title: title,
        album: album,
        artist: artist,
        duration: duration,
        coverArt: coverImage,
    }
    player.songs.push(newSong)
    renderLists(player.songs, player.playlists)
    return newSong.id
}

/****************** Utility Functions ******************/

function getSongById(id) {
    for (let song of player.songs) {
        if (song.id === id) {
            return song
        }
    }
    throw new Error(`Whoops! we couldn't find a song that matches the ID you entered. Song ID entered: ${id}`)
}

function getSongIndexById(id) {
    let song = getSongById(id)
    return player.songs.indexOf(song)
}

function getPlaylistById(id) {
    assertIsNumber(id)
    for (let playlist of player.playlists) {
        if (playlist.id === id) {
            return playlist
        }
    }
    throw new Error(`Hmmm.. There's no playlist with that ID. The playlist ID entered: ${id}`)
}

function playlistDuration(id) {
    let playlist = getPlaylistById(id)
    let totalDuration = 0
    for (let song of playlist.songs) {
        let songDuration = getSongById(song).duration
        totalDuration += songDuration
    }
    return totalDuration
}

function removePlaylist(id) {
    let playlist = getPlaylistById(id)
    player.playlists.splice(player.playlists.indexOf(playlist), 1)
}

function deleteEmptyPlaylists(playlists) {
    for (playlist of playlists) {
        if (playlist.songs.length === 0) {
            removePlaylist(playlist.id)
        }
    }
}
function convertMinutesToSeconds(time) {
    //mmssRe matches mm:ss and allows more than two minute digits.
    let mmssRe = new RegExp(/(^\d{2,})[:](\d{2}$)/)
    let matches = time.match(mmssRe)
    if (!matches) {
        throw new Error(`Oy vey! time entered has to be in the mm:ss format! Time entered: ${time}`)
    }
    let seconds = parseInt(matches[2])
    let minutes = parseInt(matches[1])
    return seconds + minutes * 60
}

function convertSecondsToMinutes(time) {
    let minutes = Math.floor(time / 60)
    let seconds = time - minutes * 60
    let paddedMinutes = minutes.toString().padStart(2, 0)
    let paddedSeconds = seconds.toString().padStart(2, 0)
    return `${paddedMinutes}:${paddedSeconds}`
}

function sortTitlesAlphabetically(a, b) {
    return a.title.localeCompare(b.title)
}

function sortNameAlphabetically(a, b) {
    return a.name.localeCompare(b.name)
}

function playNothing() {
    songBeingPlayed = noSong

    songImage[0].setAttribute("src", noSong.coverArt)
    timeMark[1].innerText = convertSecondsToMinutes(noSong.duration)
    songInfo[0].innerText = noSong.title
    songInfo[1].innerText = noSong.artist
    songInfo[2].innerText = noSong.album
}

function removeSong(id) {
    //remove song from songs
    player.songs.splice(getSongIndexById(id), 1)

    // remove from playlists
    for (let playlist of player.playlists) {
        for (let songID of playlist.songs) {
            if (songID === id) {
                playlist.songs.splice(playlist.songs.indexOf(id), 1)
            }
        }
    }
}

//gets number (i) and goes through all the songs / playlists to see if anyone has it. if not, it is considered avaliable.
function getVacantId(array) {
    mainLoop: for (let i = 1; i <= array.length + 1; i++) {
        for (let item of array) {
            if (item.id === i) {
                continue mainLoop
            }
        }
        return i
    }
}

/****************** Render Functions ******************/

function renderLists(songs, playlists) {
    let songsList = document.getElementById("songs-container")
    clearElement(songsList)
    const sortedSongs = songs.sort(sortTitlesAlphabetically)

    for (song of sortedSongs) {
        songElement = createSongElement({
            id: song.id,
            title: song.title,
            album: song.album,
            artist: song.artist,
            duration: song.duration,
            coverArt: song.coverArt,
        })
        songsList.append(songElement)
    }

    let playlistList = document.getElementById("playlists-container")
    clearElement(playlistList)
    const sortedPlaylists = playlists.sort(sortNameAlphabetically)

    for (let playlist of sortedPlaylists) {
        if (playlist.songs.length != 0) {
            playlistElement = createPlaylistElement({
                id: playlist.id,
                name: playlist.name,
                songs: playlist.songs,
                duration: convertSecondsToMinutes(playlistDuration(playlist.id)),
                coverArt: playlist.coverArt,
            })
            playlistList.append(playlistElement)
        }
    }
    let durationElements = document.querySelectorAll(".song-duration")
    deleteEmptyPlaylists(playlists)
    styleEverySecondRow(document.getElementById("songs-container"))
    colorByDuration(durationElements)
}

function scaleDurationColor(duration) {
    if (duration < 120) {
        return "hsla(100, 100%, 50%, 1)"
    }
    if (duration > 420) {
        return "hsla(0, 100%, 50%, 1)"
    }
    let quotient = (1 - (duration - 120) / COLOR_RANGE) * 100
    let color = `hsl(${quotient}, 100%, 50%)`
    return color
}

function colorByDuration(elements) {
    for (element of elements) {
        let duration = convertMinutesToSeconds(element.innerText)
        let color = scaleDurationColor(duration)
        element.style.color = color
    }
}

function toggleButtons() {
    playButton.classList.toggle("hide-button")
    pauseButton.classList.toggle("hide-button")
}

function styleEverySecondRow(songsEl) {
    const songRows = songsEl.children
    for (i = 0; i < songRows.length; i += 2) {
        songRows.item(i).classList.add("dark-row")
    }
}

function showSongs() {
    let playlistsSection = document.getElementById("playlists-section")
    playlistsSection.classList.toggle("hide-section")
    let songsSection = document.getElementById("songs-section")
    songsSection.classList.toggle("hide-section")
}

function showPlaylists() {
    let songsSection = document.getElementById("songs-section")
    songsSection.classList.toggle("hide-section")
    let playlistsSection = document.getElementById("playlists-section")
    playlistsSection.classList.toggle("hide-section")
}

function showAddModal() {
    let addModal = document.querySelector(".modal-background")
    addModal.classList.toggle("hide-section")
}

/****************** Assert Functions ******************/

function assertStringNotEmpty(...args) {
    for (let arg of args) {
        if (typeof arg === "string" && arg.length != 0) {
            continue
        } else throw new Error(`Waahh! You must enter a valid string. you entered: ${arg}`)
    }
}

function assertIdNotUsed(id, array) {
    for (let item of array) {
        if (id === item.id) {
            throw new Error(`Whoops! seems like that ID is already in use. ID entered: ${id}`)
        }
    }
}

function assertIsNumber(arg) {
    if (typeof arg != "number") {
        throw new Error(`Whoopa! looks like you didn't enter a number. you entered: ${arg}`)
    }
}

function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild)
    }
}

/****************** Event Handlers ******************/

songsContainer.addEventListener("click", handleClick)

playButton.addEventListener("click", resumePlayback)
pauseButton.addEventListener("click", handlePause)

function handleForm(event) {
    const allInputs = document.querySelectorAll("input")
    console.log(allInputs)

    const newSongTitle = allInputs[2].value
    const newSongArtist = allInputs[3].value
    const newSongAlbum = allInputs[4].value
    const newSongduration = allInputs[5].value
    const newSongImage = allInputs[7].value

    addSong(newSongTitle, newSongAlbum, newSongArtist, newSongduration, undefined, newSongImage)
    console.log(player.songs)

    renderLists(player.songs, player.playlists)
}

function handleClick(event) {
    console.log(event.target)

    if (event.target.innerText === "Remove") {
        console.log("I want to remove")
        let parentElement = event.target.parentElement
        let songIdToRemove = parseInt(parentElement.lastChild.innerText)
        console.log(songIdToRemove)
        removeSong(songIdToRemove)

        renderLists(player.songs, player.playlists)
        if (songIdToRemove === songBeingPlayed.id) {
            playNothing()
        }
    } else if (event.target.innerText === "Play") {
        console.log("I want to play" + event.target.parentElement)
        let parentElement = event.target.parentElement
        let songIdToPlay = parseInt(parentElement.lastChild.innerText)
        console.log(songIdToPlay)
        playSong(songIdToPlay)
    }
}

function handlePause() {
    console.log("paused switched to true")
    toggleButtons()
    clearInterval(globalInterval)
}

function changeSong() {
    clearInterval(globalInterval)
    secondCount = 0
}

function resumePlayback() {
    if (pauseButton.classList.contains("hide-button")) {
        toggleButtons()
    }
    //if song was changed, back to 0
    globalInterval = setInterval(addCount, 1000)
}

function addCount() {
    if (secondCount > songBeingPlayed.duration - 1) {
        playNextInPlaylist()
    }

    secondCount++
    let quotient = secondCount / songBeingPlayed.duration
    console.log(secondCount + " " + songBeingPlayed.duration + " " + quotient)
    let ProgressBarCompletedLength = quotient * 100
    let progressbarDecreasedLength = (1 - quotient) * 100
    console.log(ProgressBarCompletedLength)
    console.log(progressbarDecreasedLength)
    completedProgressBar.style.width = `${ProgressBarCompletedLength}%`
    progressBar.style.width = `${progressbarDecreasedLength}%`
    timeMarkStart.innerText = convertSecondsToMinutes(secondCount)
}

function playNextInPlaylist() {
    clearInterval(globalInterval)
    currentSongIndex = getSongById(songBeingPlayed.id)
    let nextSongIndex = currentSongIndex + 1
    let nextSongId = player.songs[nextSongIndex].id
    console.log(nextSongId)
    playSong(nextSongId)
}

/****************** Initialize Page ******************/
let songBeingPlayed = noSong

renderLists(player.songs, player.playlists)

playNothing()

/****************** Select Elements ******************/
