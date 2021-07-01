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
  watermelonImage,
  fruitBasket;
let fruits = [];
let handTap = false;
let currentImageNumber = 0;
let seeMe = true;

const FOREHEAD_POINT = 151;
const LEFT_FOREHEAD = 104;
const RIGHT_FOREHEAD = 333;

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
  fruitBasket = loadImage("/assets/images/fruitBasket.png");
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
    latestPrediction = results[0];
  });

  video.hide();
}

//p5 function
function draw() {
  // show loading screen
  if (modelIsLoading) {
    image(fruitBasket, 0, 0, width, height);
  }

  let currentImage = fruits[currentImageNumber];

  //Draw webcam video
  imageMode(CORNER);
  image(video, 0, 0, width, height);

  if (latestPrediction == null) {
    //Cycle through the fruits
    if (seeMe) {
      currentImageNumber++;
      seeMe = false;
      if (currentImageNumber === fruits.length) {
        currentImageNumber = 0;
      }
    }
    return; //Don't draw anything else
  }

  //get forehead lodcation
  let foreheadLoaction = latestPrediction.scaledMesh[FOREHEAD_POINT];
  let leftForeheadLocation = latestPrediction.scaledMesh[LEFT_FOREHEAD];
  let rightForeheadLocation = latestPrediction.scaledMesh[RIGHT_FOREHEAD];

  let foreheadWidth = getWidth(leftForeheadLocation, rightForeheadLocation);
  let imageWidth = foreheadWidth * 4;
  let imageHeight = (currentImage.height / currentImage.width) * imageWidth;

  //Draws the current image
  imageMode(CENTER);
  image(
    currentImage,
    foreheadLoaction[0],
    foreheadLoaction[1] - imageHeight / 20,
    imageWidth,
    imageHeight
  );

  //Sets up the mask for the holes in eyes and mouth
  imageMode(CORNER);

  const rightEyeLocation = [
    latestPrediction.annotations.rightEyeUpper1,
    latestPrediction.annotations.rightEyeLower1,
  ];
  const leftEyeLocation = [
    latestPrediction.annotations.leftEyeUpper1,
    latestPrediction.annotations.leftEyeLower1,
  ];
  const mouthLocation = [
    latestPrediction.annotations.lipsUpperOuter,
    latestPrediction.annotations.lipsLowerOuter,
  ];

  let rightEyeHoleMask = createHoleMask(rightEyeLocation[0], rightEyeLocation[1]);
  let leftEyeHoleMask = createHoleMask(leftEyeLocation[0], leftEyeLocation[1]);
  let mouthHoleMask = createHoleMask(mouthLocation[0], mouthLocation[1]);

  let webcamCopy = video.get(); // get a new copy of the webcam image
  let webcamCopy2 = video.get();
  let webcamCopy3 = video.get();
  webcamCopy.mask(leftEyeHoleMask); // apply the eyehole mask
  webcamCopy2.mask(rightEyeHoleMask);
  webcamCopy3.mask(mouthHoleMask);

  //Draws the holes for the eyes and mouts
  image(webcamCopy, 0, 0, width, height);
  image(webcamCopy2, 0, 0, width, height);
  image(webcamCopy3, 0, 0, width, height);
}

function getWidth(leftLocation, rightLocation) {
  let width = dist(
    leftLocation[0],
    leftLocation[1],
    rightLocation[0],
    rightLocation[1]
  );
  return width;
}

function createHoleMask(upper, lower) {
  //Sets the seeMe variabel back to true because latestPrediction in no longer null
  seeMe = true;

  let maskHole = createGraphics(width, height);
  maskHole.background("rgba(255,255,255,0)");
  maskHole.noStroke();

  let mUpper = upper;
  let mLower = [...lower].reverse();

  maskHole.beginShape();
  mUpper.forEach((point) => {
    maskHole.curveVertex(point[0], point[1]);
  });
  mLower.forEach((point) => {
    maskHole.curveVertex(point[0], point[1]);
  });
  maskHole.endShape(CLOSE);
  return maskHole;
}
