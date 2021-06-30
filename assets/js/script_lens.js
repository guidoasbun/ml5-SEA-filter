let video;
let latestPrediction = null;
let modelIsLoading = true;
let peachImage;

const FOREHEAD_POINT = 151;
const LEFT_FOREHEAD = 104;
const RIGHT_FOREHEAD = 333;
const LEFT_EYE = 247;
const RIGHT_EYE = 444;
const MOUTH = 48;

//p5 function
function preload() {
  peachImage = loadImage("/assets/images/peach.png");
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
    //results is an array
    //we care about the first object only
    //results = 0
    // console.log(results[0]);
    latestPrediction = results[0];
  });

  video.hide();
}

//p5 function
function draw() {
  //if (modelIsLoading)
  // show loading screen

  //Draw webcam video
  imageMode(CORNER);
  image(video, 0, 0, width, height);

  if (latestPrediction == null) return; //Don't draw anything else

  //get forehead lodcation
  let foreheadLoaction = latestPrediction.scaledMesh[FOREHEAD_POINT];
  //   console.log(foreheadLoaction);

  let leftForeheadLocation = latestPrediction.scaledMesh[LEFT_FOREHEAD];
  let rightForeheadLocation = latestPrediction.scaledMesh[RIGHT_FOREHEAD];
  let leftEyeLocation = latestPrediction.scaledMesh[LEFT_EYE];
  let rightEyeLocation = latestPrediction.scaledMesh[RIGHT_EYE];
  let mouthLocation = latestPrediction.scaledMesh[MOUTH];
  //   leftForeheadLocation[0],
  //   leftForeheadLocation[1],
  //   rightForeheadLocation[0],
  //   rightForeheadLocation[1]
  // );

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

  let imageHeight = (peachImage.height / peachImage.width) * imageWidth;

  imageMode(CENTER);
  image(
    peachImage,
    foreheadLoaction[0],
    foreheadLoaction[1] - imageHeight / 10,
    imageWidth,
    imageHeight
  );
  imageMode(CORNER);
  ellipse(leftEyeLocation[0], leftEyeLocation[1], 20, 15);
  ellipse(rightEyeLocation[0], rightEyeLocation[1], 20, 15);
  ellipse(mouthLocation[0], mouthLocation[1], 20, 15);
  // 0 is the x cordinate, y is the y cordinate
}
