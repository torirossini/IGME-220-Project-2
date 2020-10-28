/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx,canvasWidth,canvasHeight,gradient,analyserNode,audioData;


function setupCanvas(canvasElement,analyserNodeRef){
	// create drawing context
	ctx = canvasElement.getContext("2d");
	canvasWidth = canvasElement.width;
	canvasHeight = canvasElement.height;

	// keep a reference to the analyser node
	analyserNode = analyserNodeRef;
	// this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize/2);
	
}

function draw(params={}){
  // 1 - populate the audioData array with the frequency data from the analyserNode
	// notice these arrays are passed "by reference" 
	analyserNode.getByteFrequencyData(audioData);
	// OR
	//analyserNode.getByteTimeDomainData(audioData); // waveform data
	
	// 2 - draw background
	ctx.save();
    ctx.fillStyle = "#0A0908";
    ctx.globalAlpha = .1;
    ctx.fillRect(0,0,canvasWidth,canvasHeight);
    ctx.restore();
		
	// 3 - draw gradient
    
    if(params.showGradient){
        ctx.save();
        // create a gradient that runs top to bottom
        gradient = utils.getLinearGradient(ctx,0,0,0,canvasHeight,[{percent:0,color:'rgb(' + audioData[0] + ', ' + audioData[10] + ', ' + audioData[20] + ')'},{percent:.750,color:'rgb(' + audioData[20] + ', ' + audioData[30] + ', ' + audioData[40] + ')'},{percent:1,color:'rgb(' + audioData[50] + ', ' + audioData[60] + ', ' + audioData[70] + ')'}]);
        ctx.fillStyle = gradient; 
        ctx.globalAlpha = .3;
        ctx.fillRect(0,0,canvasWidth,canvasHeight);
        ctx.restore();
    }
	
	// 4 - draw bars
    if(params.showBars){
        let dataWeCareAbout = audioData.length/3;
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (dataWeCareAbout * barSpacing) - margin *2;
        let barWidth = screenWidthForBars / dataWeCareAbout;
        let barHeight = 200;
        let topSpacing = 10;
        
        ctx.save();
        

        for(let i = 0; i < dataWeCareAbout; i++)
            {
                
                let color = 'rgb(' + 
                audioData[0] + ', ' + 
                audioData[10] * i/2 + ', ' + 
                audioData[20] * i/4 + ')'
                ctx.fillStyle = color;
                ctx.strokeStyle = color;
                
                ctx.fillRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
                ctx.strokeRect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
            }
        ctx.restore();
    }
	
	// 5 - draw circles
    
    if(params.showCircles)
        {

            
            let maxRadius = canvasHeight/2;
            ctx.save();
            
            ctx.strokeStyle = "white";
            ctx.lineWidth = 3;
            
            ctx.globalAlpha = .5;
            //console.log(audioData[30]);
            
            ctx.beginPath();
            ctx.moveTo(0, canvasHeight/2);
            ctx.bezierCurveTo(canvasHeight/2 +  audioData[0],
                              canvasHeight/2 +  audioData[0] * 2, 
                              canvasHeight/2 +  audioData[30], 
                              canvasHeight/2 -  audioData[10] * 2, 
                              canvasWidth, 
                              canvasHeight/2);
            ctx.stroke(); 
            
            
            ctx.beginPath();
            ctx.moveTo(0, canvasHeight/2);
            ctx.bezierCurveTo(canvasHeight/2 -  audioData[0],
                              canvasHeight/2 -  audioData[0] * 2, 
                              canvasHeight/2 -  audioData[30], 
                              canvasHeight/2 +  audioData[10] * 2, 
                              canvasWidth, 
                              canvasHeight/2);
            ctx.stroke(); 
            
            ctx.beginPath();
            ctx.moveTo(0, canvasHeight/3);
            ctx.bezierCurveTo(canvasHeight/3 +  audioData[0],
                              canvasHeight/3 +  audioData[0] * 2, 
                              canvasHeight/3 +  audioData[30], 
                              canvasHeight/3 -  audioData[10] * 2, 
                              canvasWidth, 
                              canvasHeight/3);
            ctx.stroke(); 
            
            
            ctx.beginPath();
            ctx.moveTo(0, canvasHeight/3);
            ctx.bezierCurveTo(canvasHeight/3 -  audioData[0],
                              canvasHeight/3 -  audioData[0] * 2, 
                              canvasHeight/3 -  audioData[30], 
                              canvasHeight/3 +  audioData[10] * 2, 
                              canvasWidth, 
                              canvasHeight/3);
            ctx.stroke(); 
            
            ctx.beginPath();
            ctx.moveTo(0, canvasHeight/3*2);
            ctx.bezierCurveTo(canvasHeight/3*2 +  audioData[0],
                              canvasHeight/3*2 +  audioData[0] * 2, 
                              canvasHeight/3*2 +  audioData[30], 
                              canvasHeight/3*2 -  audioData[10] * 2, 
                              canvasWidth, 
                              canvasHeight/3*2);
            ctx.stroke(); 
            
            
            ctx.beginPath();
            ctx.moveTo(0, canvasHeight/3*2);
            ctx.bezierCurveTo(canvasHeight/3*2 -  audioData[0],
                              canvasHeight/3*2 -  audioData[0] * 2, 
                              canvasHeight/3*2 -  audioData[30], 
                              canvasHeight/3*2 +  audioData[10] * 2, 
                              canvasWidth, 
                              canvasHeight/3*2);
            ctx.stroke(); 
//            for(let i = 0; i<audioData.length; i++)
//                {
//                    let percent = audioData[i]/255;
//                    
//                    let circleRadius = percent * maxRadius;
//                    ctx.beginPath();
//                    ctx.fillStyle = utils.makeColor(255,111,111,.34-percent/3.0);
//                    ctx.arc(canvasWidth/2, canvasHeight/2, circleRadius, 0, 2*Math.PI, false);
//                    ctx.fill();
//                    ctx.closePath();
//                    
//                }
            ctx.restore();
        }
    
    // 6 - bitmap manipulation
	// TODO: right now. we are looping though every pixel of the canvas (320,000 of them!), 
	// regardless of whether or not we are applying a pixel effect
	// At some point, refactor this code so that we are looping though the image data only if
	// it is necessary

	// A) grab all of the pixels on the canvas and put them in the `data` array
	// `imageData.data` is a `Uint8ClampedArray()` typed array that has 1.28 million elements!
	// the variable `data` below is a reference to that array
    
    let imageData = ctx.getImageData(0,0,canvasWidth,canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;
    
	// B) Iterate through each pixel, stepping 4 elements at a time (which is the RGBA for 1 pixel)
    for(let i = 0; i<length; i+=4)
        {
		   // C) randomly change every 20th pixel to red
           if (params.currentFilter == "grayscale")
               {
                // data[i] is the red channel
                // data[i+1] is the green channel
                // data[i+2] is the blue channel
                // data[i+3] is the alpha channel
                    var r = data[i];
                    var g = data[i+1];
                    var b = data[i+2];
                    // CIE luminance for the RGB
                    // The human eye is bad at seeing red and blue, so we de-emphasize them.
                    var v = 0.2126*r + 0.7152*g + 0.0722*b;
                    data[i] = data[i+1] = data[i+2] = v
                   
            } // end if
            
//            if(params.invertColors)
//            {
//                let red = data[i],green = data[i+1], blue = data[i+2];
//                data[i] = 255-red;
//                data[i+1] = 255-green;
//                data[i+2] = 255-blue;
//            }
	} // end for
//    
//    if(params.showEmboss)
//    {
//        for(let i = 0; i< length; i++)
//            {
//                if(i%4 == 3) continue;
//                data[i] = 127 + 2*data[i] - data[i+4] -data[i+width*4];
//            }
//    }
    

	// D) copy image data back to canvas
    ctx.putImageData(imageData,0,0);
    

		
}

export {setupCanvas,draw};