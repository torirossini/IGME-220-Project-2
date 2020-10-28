import * as utils from "./utils.js";

// 1 - our WebAudio context, **we will export and make this public at the bottom of the file**
let audioCtx;

let progressBar, progressEl, currTimeEl, durationEl;

let paused = true;

// **These are "private" properties - these will NOT be visible outside of this module (i.e. file)**
// 2 - WebAudio nodes that are part of our WebAudio audio routing graph
let element, sourceNode, analyserNode, pannerNode, gainNode;

// 3 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    gain:.5,
    numSamples:256,
    pan:1
});

// 4 - create a new array of 8-bit integers (0-255)
// this is a typed array to hold the audio frequency data
let audioData = new Uint8Array(DEFAULTS.numSamples/2);

// **Next are "public" methods - we are going to export all of these at the bottom of this file**
function setupWebaudio(filepath)
{

// 1 - The || is because WebAudio has not been standardized across browsers yet
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    
    audioCtx = new AudioContext();


// 2 - this creates an <audio> element
    element = new Audio();


// 3 - have it point at a sound file
    loadSoundFile(filepath);


// 4 - create an a source node that points at the <audio> element
    sourceNode = audioCtx.createMediaElementSource(element);


// 5 - create an analyser node
// note the UK spelling of "Analyser"
analyserNode = audioCtx.createAnalyser();
/*
// 6
We will request DEFAULTS.numSamples number of samples or "bins" spaced equally 
across the sound spectrum.


If DEFAULTS.numSamples (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
the third is 344Hz, and so on. Each bin contains a number between 0-255 representing 
the amplitude of that frequency.
*/ 

// fft stands for Fast Fourier Transform
    
    analyserNode.fftSize = DEFAULTS.numSamples;


// 7 - create a gain (volume) node
    gainNode = audioCtx.createGain();
    gainNode.gain.value = DEFAULTS.gain;
    
    pannerNode = audioCtx.createStereoPanner();


// 8 - connect the nodes - we now have an audio graph
    sourceNode.connect(analyserNode);
    analyserNode.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(audioCtx.destination);

    progressBar = document.querySelector("#progress").getContext('2d'); 

    let currentTime = element.currentTime;
    let duration = element.duration;

    //console.log("asdfsfdds   " + duration);
    durationEl = document.querySelector("#duration");
    currTimeEl = document.querySelector("#current-time");
    progressEl = document.querySelector("#progress");

    durationEl.innerHTML = utils.convertElapsedTime(0);
    currTimeEl.innerHTML =  utils.convertElapsedTime(currentTime);

    loop();





// make sure that it's a Number rather than a String
}

function loop(){
/* NOTE: This is temporary testing code that we will delete in Part II */
	requestAnimationFrame(loop);
    updateBar();
};

function updateBar(){
    
    if(!paused)
        {                progressBar.clearRect(0,0,progressEl.width,50);
                progressBar.fillStyle = "#95BF74";
                progressBar.fillRect(0,0,progressBar.width, progressBar.height);

                var currTime = element.currentTime;
                var duration = element.duration;

                currTimeEl.innerHTML =  utils.convertElapsedTime(currTime);

                durationEl.innerHTML = utils.convertElapsedTime(duration);

                var percentage = currTime/duration;

                var progress = (progressEl.width * percentage);

                progressBar.fillRect(0,0,progress,50);
        }

    
    
}

function loadSoundFile(filepath){
    element.src = filepath;
}

function playCurrentSound(){
    element.play();
    paused = false;
    
    currTimeEl.innerHTML =  utils.convertElapsedTime(0);
}

function pauseCurrentSound(){
    element.pause();
    paused = true;
}

function setVolume(value){
    value = Number(value);
    gainNode.gain.value = value;
}

function setPan(value){
    value = Number(value);
    pannerNode.pan.value = value;
}


export{audioCtx, setupWebaudio, playCurrentSound, pauseCurrentSound, loadSoundFile, setVolume, analyserNode, setPan};