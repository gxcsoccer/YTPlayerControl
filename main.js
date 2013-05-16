seajs.config({
    alias: {

    },
    base: '.',
    charset: 'utf-8'
});

define(function(require) {
    var player = require('src/YTPlayer');

    setTimeout(function() {
        player.setSingleMedia("http://www.youtube.com/watch?v=F3nbY3hIDLQ");
    }, 4000);

    window.addEventListener('message', function(event) {
        if (location.origin !== event.origin) {
            return;
        }

        var which = event.data.which + '';
        switch (which) {
        case '13':
            var playMode = JSON.parse(player.getPlaybackMode()).PlayMode;
            if (playMode == 'Pause') {
                player.resume();
            } else {
                player.pause();
            }
            break;
        case '77':
            player.fastForward();
            break;
        case '78':
            player.fastRewind();
            break;
        default:
            console.log(which);
        }
    }, false)
});