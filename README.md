# MP3 DOM

The users of your MP3 player complained about it being inconvenient for regular (non-programmer) people. Time to build a GUI!

Your task is to create a webpage that conveniently displays the songs and playlists in a player object. The player object will have the same structure as in your previous assignment.

## General Instructions

1. Fork this repo into your account.
2. Clone the forked repo to your computer.
3. Create a new git branch for your work.
4. Complete the requirements.
5. Submit your work.
6. May the odds be ever in your favor!

## New Requirements!
- There is now a section for adding new songs to the player. Make it work!
- Add a play button to every song. Clicking it will play that song.
- Add a remove button to every song. Clicking it will remove the song from the playlist.
- There should be only one event listener on the entire songs list, that handles all play and remove events of songs.
- You are given new template files to use: `index.new.html` and `index.new.js`.

## Webpage Requirements

Your webpage should contain 2 lists:

-   A list of the `songs` in the player, sorted by their titles
-   A list of the `playlists` in the player, sorted by their names

### Songs

Each song list item shall display the following details:

-   song `title`
-   `album` name
-   `artist` name
-   an image with the album's cover art (`coverArt`)
-   song `duration` (in `mm:ss` format, of course)

One song can be played at a time. There should be some indication of the currently playing song (the specific indication is up to you). Clicking on a song will change the indication of the currently playing song. We have already provided code that handles the click event for you.

### Playlists

Every playlist list item should display the following information:

-   playlist `name`
-   the number of songs in the playlist
-   the total duration of the playlist

## Bonus Requirements

-   After a song begins to play, it automatically switches to the next one when the song duration has passed.
-   The color of the durations of songs should reflect their length. A duration of less than 2 min will show green, and will be gradually redder until it is completely red for durations that are above 7 min.
-   When a song is removed, all playlists in the page will also be updated.
-   When adding a new song, the songs list will remain sorted by title.
-   Anything else you can think of...

## Technical Instructions

You are provided with a template for your project:

-   an HTML file (`index.html`)
-   a linked, empty CSS file (`style.css`)
-   a linked JS script with a sample `player` object (`player.js`)
-   a linked JS script with a template for your code (`index.js`)
-   an `images` folder with the webpage icon and song cover art

The HTML defines the basic structure of the page. There are 2 container elements - one for the songs and one for the playlists. You may add more structural elements to the HTML (headings etc.), but the songs and playlists themselves must be generated using JS, based on the `player` object.

## Submission

1. On GitHub, open a pull request from your branch to the main branch.
2. **Do not merge the pull request!**
3. Add the user `Cyber4sPopo` as collaborator to your repo.
4. Submit a link to the pull request in Google Classroom.

## Additional Remarks

-   **Avoid duplication!** Use JS functions and CSS classes wisely.
-   Maintain high coding standards. Keep your code readable, indented properly, commented and indicative.
-   Maintain a proper git workflow. Commit often, push often, write informative commit messages.
-   You are free to style your webpage however you like. Make it BEAUTIFUL!
