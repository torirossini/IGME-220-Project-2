/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

// We will write the functions in this file in the traditional ES5 way
// In this instance, we feel the code is more readable if written this way
// If you want to re-write these as ES6 arrow functions, to be consistent with the other files, go ahead!

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './canvas.js';

const drawParams = {
    showGradient:true,
    showBars:true,
    showCircles:true,
    currentFilter:"none",
    invertColors:false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	sound1  :  "media/flux.mp3",
    /*K_Q*/ 81 :  {file:"media/notes/a-3.mp3", note:"A-3"},
    /*K_W*/ 87 :  {file:"media/notes/a-4.mp3", note:"A-4"},
    /*K_E*/ 69 :  {file:"media/notes/a-5.mp3", note:"A-5"},
    /*K_R*/ 82 :  {file:"media/notes/a3.mp3", note:"A3"},
    /*K_T*/ 84 :  {file:"media/notes/a4.mp3", note:"A4"},
    /*K_Y*/ 89 :  {file:"media/notes/a5.mp3", note:"A5"},
    /*K_U*/ 85 :  {file:"media/notes/b3.mp3", note:"B3"},
    /*K_I*/ 73 :  {file:"media/notes/b4.mp3", note:"B4"},
    /*K_O*/ 79 :  {file:"media/notes/b5.mp3", note:"B5"},
    /*K_P*/ 80 :  {file:"media/notes/b5.mp3", note:"B5"},
    
    /*K_A*/ 65 :  {file:"media/notes/c-3.mp3", note:"C-3"},
    /*K_S*/ 83 :  {file:"media/notes/c-4.mp3", note:"C-4"},
    /*K_D*/ 68 :  {file:"media/notes/c-5.mp3", note:"C-5"},
    /*K_F*/ 70 :  {file:"media/notes/c3.mp3", note:"C3"},
    /*K_G*/ 71 :  {file:"media/notes/c4.mp3", note:"C4"},
    /*K_H*/ 72 :  {file:"media/notes/c5.mp3", note:"C5"},
    /*K_J*/ 74 :  {file:"media/notes/c6.mp3", note:"C6"},
    /*K_K*/ 75 :  {file:"media/notes/d-3.mp3", note:"D-3"},
    /*K_L*/ 76 :  {file:"media/notes/d-4.mp3", note:"D-4"},
    
    /*K_Z*/ 90 :  {file:"media/notes/d-5.mp3", note:"D-5"},
    /*K_X*/ 88 :  {file:"media/notes/d3.mp3", note:"D3"},
    /*K_C*/ 67 :  {file:"media/notes/d4.mp3", note:"D4"},
    /*K_V*/ 86 :  {file:"media/notes/d5.mp3", note:"D5"},
    /*K_B*/ 66 :  {file:"media/notes/e3.mp3", note:"E3"},
    /*K_N*/ 78 :  {file:"media/notes/e4.mp3", note:"E4"},
    /*K_M*/ 77 :  {file:"media/notes/e5.mp3", note:"E5"},

});

//Pulled base keyboard input from here: https://www.dummies.com/web-design-development/javascript/how-to-read-the-keyboard-on-javascripts-canvas-for-html5-and-css3-programming

var output;
var currentKey;
var currentFilter;
let duration,currentTime;

 function updateKeys(e){
    //set current key
     if(DEFAULTS[e.keyCode])
         {
                currentKey = e.keyCode;
                output.innerHTML = "current key: " + DEFAULTS[currentKey].note;
                playNote(e); 
         }
     else{
         console.log("Note not assigned for key " + e.keyCode);
     }

 }

function playNote(e){
     console.log('audioCtx.state before = $(audio.audioCtx.state)');
    
    audio.pauseCurrentSound();
    e.target.dataset.playing = "no";

    if (audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
    }
    var filepath = DEFAULTS[currentKey].file;
    console.log(filepath);
    audio.loadSoundFile(filepath);
    console.log('audioCtx.state after = $(audio.audioCtx.state)');
    
    audio.playCurrentSound();
}
 
 //keyboard constants simplify working with the keyboard
 var K_A = 65, K_B = 66, K_C = 67, K_D = 68, K_E = 69, K_F = 70, K_G = 71, K_H = 72, K_I = 73, K_J = 74, K_K = 75, K_L = 76, K_M = 77, K_N = 78, K_O = 79, K_P = 80, K_Q = 81, K_R = 82, K_S = 83, K_T = 84, K_U = 85, K_V = 86, K_W = 87, K_X = 88, K_Y = 89, K_Z = 90, K_LEFT = 37, K_RIGHT = 39, K_UP = 38, K_DOWN = 40, K_SPACE = 32, K_ESC = 27, K_PGUP = 33, K_PGDOWN = 34, K_HOME = 36, K_END = 35, K_0 = 48, K_1 = 49, K_2 = 50, K_3 = 51, K_4 = 52, K_5 = 53, K_6 = 54, K_7 = 55, K_8 = 56, K_9 = 57;



function init(){
	console.log("init called");
	console.log(`Testing utils.getRandomColor() import: ${utils.getRandomColor()}`);
    
    output = document.getElementById("output");
    document.onkeydown = updateKeys;
    
    audio.setupWebaudio(DEFAULTS.sound1);
	let canvasElement = document.querySelector("#visualizer"); // hookup <canvas> element
	setupUI(canvasElement);
    canvas.setupCanvas(canvasElement,audio.analyserNode);   
    audio.loadSoundFile(trackSelect.value);
    loop();
}

