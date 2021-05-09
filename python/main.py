import cv2
import time
import numpy

#img = cv2.imread("test4.jpg")

cap = cv2.VideoCapture(0)

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')

img = 0
ori = 0
count = 0
fps = 30
while(True):
    t1 = round(time.time()*1000) #current milliseconds

    ret, img = cap.read()
    ret2, ori = cap.read()

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    smiles = smile_cascade.detectMultiScale(gray, 1.8, 20)

    for (x, y, w, h) in faces:    
        cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 5)

    for (x, y, w, h) in smiles:
        cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 5)

    cv2.imshow("cam", img)
    cv2.waitKey(1) #wait for 1ms (taken into account by t2)

    #if cv2.waitKey(1) == ord('q'): #press q to take a photo
    #    break
    
    if len(faces) <= len(smiles) & len(faces) > 0:
        count = count + 1
    else:
        count = numpy.maximum(0, count - 1)

    print(count)

    if count > fps*3: #for smiling for 3 seconds
        break

    t2 = round(time.time()*1000) 
    time.sleep(numpy.maximum((1000/fps - (t2-t1))/1000.0, 0))

cap.release()
cv2.destroyAllWindows()

print(len(faces))
print(len(smiles))
#cv2.imshow("image", ori)
#cv2.waitKey(0)
#cv2.destroyAllWindows()

cv2.imwrite('screenshot.jpg', ori) #would ideally be saved in "past photos" section

#test4 and memes3