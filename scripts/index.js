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
}

playSong(4)
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

    const children = [spanWithImg, spanTitle, spanAlbum, spanArtist, spanDuration]
    const classes = ["song-data-container"]
    const attrs = { onclick: `playSong(${id})` }

    return createElement("div", children, classes, attrs)
}

/**
 * Creates a playlist DOM element based on a playlist object.
 */

function createPlaylistElement({ id, name, songs, duration }) {
    let cardImg = createElement("img", [], ["card-album-img"], { src: "./images/playlist.png" })

    let cardImgContainer = createElement("div", [cardImg], ["card", "card-album-img-container"])

    let infoText = createElement("p", [name], [])

    let durationText = createElement("p", [duration], [])

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

function getSongById(id) {
    for (let song of player.songs) {
        if (song.id === id) {
            return song
        }
    }
    throw new Error(`Whoops! we couldn't find a song that matches the ID you entered. Song ID entered: ${id}`)
}

function styleEverySecondRow(songsEl) {
    const songRows = songsEl.children
    for (i = 0; i < songRows.length; i += 2) {
        songRows.item(i).classList.add("dark-row")
    }
}

function convertSecondsToMinutes(time) {
    let minutes = Math.floor(time / 60)
    let seconds = time - minutes * 60
    let paddedMinutes = minutes.toString().padStart(2, 0)
    let paddedSeconds = seconds.toString().padStart(2, 0)
    return `${paddedMinutes}:${paddedSeconds}`
}

function renderLists(songs, playlists) {
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
        let songsList = document.getElementById("songs-container")
        songsList.append(songElement)
    }

    const sortedPlaylists = playlists.sort(sortNameAlphabetically)

    for (let playlist of sortedPlaylists) {
        playlistElement = createPlaylistElement({
            id: playlist.id,
            name: playlist.name,
            songs: playlist.songs,
        })
        let playlistList = document.getElementById("playlists-container")
        playlistList.append(playlistElement)
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
    let addModal = document.querySelector(".modal")
}

function sortTitlesAlphabetically(a, b) {
    return a.title.localeCompare(b.title)
}

function sortNameAlphabetically(a, b) {
    return a.name.localeCompare(b.name)
}

renderLists(player.songs, player.playlists)
styleEverySecondRow(document.getElementById("songs-container"))

//Handle form

function handleForm(event) {
    const allInputs = document.querySelectorAll("input")
    console.log(allInputs)

    const newSongTitle = allInputs[2].value
    const newSongArtist = allInputs[3].value
    const newSongAlbum = allInputs[4].value
    const newSongduration = allInputs[5].value
    const newSongId = 999
    const newSongImage = allInputs[7].value

    addSong(newSongTitle, newSongAlbum, newSongArtist, newSongduration, newSongId, newSongImage)
    console.log(player.songs)

    renderLists(player.songs, player.playlists)
}

function addSong(title, album, artist, duration, id, coverImage) {
    let newSong = {
        id: id,
        title: title,
        album: album,
        artist: artist,
        duration: duration,
        coverArt: coverImage,
    }
    player.songs.push(newSong)
    return newSong.id
}
