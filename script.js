/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

/********************************************************************
 * Demo created by Jason Mayes 2020.
 *
 * Got questions? Reach out to me on social:
 * Twitter: @jason_mayes
 * LinkedIn: https://www.linkedin.com/in/creativetech
 ********************************************************************/

const video = document.getElementById('webcam');
const liveView = document.getElementById('liveView');
const demosSection = document.getElementById('demos');

var modelHasLoaded = false;
var model = undefined;

// Before we can use COCO-SSD class we must wait for it to finish
// loading. Machine Learning models can be large and take a moment to
// get everything needed to run.
cocoSsd.load().then(function (loadedModel) {
    model = loadedModel;
    modelHasLoaded = true;
    // Show demo section now model is ready to use.
    //demosSection.classList.remove('invisible');
    var x = document.getElementById("gif");
    x.style.display = "none";

});


/********************************************************************
 // Demo 1: Grab a bunch of images from the page and classify them
 // upon click.
 ********************************************************************/

// In this demo, we have put all our clickable images in divs with the
// CSS class 'classifyOnClick'. Lets get all the elements that have
// this class.
const imageContainers = document.getElementsByClassName('classifyOnClick');

// Now let's go through all of these and add a click event listener.
for (let i = 0; i < imageContainers.length; i++) {
    // Add event listener to the child element whichis the img element.
    imageContainers[i].children[0].addEventListener('click', handleClick);
}

// When an image is clicked, let's classify it and display results!
function handleClick(event) {
    if (!modelHasLoaded) {
        return;
    }

    // We can call model.classify as many times as we like with
    // different image data each time. This returns a promise
    // which we wait to complete and then call a function to
    // print out the results of the prediction.
    model.detect(event.target).then(function (predictions) {
        // Lets write the predictions to a new paragraph element and
        // add it to the DOM.
        for (let n = 0; n < predictions.length; n++) {
            const p = document.createElement('p');
            p.innerText = predictions[n].class  + ' - with '
                + Math.round(parseFloat(predictions[n].score) * 100)
                + '% confidence.';
            p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
                + (predictions[n].bbox[1] - 10) + 'px; width: '
                + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

            const highlighter = document.createElement('div');
            highlighter.setAttribute('class', 'highlighter');
            highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
                + predictions[n].bbox[1] + 'px; width: '
                + predictions[n].bbox[2] + 'px; height: '
                + predictions[n].bbox[3] + 'px;';

            event.target.parentNode.appendChild(highlighter);
            event.target.parentNode.appendChild(p);
        }
    });
}



/********************************************************************
 // Demo 2: Continuously grab image from webcam stream and classify it.
 // Note: You must access the demo on https for this to work:
 // https://codepen.io/jasonmayes/pen/qBEJxgg
 ********************************************************************/

// Check if webcam access is supported.
function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
        navigator.mediaDevices.getUserMedia);
}

var children = [];

function predictWebcam() {
    // Now let's start classifying the stream.
    model.detect(video).then(function (predictions) {
        // Remove any highlighting we did previous frame.
        for (let i = 0; i < children.length; i++) {
            liveView.removeChild(children[i]);
        }
        children.splice(0);

        // Now lets loop through predictions and draw them to the live view if
        // they have a high confidence score.
        for (let n = 0; n < predictions.length; n++) {
            // If we are over 66% sure we are sure we classified it right, draw it!
            if (predictions[n].score > 0.66) {
                if(predictions[n].class=='person'){
                 //   jQuery.support.cors = true;

                    // $.ajax({url:"/tf/main.php",
                    //     success:function(result){
                    //     alert(result);
                    //     }})

                  //  window.open('https://maker.ifttt.com/trigger/mask_detected/with/key/b2AiYiZeiIrrzjeP2IHw1_','_alex');
                    $.ajax({
                        url: 'https://maker.ifttt.com/trigger/mask_detected/with/key/b2AiYiZeiIrrzjeP2IHw1_',
                        dataType: 'jsonp',
                        success: function(rs){
                          alert(rs)
                        }
                    });

                 // let url="https://maker.ifttt.com/trigger/ifttt_trigger/with/key/cxaeSyLK8I6melODOFBO3f";
                 //    httpPost(
                 //        url,
                 //        result => {
                 //            console.log("OK: " + result);
                 //        },
                 //        error => {
                 //            console.log("ERROR: " + error);
                 //        }
                 //    );

                    // $.ajax({
                    //     url: "https://maker.ifttt.com/trigger/ifttt_trigger/with/key/cxaeSyLK8I6melODOFBO3f",
                    //     type: "POST",
                    //     data: {"value1":"HELLO"},
                    //     complete: function(result){alert("Success")}
                    // });
                }
                const p = document.createElement('p');
                p.innerText = predictions[n].class  + ' - with '
                    + Math.round(parseFloat(predictions[n].score) * 100)
                    + '% confidence.';
                p.style = 'margin-left: ' + predictions[n].bbox[0] + 'px; margin-top: '
                    + (predictions[n].bbox[1] - 10) + 'px; width: '
                    + (predictions[n].bbox[2] - 10) + 'px; top: 0; left: 0;';

                const highlighter = document.createElement('div');
                highlighter.setAttribute('class', 'highlighter');
                highlighter.style = 'left: ' + predictions[n].bbox[0] + 'px; top: '
                    + predictions[n].bbox[1] + 'px; width: '
                    + predictions[n].bbox[2] + 'px; height: '
                    + predictions[n].bbox[3] + 'px;';

                liveView.appendChild(highlighter);
                liveView.appendChild(p);
                children.push(highlighter);
                children.push(p);
            }
        }

        // Call this function again to keep predicting when the browser is ready.
        window.requestAnimationFrame(predictWebcam);
    });
}


// Enable the live webcam view and start classification.
function enableCam(event) {
    if (!modelHasLoaded) {
        return;
    }

    // Hide the button.
    event.target.classList.add('removed');

    // getUsermedia parameters.
    const constraints = {
        video: true
    };

    // Activate the webcam stream.
    navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
        video.srcObject = stream;
        video.addEventListener('loadeddata', predictWebcam);
    });
}


// If webcam supported, add event listener to button for when user
// wants to activate it.
if (hasGetUserMedia()) {
    const enableWebcamButton = document.getElementById('webcamButton');
    enableWebcamButton.addEventListener('click', enableCam);
} else {
    console.warn('getUserMedia() is not supported by your browser');
}