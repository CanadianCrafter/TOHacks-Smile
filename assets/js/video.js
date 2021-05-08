let video = document.getElementById("videoInput");
if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true, audio: false}).then(function (stream) {
        video.srcObject = stream;
        video.play();
        
        let size = new cv.Size();
        size.width = video.width;
        size.height = video.height;
        //let src = new cv.Mat(size, cv.CV_8UC4); //mat = image container, CV_8UC4: 8U unsigned int, C4 4 colour containers
        let img = new cv.Mat(size, cv.CV_8UC4); //initialize image containers
        let gray = new cv.Mat();
        let cap = new cv.VideoCapture(video);

        //load cascade onto classifier
        let classifier = new cv.CascadeClassifier();
        let cascade = "./haarcascade_frontalface_default.xml";
        classifier.load(cascade);
    
        const FPS = 30;
        function processVideo() {
            //try {
                /*
                if (!streaming) {
                    // clean and stop.
                    src.delete();
                    dst.delete();
                    gray.delete();
                    faces.delete();
                    classifier.delete();
                    return;
                }*/
    
                let begin = Date.now();
                // start processing.
                cap.read(img) //initalizes src from videocapture
                cv.cvtColor(img, gray, cv.COLOR_RGBA2GRAY, 0); //convert dst to gray and stores it in gray
                let faces = new cv.RectVector();
                classifier.detectMultiScale(gray, faces, 1.1, 3, 0); //detect faces in gray, returning to faces RectVector
                console.log("Here");
                for (let i = 0; i < faces.size(); i++) { //print rectangles around all faces from faces RectVector
                    let face = faces.get(i);
                    let point1 = new cv.Point(face.x, face.y);
                    let point2 = new cv.Point(face.x + face.width, face.y + face.height);
                    cv.rectangle(img, point1, point2, [255, 0, 0, 255]); //255, 0, 0, 255 is color red
                }
                cv.imshow("videoOutput", img);
                
                // schedule the next one.
                let delay = 1000/FPS - (Date.now() - begin);
                setTimeout(processVideo, delay);
            //} catch (err) {
            //    console.log("Error Detected: " + err);
            //}
        };
    
        // schedule the first one.
        setTimeout(processVideo, 0);
    }).catch(function (err) {
        console.log("Error Detected: " + err);
    });    
}

function onOpenCvReady() {
    console.log("OpenCV.js is ready.");
}