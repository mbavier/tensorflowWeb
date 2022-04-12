import * as THREE from 'three';

const scene = new THREE.Scene();


let originNoseX = 0;
let originNoseY = 0;
let noseX = 0;
let noseY = 0;

let originLeftHandX = 0;
let originLeftHandY = 0;

let leftHandX = 0;
let rightHandX = 0;
let leftHandY = 0;
let rightHandY = 0;
console.log(noseX);
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.6, 1200);
camera.position.z += 3;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor("#03051a");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

// const headGeo = new THREE.BoxGeometry(.25, .5, .5);
const leftMaterial = new THREE.MeshBasicMaterial({color: 0xff00000});
// const leftFace = new THREE.Mesh(headGeo, leftMaterial);
// leftFace.position.x -= .125;
// scene.add(leftFace);

const rightMaterial = new THREE.MeshBasicMaterial({color: 0x00000ff});
// const rightFace = new THREE.Mesh(headGeo, rightMaterial);
// rightFace.position.x += .125;
// scene.add(rightFace);


const handGeo = new THREE.SphereGeometry(.25, 32, 16);

const leftHand = new THREE.Mesh(handGeo, leftMaterial);
const rightHand = new THREE.Mesh(handGeo, rightMaterial);
scene.add(leftHand);
scene.add(rightHand);

const rendering = function() {
    requestAnimationFrame(rendering);
    // leftFace.position.x = ((noseX - 370)/640)* 5 + .125;
    // rightFace.position.x = ((noseX - 370)/640)* 5 - .125;
    // leftFace.position.y = ((noseY - 290)/480) * 5;
    // rightFace.position.y = ((noseY - 290)/480) * 5;

    leftHand.position.x = ((leftHandX - 370)/-640) * 5;
    leftHand.position.y = ((leftHandY - 290)/-480) * 5;
    rightHand.position.x = ((rightHandX - 370)/-640) * 5;
    rightHand.position.y = ((rightHandY - 290)/-480) * 5;

    console.log(leftHandX)
    renderer.render(scene, camera);
}

rendering();

const constraints = {
    video: true
};

const videoElement = document.getElementById('videoInput');

navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
    videoElement.srcObject = stream;
    videoElement.play();
});

videoElement.addEventListener('loadeddata', function() {
    loadAndPredict();
 });
 

    async function loadAndPredict() {
      const net = await bodyPix.load(/** optional arguments, see below **/);

      /**
       * One of (see documentation below):
       *   - net.segmentPerson
       *   - net.segmentPersonParts
       *   - net.segmentMultiPerson
       *   - net.segmentMultiPersonParts
       * See documentation below for details on each method.
       */ 
      const segmentation = await net.segmentPersonParts(videoElement);
      //console.log(segmentation);
      if (segmentation.allPoses.length > 0) {
        if (segmentation.allPoses[0].keypoints[0].score > 0.5) {
            noseX = segmentation.allPoses[0].keypoints[0].position.x;
            noseY = segmentation.allPoses[0].keypoints[0].position.y;
        }
        if (segmentation.allPoses[0].keypoints[9].score > 0.8) {
            leftHandX = segmentation.allPoses[0].keypoints[9].position.x;
            leftHandY = segmentation.allPoses[0].keypoints[9].position.y;
        }
        if (segmentation.allPoses[0].keypoints[10].score > 0.8) {
            rightHandX = segmentation.allPoses[0].keypoints[10].position.x;
            rightHandY = segmentation.allPoses[0].keypoints[10].position.y;
        }
        console.log(segmentation);
      }
    loadAndPredict();
    }
    
