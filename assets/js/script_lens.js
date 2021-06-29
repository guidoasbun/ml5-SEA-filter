let video;
let latestPrediction = null;
let modelIsLoading = true;
let crownImage;

const FOREHEAD_POINT = 151;
const LEFT_FOREHEAD = 104;
const RIGHT_FOREHEAD = 333;

//p5 function
function preload() {
  crownImage = loadImage('assets/images/crown.png');
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
  image(video, 0, 0, width, height);

  if (latestPrediction == null) return; //Don't draw anything else

  //get forehead lodcation
  let foreheadLoaction = latestPrediction.scaledMesh[FOREHEAD_POINT];
  //   console.log(foreheadLoaction);

  image(
    crownImage,
    foreheadLoaction[0] - 50,
    foreheadLoaction[1] - 75,
    100,
    100
  );
  // 0 is the x cordinate, y is the y cordinate

  let leftForeheadLocation = latestPrediction.scaledMesh[LEFT_FOREHEAD];
  let rightForeheadLocation = latestPrediction.scaledMesh[RIGHT_FOREHEAD];

  line(
    leftForeheadLocation[0],
    leftForeheadLocation[1],
    rightForeheadLocation[0],
    rightForeheadLocation[1]
  );
}
