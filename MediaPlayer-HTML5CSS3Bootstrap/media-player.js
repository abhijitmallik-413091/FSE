$(document).ready(function() {   
$('#like1'+'-bs3').html(localStorage.getItem("mediaplayer-like-count"));   
$('#dislike1'+'-bs3').html(localStorage.getItem("mediaplayer-dislike-count"));         
    $('i.glyphicon-thumbs-up').click(function(){    
        var $this = $(this);
		var likeCount=localStorage.getItem("mediaplayer-like-count");
		
        c = likeCount;   
        if (!c) c = 0;
        c++;
        $this.data('count',c);
		localStorage.setItem("mediaplayer-like-count",c);
        $('#'+this.id+'-bs3').html(c);
    });   
$('i.glyphicon-thumbs-down').click(function(){    
        var $this = $(this);
		var likeCount=localStorage.getItem("mediaplayer-dislike-count");
		
        c = likeCount;   
        if (!c) c = 0;
        c++;
        $this.data('count',c);
		localStorage.setItem("mediaplayer-dislike-count",c);
        $('#'+this.id+'-bs3').html(c);
    });   	
    $(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });                                        
}); 


// Wait for the DOM to be loaded before initialising the media player
document.addEventListener("DOMContentLoaded", function() { initialiseMediaPlayer(); }, false);

// Variables to store handles to various required elements
var mediaPlayer;
var playPauseBtn;
var muteBtn;
var progressBar;

function initialiseMediaPlayer() {
	// Get a handle to the player
	mediaPlayer = document.getElementById('media-video');
	
	// Get handles to each of the buttons and required elements
	playPauseBtn = document.getElementById('play-pause-button');
	muteBtn = document.getElementById('mute-button');
	progressBar = document.getElementById('progress-bar');

	// Hide the browser's default controls
	mediaPlayer.controls = false;
	
	// Add a listener for the timeupdate event so we can update the progress bar
	mediaPlayer.addEventListener('timeupdate', updateProgressBar, false);
	
	// Add a listener for the play and pause events so the buttons state can be updated
	mediaPlayer.addEventListener('play', function() {
		// Change the button to be a pause button
		changeButtonType(playPauseBtn, 'pause');
	}, false);
	mediaPlayer.addEventListener('pause', function() {
		// Change the button to be a play button
		changeButtonType(playPauseBtn, 'play');
	}, false);
	
	mediaPlayer.addEventListener('volumechange', function(e) { 
		// Update the button to be mute/unmute
		//$("#mute-button").toggleClass('glyphicon-headphones glyphicon-volume-off');
	}, false);	
	mediaPlayer.addEventListener('ended', function() { this.pause(); }, false);	
}

function togglePlayPause() {
	// If the mediaPlayer is currently paused or has ended
	if (mediaPlayer.paused || mediaPlayer.ended) {
		// Change the button to be a pause button
		changeButtonType(playPauseBtn, 'pause');
		// Play the media
		mediaPlayer.play();
	}
	// Otherwise it must currently be playing
	else {
		// Change the button to be a play button
		changeButtonType(playPauseBtn, 'play');
		// Pause the media
		mediaPlayer.pause();
	}
}

// Stop the current media from playing, and return it to the start position
function stopPlayer() {
	mediaPlayer.pause();
	mediaPlayer.currentTime = 0;
}

// Changes the volume on the media player
function changeVolume(direction) {
	if (direction === '+') mediaPlayer.volume += mediaPlayer.volume == 1 ? 0 : 0.1;
	else mediaPlayer.volume -= (mediaPlayer.volume == 0 ? 0 : 0.1);
	mediaPlayer.volume = parseFloat(mediaPlayer.volume).toFixed(1);
}

// Toggles the media player's mute and unmute status
function toggleMute() {
	
	$("#mute-button").toggleClass('glyphicon-headphones glyphicon-volume-off');
	if (mediaPlayer.muted) {
		// Change the cutton to be a mute button
		//changeButtonType(muteBtn, 'mute');
		// Unmute the media player
		mediaPlayer.muted = false;
	}
	else {
		// Change the button to be an unmute button
		//changeButtonType(muteBtn, 'unmute');
		// Mute the media player
		mediaPlayer.muted = true;
	}
}

// Replays the media currently loaded in the player
function replayMedia() {
	resetPlayer();
	mediaPlayer.play();
}

// Update the progress bar
function updateProgressBar() {
	// Work out how much of the media has played via the duration and currentTime parameters
	var percentage = Math.floor((100 / mediaPlayer.duration) * mediaPlayer.currentTime);
	percentage=isNaN(percentage)?0:percentage;
	// Update the progress bar's value
	progressBar.value =percentage;
	// Update the progress bar's text (for browsers that don't support the progress element)
	progressBar.innerHTML = percentage + '% played';
}

// Updates a button's title, innerHTML and CSS class to a certain value
function changeButtonType(btn, value) {
	btn.title = value;
	btn.innerHTML = value;
	btn.className = value;
}

// Loads a video item into the media player
function loadVideo() {
	for (var i = 0; i < arguments.length; i++) {
		var file = arguments[i].split('.');
		var ext = file[file.length - 1];
		// Check if this media can be played
		if (canPlayVideo(ext)) {
			// Reset the player, change the source file and load it
			resetPlayer();
			mediaPlayer.src = arguments[i];
			mediaPlayer.load();
			togglePlayPause();
			break;
		}
	}
}

// Checks if the browser can play this particular type of file or not
function canPlayVideo(ext) {
	var ableToPlay = mediaPlayer.canPlayType('video/' + ext);
	if (ableToPlay == '') return false;
	else return true;
}

// Resets the media player
function resetPlayer() {
	// Reset the progress bar to 0
	progressBar.value = 0;
	// Move the media back to the start
	mediaPlayer.currentTime = 0;
	// Ensure that the play pause button is set as 'play'
	changeButtonType(playPauseBtn, 'play');
}