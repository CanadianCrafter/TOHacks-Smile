import cv from "opencv.js";

let video = document.getElementById("videoElement");
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(function (stream) {
        video.srcObject = stream;
        video.play();
    
        let src = new cv.Mat(video.height, video.width, cv.CV_8UC4); //mat = image container, CV_8UC4: 8U unsigned int, C4 4 colour containers
        let dst = new cv.Mat(video.height, video.width, cv.CV_8UC4); //initialize image containers
        let gray = new cv.Mat();
        let cap = new cv.VideoCapture(video);
        let faceCascade = new cv.CascadeClassifier();
        faceCascade.load('haarcascade.xml');
        let faces = new cv.RectVector();
    
        const FPS = 30;
        function processVideo() {
            try {
                if (!streaming) {
                    // clean and stop.
                    src.delete();
                    dst.delete();
                    gray.delete();
                    faces.delete();
                    classifier.delete();
                    return;
                }
    
                let begin = Date.now();
                // start processing.
                cap.read(src) //initalizes src from videocapture
                src.copyTo(dst); //initializes dst from src (copied), since dst may be unstable about detectMultiScale
                cv.cvtColor(dst, gray, cv.COLOR_RGBA2GRAY, 0); //convert dst to gray and stores it in gray
                faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0); //convert gray to faces RectVector
                for (let i = 0; i < faces.size(); i++) { //print rectangles around all faces from faces RectVector
                    let face = faces.get(i);
                    let point1 = new cv.Point(face.x, face.y);
                    let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                    cv.rectangle(cap, point1, point2, [255, 0, 0, 255]); //255, 0, 0, 255 is color red
                }
                cv.imshow("canvasOutput", dst);
                
                // schedule the next one.
                let delay = 1000/FPS - (Date.now() - begin);
                setTimeout(processVideo, delay);
            } catch (err) {
                console.log("Error Detected: " + err);
            }
        };
    
        // schedule the first one.
        setTimeout(processVideo, 0);
    }).catch(function (err) {
        console.log("Error Detected: " + err);
    });    
}
