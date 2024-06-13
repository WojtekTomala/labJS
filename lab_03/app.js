let currentChannel = null;
const channels = [];
let metronomInterval = null;

const sounds = {
    'Q': 'sounds/boom.wav',
    'W': 'sounds/clap.wav',
    'E': 'sounds/hihat.wav',
    'R': 'sounds/kick.wav',
    'T': 'sounds/openhat.wav',
    'Y': 'sounds/ride.wav',
    'U': 'sounds/snare.wav',
    'I': 'sounds/tink.wav',
    'O': 'sounds/tom.wav'
};

function playSound(key) {
    const audio = new Audio(sounds[key]);
    const clicked = document.querySelector(`.${key}`);
    clicked.classList.add('active');
    audio.play();
}

// RECORDING:
function startRecording(channel) {
    channel.recording = true;
    channel.startTime = Date.now();
    channel.events = [];
}

function stopRecording(channel) {
    channel.recording = false;
}

function recordEvent(channel, key) {
    if (channel.recording) {
        const time = Date.now() - channel.startTime;
        channel.events.push({ key, time });
    }
}

// CHANNEL:
function playChanel(channel) {
    if (channel.events.length > 0) {
        channel.events.forEach(event => {
            setTimeout(() => playSound(event.key), event.time);
        });
    }
}

function playSelectedChannels() {
    channels.forEach(channel => {
        if (channel.selected) {
            playChanel(channel);
        }
    });
}


// METRONOM:
function toggleMetronom(bpm) {
    if (metronomInterval) {
        
        clearInterval(metronomInterval);
        metronomInterval = null;
    } 
    else {
        const interval = 60000 / bpm;
        metronomInterval = setInterval(() => 
            {
                const metronomSound = new Audio('sounds/tink.wav');
                metronomSound.play();
            }, interval);
    }
}

// EVENT HANDLING:
document.addEventListener('keydown', function(event) {
    const key = event.key.toUpperCase();
    if (sounds[key]) {
        playSound(key);
        if (currentChannel) {
            console.log(currentChannel, key);
            recordEvent(currentChannel, key);
        }
    }
});

document.addEventListener('keyup', function(event) {
    const key = event.key.toUpperCase();
    const clicked = document.querySelector(`.${key}`);
    if(clicked) clicked.classList.remove('active');
});

document.querySelectorAll('.key').forEach(function(keyElement) {
    keyElement.addEventListener('click', function() {
        const key = keyElement.getAttribute('data-key');
        playSound(key);
        if (currentChannel) {
            recordEvent(currentChannel, key);
        }
    });
});

document.getElementById('metronom-toggle').addEventListener('click', function() {
    const bpm = document.getElementById('bpm').value;
    toggleMetronom(bpm);
});

document.getElementById('add-channel').addEventListener('click', function() {
    const channel = {
        recording: false,
        selected: true,
        events: []
    };
    channels.push(channel);

    const channelElement = document.createElement('div');
    channelElement.classList.add('channel');
    channelElement.textContent = `Channel ${channels.length}`;

    const channelControls = document.createElement('div');
    channelControls.classList.add('channel-controls');

    const toggleSelect = document.createElement('input');
    toggleSelect.type = 'checkbox';
    toggleSelect.checked = true;
    toggleSelect.addEventListener('change', function() {
        channel.selected = toggleSelect.checked;
    });

    const recordButton = document.createElement('button');
    recordButton.textContent = 'Record';
    recordButton.addEventListener('click', function() {
        if (currentChannel) {
            console.log(currentChannel);
            stopRecording(currentChannel);
            currentChannel = null;
            recordButton.textContent = 'Record';
            channelElement.style.backgroundColor = '';
        } else {
            startRecording(channel);
            currentChannel = channel;
            recordButton.textContent = 'Stop';
            channelElement.style.backgroundColor = 'lightgreen';
        }
    });

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', function() {
        const index = channels.indexOf(channel);
        if (index > -1) {
            channels.splice(index, 1);
            channelElement.remove();
        }
    });
    channelControls.appendChild(recordButton);
    channelControls.appendChild(deleteButton);
    channelElement.appendChild(channelControls);
    channelControls.appendChild(toggleSelect);
    document.querySelector('.channels').appendChild(channelElement);
});

const playButton = document.createElement('button');
playButton.textContent = 'Play selected';
playButton.addEventListener('click', playSelectedChannels);
document.querySelector('.controls').appendChild(playButton);