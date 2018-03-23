
var canvas = document.getElementById("voxelCanvas");
var ctx = canvas.getContext("2d");
var loadingIndicator = document.getElementById("loadingIndicator");
// var animationSpeed = document.getElementById("animationSpeed").value;
var animationButton = document.getElementById("animationButton");
var getDataButton = document.getElementById("getDataButton");
var layerControlBar = document.getElementById("layerControlBar");
var imageSensitivity = document.getElementById("imageSensitivity").value / 10;



canvas.setAttribute("width", 256);
canvas.setAttribute("height", 256);

var angle = "top";
var currentLayer = 293;
var rawData = [];

var currentSource = "fat.json";

var request = new XMLHttpRequest();

function getData() {
    loadingIndicator.innerHTML = "Loading...";

    request.open("GET", currentSource);
    request.send();
    request.onreadystatechange = function () {
        if (this.status === 404) {
            this.abort();
            alert('You must place "water.json" in the same folder as index.html');
            loadingIndicator.innerHTML = "Press button to load data";
        }
        else if (this.readyState == 4 && this.status !== 404) {
            rawData = JSON.parse(this.responseText);
            console.log(rawData);
            drawCanvas(rawData[currentLayer]);
            loadingIndicator.innerHTML = "DONE!";
            showLayerControls();
        }
    }
}

//Converts an integer to a hexcolor
function getHexColor(number) {
    return "#" + ((number) >>> 0).toString(16).slice(-6);
}

function drawCanvas(dataArray) {
    let imageSens = document.getElementById("imageSensitivity").value / 10;;
    for (let y = 0; y < dataArray.length; y++) {
        for (let x = 0; x < dataArray[y].length; x++) {

            //####################
            //  Color
            //####################
            // let intensity = Math.abs(dataArray[y][x]) * (255 * 255 * 255);
            // ctx.fillStyle = getHexColor(intensity);

            //####################
            //  Monochrome
            //####################
            if (dataArray[y][x] < imageSens) {
                ctx.fillStyle = "#000000";
            } else {
                let intensity = Math.floor(Math.abs(dataArray[y][x]) * 255);
                ctx.fillStyle = "rgb(" + intensity + "," + intensity + "," + intensity + ")";
            }
            ctx.fillRect(x, y, 1, 1);
        }
    }
}
function layerStep() {
    switch (angle) {
        case "top":
            nextLayer();
            break;
        case "front":
            nextLayerFront()
            break;
        case "side":
            nextLayerSide();
            break;
    }
}
function nextLayer() {
    if (currentLayer >= rawData.length - 1) {
        currentLayer = 0;
    } else {
        currentLayer++;
    }
    drawCanvas(rawData[currentLayer]);
    loadingIndicator.innerHTML = "Layer: " + currentLayer;
}

function nextLayerFront() {
    if (currentLayer >= rawData[0].length - 1) {
        currentLayer = 0;
    } else {
        currentLayer++;
    }
    let frontLayer = [];
    for (let x = rawData.length - 1; x >= 0; x--) {
        frontLayer.push(rawData[x][currentLayer]);
    }
    drawCanvas(frontLayer);
    loadingIndicator.innerHTML = "Layer: " + currentLayer;
}

function nextLayerSide() {
    if (currentLayer >= rawData[0][0].length - 1) {
        currentLayer = 0;
    } else {
        currentLayer++;
    }
    let sideLayer = [];
    for (let y = rawData.length - 1; y >= 0; y--) {
        let tempArray = [];
        for (let x = rawData[y].length - 1; x >= 0; x--) {
            tempArray.push(rawData[y][x][currentLayer]);
        }
        sideLayer.push(tempArray);
    }
    drawCanvas(sideLayer);
    loadingIndicator.innerHTML = "Layer: " + currentLayer;
}


//Animation Interval
var running = false;
// var myInterval = 0;
// function startAnimation() {
//     let speed = document.getElementById("animationSpeed").value;
//     this.myInterval = setInterval(function () {
//         nextLayer();
//     }, speed);
//     animationButton.textContent = "Stop animation";
// }

function startAnimationSpecial() {
    switch (angle) {
        case "top":
            nextLayer();
            break;
        case "front":
            nextLayerFront();
            break;
        case "side":
            nextLayerSide();
            break;
    }
    // console.log("Special animation started");
    if (running === true) {
        window.requestAnimationFrame(startAnimationSpecial);
    }
}

// function stopAnimation() {
//     clearInterval(this.myInterval);
// }

function animationControll() {
    running = !running;
    if (running === true) {
        // startAnimation();
        startAnimationSpecial();
        animationButton.textContent = "Stop animation";
    } else if (running === false) {
        // stopAnimation();
        animationButton.textContent = "Start animation";
    }
}

//UI functions
function showLayerControls() {
    getDataButton.style.visibility = "hidden";
    layerControlBar.style.visibility = "visible";
}

function selectAnimationAngle(type) {
    angle = type;
    switch (type) {
        case "top":
            canvas.setAttribute("width", 256);
            canvas.setAttribute("height", 256);
            canvas.style.width = "512px";
            canvas.style.height = "512px";
            if (currentLayer > 0) {
                currentLayer--;
            };
            nextLayer();
            break;
        case "front":
            canvas.setAttribute("width", 256);
            canvas.setAttribute("height", 294);
            canvas.style.width = "512px";
            canvas.style.height = "588px";
            if (currentLayer > 0) {
                currentLayer--;
            };
            nextLayerFront()
            break;
        case "side":
            canvas.setAttribute("width", 256);
            canvas.setAttribute("height", 294);
            canvas.style.width = "512px";
            canvas.style.height = "588px";
            if (currentLayer > 0) {
                currentLayer--;
            };
            nextLayerSide()
            break;
    }
}