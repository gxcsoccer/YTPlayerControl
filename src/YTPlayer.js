define(function(require, exports, module) {
	"use strict";
	require('https://www.youtube.com/iframe_api#');

	var player = null,
		videoId = null,
		toString = Object.prototype.toString;

	var YTPlayer = function() {

		};

	YTPlayer.prototype = {
		pause: function() {
			player && player.pauseVideo();
		},
		resume: function() {
			player && player.playVideo();
		},
		fastForward: function() {
			if (!player) {
				return;
			}

			var current = this.getCurrentPlayTime(),
				duration = this.getMediaDuration();
			if (current > (duration - 5)) {
				player.nextVideo();
			} else {
				player.seekTo(current + 10, true);
			}
		},
		fastRewind: function() {
			if (!player) {
				return;
			}

			var current = this.getCurrentPlayTime();
			if (current < 5) {
				player.previousVideo();
			} else {
				player.seekTo(current - 10, true);
			}
		},
		playFromStart: function() {
			player && player.playVideo();
		},
		playByTime: function(time) {
			if (!player) {
				return;
			}

			player.playVideo();
			player.seekTo(time, true);
		},
		getPlaybackMode: function() {
			var playbackMode = {
				PlayMode: 'Stop'
			},
				state = player.getPlayerState();
			switch (state) {
			case YT.PlayerState.ENDED:
				playbackMode.PlayMode = 'Stop';
				break;
			case YT.PlayerState.CUED:
				playbackMode.PlayMode = 'Cued';
				break;
			case YT.PlayerState.PLAYING:
			case YT.PlayerState.BUFFERING:
				playbackMode.PlayMode = 'Normal Play';
				break;
			case YT.PlayerState.PAUSED:
				playbackMode.PlayMode = 'Pause';
				break;
			default:
				console.warn("unknown player state: " + state);
			}

			return JSON.stringify(playbackMode);
		},
		getMediaDuration: function() {
			return player ? player.getDuration() : 0;
		},
		getCurrentPlayTime: function() {
			return player ? player.getCurrentTime() : 0;
		},
		setSingleMedia: function(url) {
			var vis = url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
			if (vis) {
				videoId = vis[1];
			}
			if (player) {
				player.loadVideoById(videoId, 0, "default");
			}
		},
		releasePlayer: function() {
			if (player) {
				player.destroy();
				player = null;
			}
		}
	};

	function onPlayerReady(event) {
		event.target.playVideo();
	}

	function onPlayerStateChange(event) {
		console.log(event);
	}

	window.onYouTubeIframeAPIReady = function() {
		player = new YT.Player('player', {
			height: '720',
			width: '1280',
			videoId: videoId,
			events: {
				'onReady': onPlayerReady,
				'onStateChange': onPlayerStateChange
			}
		});
	};

	return new YTPlayer();
});