import cv2

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
smile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_smile.xml')

img = cv2.imread("test4.jpg")
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

faces = face_cascade.detectMultiScale(gray, 1.3, 5)
smiles = smile_cascade.detectMultiScale(gray, 1.8, 20)

for (x, y, w, h) in faces:    
    cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 5)

for (x, y, w, h) in smiles:
    cv2.rectangle(img, (x, y), (x+w, y+h), (0, 255, 0), 5)
        

print(len(faces))
print(len(smiles))
cv2.imshow("image", img)
cv2.waitKey(0)
cv2.destroyAllWindows()

#test4 and memes3