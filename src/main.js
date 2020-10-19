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
    showNoise:false,
    showEmboss:false,
    invertColors:false
};

// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
	//sound1  :  "media/New Adventure Theme.mp3",
    /*K_Q*/ 81 :  "media/notes/a-3.mp3",
    /*K_W*/ 87 :  "media/notes/a-4.mp3",
    /*K_E*/ 69 :  "media/notes/a-5.mp3",
    /*K_R*/ 82 :  "media/notes/a3.mp3",
    /*K_T*/ 84 :  "media/notes/a4.mp3",
    /*K_Y*/ 89 :  "media/notes/a5.mp3",
    /*K_U*/ 85 :  "media/notes/b3.mp3",
    /*K_I*/ 73 :  "media/notes/b4.mp3",
    /*K_O*/ 79 :  "media/notes/b5.mp3",
    /*K_P*/ 80 :  "media/notes/b5.mp3",
    
    /*K_A*/ 65 :  "media/notes/c-3.mp3",
    /*K_S*/ 83 :  "media/notes/c-4.mp3",
    /*K_D*/ 68 :  "media/notes/c-5.mp3",
    /*K_F*/ 70 :  "media/notes/c3.mp3",
    /*K_G*/ 71 :  "media/notes/c4.mp3",
    /*K_H*/ 72 :  "media/notes/c5.mp3",
    /*K_J*/ 74 :  "media/notes/c6.mp3",
    /*K_K*/ 75 :  "media/notes/d-3.mp3",
    /*K_L*/ 76 :  "media/notes/d-4.mp3",
    
    /*K_Z*/ 90 :  "media/notes/d-5.mp3",
    /*K_X*/ 88 :  "media/notes/d3.mp3",
    /*K_C*/ 67 :  "media/notes/d4.mp3",
    /*K_V*/ 86 :  "media/notes/d5.mp3",
    /*K_B*/ 66 :  "media/notes/e3.mp3",
    /*K_N*/ 78 :  "media/notes/e4.mp3",
    /*K_M*/ 77 :  "media/notes/e5.mp3",

});

//Pulled base keyboard input from here: https://www.dummies.com/web-design-development/javascript/how-to-read-the-keyboard-on-javascripts-canvas-for-html5-and-css3-programming

var output;
var currentKey;

 function updateKeys(e){
    //set current key
    currentKey = e.keyCode;
    output.innerHTML = "current key: " + currentKey;     playNote(e);
 }

function playNote(e){
     console.log('audioCtx.state before = $(audio.audioCtx.state)');

    if (audio.audioCtx.state == "suspended"){
        audio.audioCtx.resume();
    }
    
    audio.loadSoundFile(DEFAULTS[currentKey]);
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
    
    audio.setupWebaudio(DEFAULTS[81]);
	let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
	setupUI(canvasElement);
    canvas.setupCanvas(canvasElement,audio.analyserNode);   loop();
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
    // A - hookup fullscreen button
//    const fsButton = document.querySelector("#fsButton");
//
//    // add .onclick event to button
//    fsButton.onclick = e => {
//        console.log("init called");
//        utils.goFullscreen(canvasElement);
//    };
//    
//    const gradientCB = document.querySelector("#gradientCB");
//    const barsCB = document.querySelector("#barsCB");
//    const circlesCB = document.querySelector("#circlesCB");
//    const noiseCB = document.querySelector("#noiseCB");
//    const embossCB = document.querySelector("#embossCB");
//    const invertCB = document.querySelector("#invertCB");
//    
//    gradientCB.onchange = e =>{
//        drawParams.showGradient = !drawParams.showGradient;
//    }
//    
//    barsCB.onchange = e =>{
//        drawParams.showBars = !drawParams.showBars;
//
//    }
//    
//    circlesCB.onchange = e =>{
//        drawParams.showCircles = !drawParams.showCircles;
//
//    }
//    
//    noiseCB.onchange = e =>{
//        drawParams.showNoise = !drawParams.showNoise;
//
//    }
//    
//    embossCB.onchange = e =>{
//        drawParams.showEmboss = !drawParams.showEmboss;
//    }
//    
//    invertCB.onchange = e =>{
//        drawParams.invertColors = !drawParams.invertColors;
//    }
//    
//    playButton.onclick = e =>{
//        console.log('audioCtx.state before = $(audio.audioCtx.state)');
//
//        if (audio.audioCtx.state == "suspended"){
//            audio.audioCtx.resume();
//        }
//
//        console.log('audioCtx.state after = $(audio.audioCtx.state)');
//
//        if(e.target.dataset.playing == "no")
//            {
//                audio.playCurrentSound();
//                e.target.dataset.playing = "yes";
//            }else{
//                audio.pauseCurrentSound();
//                e.target.dataset.playing = "no";
//            }
//    }
//
//    //C- hookup volume slider and label
//    let volumeSlider = document.querySelector("#volumeSlider");
//    let volumeLabel  = document.querySelector("#volumeLabel");
//    
//    //on input event
//    volumeSlider.oninput = e =>{
//        //set gain
//        audio.setVolume(e.target.value);
//
//        //update label
//        volumeLabel.innerHTML = Math.round((e.target.value/2*100));
//    }
//	
//    volumeSlider.dispatchEvent(new Event("input"));
//    
//    //D - track input
//    let trackSelect = document.querySelector("#trackSelect");
//    
//    //.onchange events for select
//    trackSelect.onchange = e =>{
//        audio.loadSoundFile(e.target.value);
//        if(playButton.dataset.playing == "yes")
//            {
//                playButton.dispatchEvent(new MouseEvent("click"));
//            }
//    };
    

} // end setupUI

export {init};