function loop(){
/* NOTE: This is temporary testing code that we will delete in Part II */
	requestAnimationFrame(loop);
    
    canvas.draw(drawParams);
    
	// 1) create a byte array (values of 0-255) to hold the audio data
//	// normally, we do this once when the program starts up, NOT every frame
//	let audioData = new Uint8Array(audio.analyserNode.fftSize/2);
//	
//	// 2) populate the array of audio data *by reference* (i.e. by its address)
//	audio.analyserNode.getByteFrequencyData(audioData);
//	
	// 3) log out the array and the average loudness (amplitude) of all of the frequency bins
//		console.log(audioData);
//		
//		console.log("-----Audio Stats-----");
//		let totalLoudness =  audioData.reduce((total,num) => total + num);
//		let averageLoudness =  totalLoudness/(audio.analyserNode.fftSize/2);
//		let minLoudness =  Math.min(...audioData); // ooh - the ES6 spread operator is handy!
//		let maxLoudness =  Math.max(...audioData); // ditto!
//		// Now look at loudness in a specific bin
//		// 22050 kHz divided by 128 bins = 172.23 kHz per bin
//		// the 12th element in array represents loudness at 2.067 kHz
//		let loudnessAt2K = audioData[11]; 
//		console.log(`averageLoudness = ${averageLoudness}`);
//		console.log(`minLoudness = ${minLoudness}`);
//		console.log(`maxLoudness = ${maxLoudness}`);
//		console.log(`loudnessAt2K = ${loudnessAt2K}`);
//		console.log("---------------------");
}

function setupUI(canvasElement){
    //D - track input
    let trackSelect = document.querySelector("#trackSelect");
    // A - hookup fullscreen button
    const fsButton = document.querySelector("#fsButton");
//
    // add .onclick event to button
    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };
//    
//    const gradientCB = document.querySelector("#gradientCB");
//    const barsCB = document.querySelector("#barsCB");
//    const circlesCB = document.querySelector("#circlesCB");
    let radioButtons = document.querySelectorAll("input[type=radio][name=filter]");
    for (let r of radioButtons){
			r.onchange = function(e){
				// #7 - form values are returned as Strings, so we have to convert them to a Number
                drawParams.currentFilter = e.target.value;
			}
    }
//    const embossCB = document.querySelector("#embossCB");
//    const invertCB = document.querySelector("#invertCB");
//    
    gradientCB.onchange = e =>{
        drawParams.showGradient = !drawParams.showGradient;
    }
    
    barsCB.onchange = e =>{
        drawParams.showBars = !drawParams.showBars;

    }
    
    circlesCB.onchange = e =>{
        drawParams.showCircles = !drawParams.showCircles;

   }
    
//    
//    embossCB.onchange = e =>{
//        drawParams.showEmboss = !drawParams.showEmboss;
//    }
//    
//    invertCB.onchange = e =>{
//        drawParams.invertColors = !drawParams.invertColors;
//    }
//    
    playButton.onclick = e =>{
        console.log('audioCtx.state before = $(audio.audioCtx.state)');
        
        audio.loadSoundFile(trackSelect.value);
        
        if (audio.audioCtx.state == "suspended"){
            audio.audioCtx.resume();
        }

        console.log('audioCtx.state after = $(audio.audioCtx.state)');

        if(e.target.dataset.playing == "no")
            {
                audio.playCurrentSound();
                e.target.dataset.playing = "yes";
            }else{
                audio.pauseCurrentSound();
                e.target.dataset.playing = "no";
            }
    }

    //C- hookup volume slider and label
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel  = document.querySelector("#volumeLabel");
    
    //on input event
    volumeSlider.oninput = e =>{
        //set gain
        audio.setVolume(e.target.value);

        //update label
        volumeLabel.innerHTML = Math.round((e.target.value/2*100));
    }
	
    volumeSlider.dispatchEvent(new Event("input"));
    
    //C- hookup pan slider and label
    let panSlider = document.querySelector("#panSlider");
    let panLabel  = document.querySelector("#panLabel");
    
    //on input event
    panSlider.oninput = e =>{
        //set pan
        audio.setPan(e.target.value);

        //update label
        panLabel.innerHTML = Math.round((e.target.value/2*100));
    }
	
    panSlider.dispatchEvent(new Event("input"));
    
    //C- hookup color slider and label
    let colorSlider = document.querySelector("#color-slider");
    let colorLabel  = document.querySelector("#color-label");
    
    //on input event
    colorSlider.oninput = e =>{
        canvas.setColorScalar(e.target.value);

        //update label
        colorLabel.innerHTML = Math.round((e.target.value/2*100));
    }
	
    colorSlider.dispatchEvent(new Event("input"));
    
    //.onchange events for select
    trackSelect.onchange = e =>{
        audio.loadSoundFile(e.target.value);
        if(playButton.dataset.playing == "yes")
            {
                playButton.dispatchEvent(new MouseEvent("click"));
            }
    };
    
    var currTimeEl = document.querySelector("#current-time");
    var durationEl = document.querySelector("#duration");

    

} // end setupUI



export {init};