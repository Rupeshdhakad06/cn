var Peer = require('simple-peer')
var video = document.createElement('video')
document.body.appendChild(video)

var constraints = { audio: true, video: true };
navigator.mediaDevices.getUserMedia(constraints)
  .then(function (stream) {
    /* use the stream */
    gotMedia(stream);
  })
  .catch(function (err) {
    /* handle the error */
    console.log(err);
  });

  // var peers = [];

function handleSignaling(peer, signalingData) {
    // Implement signaling logic
}

function handlePeerConnection(peer) {
  peer.on('signal', data => {
      handleSignaling(peer, data);
  });

  peer.on('data', data => {
      console.log('Received data:', data.toString());
  });

  peer.on('stream', stream => {
      console.log('Received stream:', stream);
      var newVideo = document.createElement('video');
      newVideo.srcObject = stream;
      newVideo.autoplay = true;
      document.body.appendChild(newVideo);
  });
}



function gotMedia(stream) {
  var peer1 = new Peer(
    {
      initiator: location.hash === '#host',
      trickle: false,

      stream: stream
    })
  peer1.on('signal', data => {

    document.getElementById('yourId').value = JSON.stringify(data)
  })

  document.getElementById('connect').addEventListener('click', function () {
    var otherId = JSON.parse(document.getElementById('otherId').value)
    peer1.signal(otherId) 

    alert('connect: ' + otherId);
  })
  peer1.on('data', data => {

    document.getElementById('messages').textContent += data + '\n'
    console.log('got a message from peer1: ' + data)
  })

  peer1.on('stream', stream => {

    var video = document.querySelector('video')

    if ('srcObject' in video) {
      video.srcObject = stream
    } else {
      video.src = window.URL.createObjectURL(stream) // for older browsers
    }

    video.play()
  })

  document.getElementById('send').addEventListener('click', function () {
    var yourMessage = document.getElementById('yourMessage').value
    console.log("yourMessage JSON.stringify(data): " + JSON.stringify(yourMessage));
    peer1.send(yourMessage)
  })
}
