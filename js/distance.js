'use strict';

$('#step1').hide();
$('#step2').hide();
$('#step3').hide();

var height;
var angle1;
var angle2;
var finalResult;
var output = document.querySelector('.output');
var errorElement = document.querySelector('#errorMsg');
var video = document.querySelector('video');
var aim = document.querySelector('#aim');
var constraints = window.constraints = {
  audio: false,
  video: true
};

if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
  console.log("enumerateDevices() not supported.");
  return;
}

/*navigator.mediaDevices.enumerateDevices()
  .then(devices => {
    var videoDevices = [0,0];
    var videoDeviceIndex = 0;
    devices.forEach(function(device) {
      console.log(device.kind + ": " + device.label +
        " id = " + device.deviceId);
      if (device.kind == "videoinput") {  
        videoDevices[videoDeviceIndex++] =  device.deviceId;    
      }
    });


    var constraints =  window.constraints = {
      audio: false,
      video: true,
      width: { min: 1024, ideal: 1280, max: 1920 },
      height: { min: 776, ideal: 720, max: 1080 },
      deviceId: { exact: videoDevices[1]  } 
    };
  return navigator.mediaDevices.getUserMedia({ video: constraints });

})
    .catch(function(err) {
      console.log(err.name + ": " + error.message);
    });*/

function handleSuccess(stream) {
  var videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log('Using video device: ' + videoTracks[1].label);
  stream.oninactive = function() {
    console.log('Stream inactive');
  };
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    errorMsg('The resolution ' + constraints.video.width.exact + 'x' +
        constraints.video.width.exact + ' px is not supported by your device.');
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg('getUserMedia error: ' + error.name, error);
}

function errorMsg(msg, error) {
  errorElement.innerHTML += '<p>' + msg + '</p>';
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);

function handleOrientation(event) {
  var x = event.beta;  // In degree in the range [-180,180]

  output.val("angle: " + x + "\n");

  // Because we don't want to have the device upside down
  // We constrain the x value to the range [-90,90]
  if (x >  90) { x =  90};
  if (x < -90) { x = -90};

  // To make computation easier we shift the range of 
  // x and y to [0,180]
  x += 90;
    
    if (x == 90) {
        window.navigator.vibrate(200);
        video.css({"border-color": "#24af1a", 
             "border-width":"8px", 
             "border-style":"solid"});
        console.log("Yes");
    } else {
        video.css({"border":"0"});
    }

}

window.addEventListener('deviceorientation', handleOrientation);

$('#step0btn').click(function() {
    var heightFeet = $('#feet').val();
    var heightInches = $('#inches').val();
    height = (heightFeet*12)+(heightInches*1);
    console.log(heightFeet);
    console.log(heightInches);
    $('#step0').fadeToggle();
    $('#step1').fadeToggle();
    console.log(height);
});

$('#step1btn').click(function() {
    angle1 = $('#output1').val();
    $('#step1').fadeToggle();
    $('#step2').fadeToggle();
    console.log(angle1);
});

$('#step2btn').click(function() {
    angle2 = $('#output2').val();
    $('#step2').fadeToggle();
    $('#step3').fadeToggle();
    //angle2 = 10;
    finalResult = Math.abs(height/(Math.tan(angle2)));
    var finalInches = (finalResult%12);
    var finalFeet = (finalResult-finalInches)/12;
    finalInches = finalInches.toFixed(2);
    $('#result').val("You are: " + finalFeet + "feet " + finalInches + "from the stage");
    console.log(angle2);
    console.log(finalResult);
    console.log(finalFeet);
    console.log(finalInches);
});

$('#step3btn').click(function() {
    $('#step3').fadeToggle();
    $('#step0').fadeToggle();
});

