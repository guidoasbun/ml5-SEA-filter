let video;
let latestPrediction = null;
let modelIsLoading = true;
let peachImage,
  appleImage,
  bananasImage,
  mangoImage,
  orangeImage,
  pearImage,
  pear2Image,
  pinapleImage,
  plumImage,
  pomegranateImage,
  strawberryImage,
  watermelonImage;
let fruits = [];
let handTap = false;
let currentImageNumber = 0;

const FOREHEAD_POINT = 151;
const LEFT_FOREHEAD = 104;
const RIGHT_FOREHEAD = 333;
const LEFT_EYE = 247;
const RIGHT_EYE = 444;
const MOUTH = 48;

//p5 function
function preload() {
  peachImage = loadImage("/assets/images/peach.png");
  appleImage = loadImage("/assets/images/apple.png");
  bananasImage = loadImage("/assets/images/bananas.png");
  mangoImage = loadImage("/assets/images/mango.png");
  orangeImage = loadImage("/assets/images/orange.png");
  pearImage = loadImage("/assets/images/pear.png");
  pear2Image = loadImage("/assets/images/pear2.png");
  pinapleImage = loadImage("/assets/images/pinaple.png");
  plumImage = loadImage("/assets/images/plum.png");
  pomegranateImage = loadImage("/assets/images/pomegranate.png");
  strawberryImage = loadImage("/assets/images/strawberry.png");
  watermelonImage = loadImage("/assets/images/watermelon.png");
  fruits = [
    peachImage,
    appleImage,
    bananasImage,
    mangoImage,
    orangeImage,
    pearImage,
    pear2Image,
    pinapleImage,
    plumImage,
    pomegranateImage,
    strawberryImage,
    watermelonImage,
  ];
}

//p5 function
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  //ml5 function
  let facemesh = ml5.facemesh(video, () => {
    console.log("Model is ready!");
    modelIsLoading = false;
  });

  //ml5 function
  facemesh.on("predict", (results) => {
    //results is an array, we care about the first object only, results = 0
    console.log(results[0]);
    latestPrediction = results[0];
  });

  video.hide();
}

//p5 function
function draw() {
  //if (modelIsLoading)
  // show loading screen

  let currentImage = fruits[currentImageNumber];

  //Draw webcam video
  imageMode(CORNER);
  image(video, 0, 0, width, height);

  if (latestPrediction == null) {
    currentImageNumber++;
    if (currentImageNumber === fruits.length - 1) {
      currentImageNumber = 0;
    }
    return; //Don't draw anything else
  }

  //get forehead lodcation
  let foreheadLoaction = latestPrediction.scaledMesh[FOREHEAD_POINT];
  //   console.log(foreheadLoaction);

  let leftForeheadLocation = latestPrediction.scaledMesh[LEFT_FOREHEAD];
  let rightForeheadLocation = latestPrediction.scaledMesh[RIGHT_FOREHEAD];
  let leftEyeLocation = latestPrediction.scaledMesh[LEFT_EYE];
  let rightEyeLocation = latestPrediction.scaledMesh[RIGHT_EYE];
  let mouthLocation = latestPrediction.scaledMesh[MOUTH];

  let foreheadWidth = dist(
    leftForeheadLocation[0],
    leftForeheadLocation[1],
    rightForeheadLocation[0],
    rightForeheadLocation[1]
  );

  // console.log(foreheadWidth);

  let imageWidth = foreheadWidth * 3.5;

  // imageWidth
  // imageImage.width
  // imageImage.height

  let imageHeight = (currentImage.height / currentImage.width) * imageWidth;

  imageMode(CENTER);
  image(
    currentImage,
    foreheadLoaction[0],
    foreheadLoaction[1] - imageHeight / 10,
    imageWidth,
    imageHeight
  );

  
  //-----------------Drawings of eyes and mouth----------------
  // imageMode(CORNER);
  // ellipse(leftEyeLocation[0], leftEyeLocation[1], 20, 15);
  // ellipse(rightEyeLocation[0], rightEyeLocation[1], 20, 15);
  // ellipse(mouthLocation[0], mouthLocation[1], 20, 15);
  // 0 is the x cordinate, y is the y cordinate
}


function createEyeholeMask() {
  let eyeholeMask = createGraphics(width, height); // draw into a "graphics" object instead of the canvas directly
  eyeholeMask.background("rgba(255,255,255,0)"); // transparent background (zero alpha)
  eyeholeMask.noStroke();

  // get the eyehole points from the facemesh
  let rightEyeUpper = latestPrediction.annotations.rightEyeUpper1;
  let rightEyeLower = [
    ...latestPrediction.annotations.rightEyeLower1,
  ].reverse(); /* note that we have to reverse one of the arrays so that the shape draws properly */

  // draw the actual shape
  eyeholeMask.beginShape();
  // draw from left to right along the top of the eye
  rightEyeUpper.forEach((point) => {
    eyeholeMask.curveVertex(point[0 /* x */], point[1 /* y */]); // using curveVertex for smooth lines
  });
  // draw back from right to left along the bottom of the eye
  rightEyeLower.forEach((point) => {
    eyeholeMask.curveVertex(point[0 /* x */], point[1 /* y */]);
  });
  eyeholeMask.endShape(CLOSE); // CLOSE makes sure we join back to the beginning

  return eyeholeMask;
}