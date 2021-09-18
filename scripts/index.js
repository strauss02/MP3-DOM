let songBeingPlayed
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
    songBeingPlayed = song
}

playNothing()
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

function createPlaylistElement({ id, name, songs, duration }) {
    let cardImg = createElement("img", [], ["card-album-img"], { src: "./images/playlist.png" })

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

    const sortedPlaylists = playlists.sort(sortNameAlphabetically)

    for (let playlist of sortedPlaylists) {
        playlistElement = createPlaylistElement({
            id: playlist.id,
            name: playlist.name,
            songs: playlist.songs,
            duration: convertSecondsToMinutes(playlistDuration(playlist.id)),
        })
        let playlistList = document.getElementById("playlists-container")
        playlistList.append(playlistElement)
    }

    styleEverySecondRow(document.getElementById("songs-container"))
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

function sortTitlesAlphabetically(a, b) {
    return a.title.localeCompare(b.title)
}

function sortNameAlphabetically(a, b) {
    return a.name.localeCompare(b.name)
}

renderLists(player.songs, player.playlists)

//Handle form

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

function handleForm(event) {
    const allInputs = document.querySelectorAll("input")
    console.log(allInputs)

    const newSongTitle = allInputs[2].value
    const newSongArtist = allInputs[3].value
    const newSongAlbum = allInputs[4].value
    const newSongduration = allInputs[5].value
    const newSongImage = allInputs[7].value

    addSong(newSongTitle, newSongAlbum, newSongArtist, newSongduration, "", newSongImage)
    console.log(player.songs)

    renderLists(player.songs, player.playlists)
}
/********************************* Utility Functions *********************************/
function getSongIndexById(id) {
    let song = getSongById(id)
    return player.songs.indexOf(song)
}

function removeSong(id) {
    //remove song from songs
    player.songs.splice(getSongIndexById(id), 1)

    // remove from playlists
    // for (let playlist of player.playlists) {
    //     for (let songID of playlist.songs) {
    //         if (songID === id) {
    //             playlist.songs.splice(playlist.songs.indexOf(id), 1)
    //         }
    //     }
    // }
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

const songsContainer = document.getElementById("songs-container")
songsContainer.addEventListener("click", handleClick)

function playNothing() {
    let songInfo = document.getElementsByClassName("song-details")
    let timeMark = document.getElementsByClassName("time-mark")
    let songImage = document.getElementsByClassName("sidebar-pic")

    songImage[0].setAttribute("src", "./images/note.png")
    timeMark[1].innerText = "00:00"
    songInfo[0].innerText = "nothing is being played"
    songInfo[1].innerText = ""
    songInfo[2].innerText = ""
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
