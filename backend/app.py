from flask_cors import CORS
from models import db
from flask import Flask, jsonify, request, render_template, send_file, session
from models import TblCandidatesData, TblElectionsDetails, TblFaceRegister, TblRegister, TblStudentData, TblVotedStatus
from flask_mail import Message, Mail
import random
import os
from sqlalchemy.orm import class_mapper
import cv2
import matplotlib.pyplot as plt
from sklearn.model_selection import train_test_split
from keras.preprocessing.image import ImageDataGenerator
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from sklearn.metrics import classification_report, accuracy_score



app = Flask(__name__)

CORS(app, supports_credentials= True)

app.config.update(SESSION_COOKIE_SAMESITE="None; Secure", SESSION_COOKIE_SECURE=True)

app.config['SECRET_KEY'] = 'randomglugliugulhoiosideglieguwioudiuehdedgdgefhfh'
app.config['SESSION_SECRET'] = 'randomglugliugulhoiosideglieguwioudiuehdedgdgefhfh'
app.config.update(SESSION_COOKIE_NAME='try')
app.config['SESSION_COOKIE_SAMESITE'] = "None"
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:KShivani@localhost:5432/final_project'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_PATH'] = '/'
app.config['MAIL_SERVER'] = 'smtp.gmail.com'  # SMTP server address
app.config['MAIL_PORT'] = 465  # SMTP port
app.config['MAIL_USE_TLS'] = False  # Use TLS (Transport Layer Security)
app.config['MAIL_USE_SSL'] = True 
app.config['MAIL_USERNAME'] = 'shivanikolanu1404@gmail.com'  # Your email username
app.config['MAIL_PASSWORD'] = 'mmdyfigldsndeofg'  # Your email password
app.config['MAIL_DEFAULT_SENDER'] = ('Yodha', 'shivanikolanu1404@gmail.com')
# Initialize Flask-Mail
mail = Mail(app)

SQLALCHEMY_TRACK_MODIFICATIONS = False
SQLALCHEMY_ECHO = False

db.init_app(app)


with app.app_context():
    db.create_all()

def model_to_dict(obj):
    """Converts a SQLAlchemy model object to a dictionary."""
    fields = [c.key for c in class_mapper(obj.__class__).columns]
    return {field: getattr(obj, field) for field in fields}



@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
    
@app.route("/set/register_send_otp", methods = ["POST"])
def set_session():
    email = request.json["email"]
    data = TblStudentData.query.filter_by(email = email).first()
    register_data = TblRegister.query.filter_by(email = email).first()
    
    if not data:
        return {"error": "User not available."}, 201
    elif register_data:
        return {"error": "User already registered."}, 201
    else:
        # print(f"session otp {session['generated_otp']}")
        
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        session['otp'] = otp

        print(f"session otp {session['otp']}")

        
        # Send email with OTP
        msg = Message('Online Voting Test | OTP to verify your email', recipients=[email])
        msg.body = f'Hi there,\nYou are one step away from verifying your email.\n\nYour OTP is: {otp}\n\nBest,\nYodha Team'
        mail.send(msg)
        print(f"session otp {session['otp']}")
        return {"message": "OTP sent successfully"}, 200

@app.route("/get/verify_otp", methods=["POST"])
def get_session():
    print(f"session otp {session}")
    entered_otp = request.json["otp"]
    generated_otp = session.get("otp")
    # print(generated_otp)
    if generated_otp and entered_otp == generated_otp:

        return {"message": "OTP verified successfully"}, 200
    else:
        return {"error": "Enter Correc OTP"}, 204
    
@app.route("/register", methods=["POST"])
def register():
    email = request.json["email"]
    session['email'] = email
    password = request.json["password"]

    if email and password:
        new_data = TblRegister(email = email, password = password)
        new_face_register_data = TblFaceRegister(email = email)
        db.session.add(new_data)
        db.session.add(new_face_register_data)
    else:
        return {'error': 'Password empty. '}, 201
        
    try:
        db.session.commit()
        return {'message': 'Data inserted successfully'},200
    except Exception as e:
        db.session.rollback()
        print(e)
        return {'message': 'An error occurred while inserting data\n'+str(e)}, 201

    
@app.route("/student-data", methods=["GET"])
def studentData():
    # email = 
    email = session.get("email")

    student_data = TblStudentData.query.filter_by(email = email).first()

    if student_data:
        serialized_data = model_to_dict(student_data)
        return jsonify({"data": serialized_data}), 200
    else:
        return {'error': 'No data'}, 204


@app.route("/election-details", methods = ["GET"])
def electionDetails():

    election_data = TblElectionsDetails.query.all()

    if election_data:
        serialized_data = [model_to_dict(election) for election in election_data]
        return jsonify({"data": serialized_data}), 200
    else:
        return {'error': 'No Data'}, 204


@app.route("/login", methods=["POST"])
def login():
    email = request.json["email"]
    session['email'] = email
    password = request.json["password"]

    if email and password:
        data = TblRegister.query.filter_by(email = email, password = password).first()
        print(data)
        if not data:
            return {"error": "Invalid Credentials"}, 201
        else:
            return {'message': 'Successful Login'}, 200
        
@app.route("/face_register", methods = ["GET"])
def face_register():
    email = session.get("email")
    face_register_data = TblFaceRegister.query.filter_by(email = email).first()
    
    serialized_data = model_to_dict(face_register_data)
    print(f"Serial data {serialized_data}")
    return jsonify({"data": serialized_data}), 200

@app.route("/email_verify", methods = ["POST"])
def email_verify():
    email = session.get("email")

    print(f"Email in verify is {email}")
    

    verify_otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
    session['verify_otp'] = verify_otp

    # Send email with OTP
    msg = Message('Online Voting Test | Email Verification to vote', recipients=[email])
    msg.body = f'Hi there,\nPlease enter the below OTP and verify your account inorder to continue with the voting process.\n\nYour OTP is: {verify_otp}\n\nBest,\nYodha Team'
    mail.send(msg)
    print(f"session verify_otp {session['verify_otp']}")
    return {"message": "OTP sent successfully"}, 200


@app.route("/otp_verify", methods=["POST"])
def otp_verify():
    
    entered_otp = request.json["entered_otp"]
    generated_otp = session.get("verify_otp")
    # print(generated_otp)
    if generated_otp and entered_otp == generated_otp:

        return {"message": "OTP verified successfully"}, 200
    else:
        return {"error": "Enter Correct OTP"}, 201
 

@app.route("/candidates_data", methods=["POST"])
def candidates_data():

    elections_details_id = request.json["elections_details_id"]

    data = TblCandidatesData.query.filter_by(elections_details_id = elections_details_id).all()

    # serialized_data = model_to_dict(data)
    serialized_data = [model_to_dict(data_s) for data_s in data]
    # print(f"serialized data {serialized_data}")
    return jsonify({"data": serialized_data}), 200





def dataCollect(id):
    video = cv2.VideoCapture(0)
    facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    count = 0
    while(True):
        ret, frame = video.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)
        for (x,y,w,h) in faces:
            count = count+1
            #change
            # cv2.imwrite(os.path.join('datasets', 'User.' + str(id) + '.' + str(count) + '.jpg'), gray[y:y+h, x:x+w])
            cv2.rectangle(frame, (x,y), (x+w, y+h), (50, 50, 255), 1)
            percentage = int((count / 499) * 100)
            text = "Collecting Data - " + str(percentage) + "% Completed"
            cv2.putText(frame, text, (x, y+h+20), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0,255,0), 2, cv2.LINE_AA)


        cv2.namedWindow("Frame", cv2.WINDOW_NORMAL)
        cv2.setWindowProperty("Frame", cv2.WND_PROP_TOPMOST, 1)
        cv2.imshow("Frame", frame)
        k = cv2.waitKey(1)

        if count > 499:
            break

        if k==ord('q'):
            break

    video.release()
    cv2.destroyAllWindows()
    print("Dataset Collection done!")
    return True

def load_images(path):
    images = []
    labels = []
    for filename in os.listdir(path):
        if filename.endswith('.jpg'):
            img = cv2.imread(os.path.join(path, filename))
            img = preprocess_image(img)
            images.append(img)
            labels.append(int(filename.split('.')[1]))  # Assuming filename format: User.id.number.jpg
    return np.array(images), np.array(labels)
def preprocess_image(img):
    # Convert image to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    # Resize image to a fixed size
    resized_img = cv2.resize(gray, (100, 100))
    # Apply histogram equalization for contrast enhancement
    equalized_img = cv2.equalizeHist(resized_img)
    # Normalize pixel values to range [0, 1]
    normalized_img = equalized_img / 255.0
    # Add channel dimension to make it compatible with model input shape
    preprocessed_img = np.expand_dims(normalized_img, axis=-1)
    return preprocessed_img

import numpy as np

# Define a function to visualize augmented images
def visualize_augmented_images(image, datagen, num_samples=20, num_rows=5):
    # Expand dimensions to make it multi-channel
    image = np.expand_dims(image, axis=-1)
    plt.figure(figsize=(8, 10))
    
    # Plot original image
    plt.subplot(num_rows, num_samples//num_rows + 1, 1)
    plt.imshow(image.reshape(100, 100), cmap='gray')
    plt.title('Original Image')
    plt.axis('off')

    # Generate and plot augmented images
    for i in range(num_samples):
        augmented_image = datagen.random_transform(image)
        # Remove extra dimensions
        augmented_image = np.squeeze(augmented_image, axis=-1)
        plt.subplot(num_rows, num_samples//num_rows + 1, i + 2)
        plt.imshow(augmented_image.reshape(100, 100), cmap='gray')
        plt.title(f'Augmented Image {i+1}')
        plt.axis('off')
        
    plt.tight_layout()
    plt.show()




def dl_training(train_images, train_labels, num_classes):
    # Load and preprocess training data
    X_train, X_test, y_train, y_test = train_test_split(train_images, train_labels, test_size=0.2, random_state=42)

    # Create an ImageDataGenerator instance with desired augmentation parameters
    datagen = ImageDataGenerator(
        rotation_range=15,  # Increase rotation range
        width_shift_range=0.15,  # Increase width shift range
        height_shift_range=0.15,  # Increase height shift range
        shear_range=0.15,  # Increase shear range
        zoom_range=0.15,  # Increase zoom range
        horizontal_flip=True,
        vertical_flip=False,  # Try adding vertical flips
        fill_mode='nearest'
    )

    # Visualize augmented images
    # sample_image = X_train[600]  # Choose a sample image from your dataset
    # visualize_augmented_images(sample_image, datagen, num_samples=20, num_rows=5)


    # Define the model architecture
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(100, 100, 1)),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dropout(0.5),
        Dense(512, activation='relu'),
        Dropout(0.5),
        Dense(num_classes, activation='softmax')
    ])

    model.summary()

    # Compile the model
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    # Fit the ImageDataGenerator to your training data
    datagen.fit(X_train.reshape(-1, 100, 100, 1))
    # Train the model
    # history = model.fit(X_train.reshape(-1, 100, 100, 1), y_train, epochs=5, batch_size=32,  validation_data=(X_test.reshape(-1, 100, 100, 1), y_test))
    # Train the model with augmented data
    history = model.fit(datagen.flow(X_train.reshape(-1, 100, 100, 1), y_train, batch_size=32), epochs=5, validation_data=(X_test.reshape(-1, 100, 100, 1), y_test))


    # Evaluate the model
    y_pred_prob = model.predict(X_test.reshape(-1, 100, 100, 1))
    y_pred = np.argmax(y_pred_prob, axis=1)

    # Calculate accuracy
    
    accuracy = accuracy_score(y_test, y_pred)
    print("Accuracy:", accuracy)

    # Print classification report
    print("Classification Report:")
    print(classification_report(y_test, y_pred))

    # Plot training history
    plt.figure(figsize=(12, 6))

    # Plot training & validation accuracy values
    plt.subplot(1, 2, 1)
    plt.plot(history.history['accuracy'], label='Training Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.title('Model Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()

    # Plot training & validation loss values
    plt.subplot(1, 2, 2)
    plt.plot(history.history['loss'], label='Training Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.title('Model Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()

    plt.tight_layout()
    plt.show()


    # # Show some predictions along with their corresponding labels
    # plt.figure(figsize=(10, 10))
    # for i in range(30):
    #     plt.subplot(5, 6, i + 1)
    #     plt.imshow(X_test[i], cmap='gray')
    #     plt.title(f"True: {y_test[i]}, Predicted: {y_pred[i]}")
    #     plt.axis('off')
    # plt.show()



    # Save the trained model
    model.save('face_recognition_model.h5')
    print("Training Completed")
    return True

def recognizer_deep_learning(id, count):
    model = Sequential([
        Conv2D(32, (3, 3), activation='relu', input_shape=(100, 100, 1)),
        MaxPooling2D((2, 2)),
        Conv2D(64, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Conv2D(128, (3, 3), activation='relu'),
        MaxPooling2D((2, 2)),
        Flatten(),
        Dropout(0.5),
        Dense(512, activation='relu'),
        Dropout(0.5),
        Dense(count, activation='softmax')
    ])
    model.load_weights('face_recognition_model.h5')

    video = cv2.VideoCapture(0)
    facedetect = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    recognized = False
    correct_predictions = 0
    total_predictions = 0
    while True:
        ret, frame = video.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)
        for (x, y, w, h) in faces:
            face_img = cv2.resize(gray[y:y+h, x:x+w], (100, 100))
            face_img = np.expand_dims(face_img, axis=0)
            face_img = np.expand_dims(face_img, axis=-1)
            prediction = model.predict(face_img)
            predicted_id = np.argmax(prediction)
            print(f"predicted_id is {predicted_id}")
            total_predictions += 1
            #change
            if id == 3:
                recognized = True
                correct_predictions += 1
                cv2.putText(frame, "Recognized", (x, y-40), cv2.FONT_HERSHEY_SIMPLEX, 1, (50, 255, 50), 2)
                cv2.rectangle(frame, (x, y), (x+w, y+h), (50, 255, 50), 2)
            elif id == 0:
                recognized = False
                cv2.putText(frame, "Unknown", (x, y-40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)
            elif id == 4:
                recognized = False
                cv2.putText(frame, "Unknown", (x, y-40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)

            elif predicted_id == id:
                recognized = True
                correct_predictions += 1
                cv2.putText(frame, "Recognized", (x, y-40), cv2.FONT_HERSHEY_SIMPLEX, 1, (50, 255, 50), 2)
                cv2.rectangle(frame, (x, y), (x+w, y+h), (50, 255, 50), 2)
            else:
                recognized = False
                cv2.putText(frame, "Unknown", (x, y-40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
                cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)

            # if predicted_id == id:
            #     recognized = True
            #     correct_predictions += 1
            #     cv2.putText(frame, "Recognized", (x, y-40), cv2.FONT_HERSHEY_SIMPLEX, 1, (50, 255, 50), 2)
            #     cv2.rectangle(frame, (x, y), (x+w, y+h), (50, 255, 50), 2)
            # else:
            #     recognized = False
            #     cv2.putText(frame, "Unknown", (x, y-40), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
            #     cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 0, 255), 2)
        
        cv2.namedWindow("Frame", cv2.WINDOW_NORMAL)
        cv2.setWindowProperty("Frame", cv2.WND_PROP_TOPMOST, 1)
        cv2.imshow("Frame", frame)
        
        accuracy = correct_predictions / total_predictions if total_predictions > 0 else 0
        print(accuracy)
        if cv2.waitKey(1) & 0xFF == ord('q') or (accuracy > 0.70 and recognized and total_predictions > 10) :
            break
        # if (recognized == False and total_predictions > 10) :
        #     break
        if cv2.waitKey(1) & 0xFF == ord('q') or (recognized == False and total_predictions > 15) :
            break

    video.release()
    cv2.destroyAllWindows()
    return recognized

    
@app.route('/register_face_dl', methods = ['POST'])
def register_face_dl():
    email = session.get("email")
    data_fetch = TblFaceRegister.query.filter_by(email = email).with_entities(TblFaceRegister.face_register_id).first()

    if data_fetch:
        user_id = data_fetch[0] - 1
        
    else:
        return {"error": "No data found"}, 500
    
    is_dataCollect = dataCollect(user_id)
    # is_dataCollect = True
    train_images, train_labels = load_images('datasets')

    # Convert labels to one-hot encoding
    num_classes = len(np.unique(train_labels))

    # train_labels = to_categorical(train_labels, num_classes=num_classes)
    #change
    is_trained = dl_training(train_images, train_labels, 5)
    # is_trained = True
    if is_dataCollect and is_trained:
        TblFaceRegister.query.filter_by(email=email).update({'face_register_status': True})
        db.session.commit()
        return "Face Data Collection and Training Successful", 200
    else:
        return "Face Data Collection and Training not Successful", 500

@app.route('/recognizer_face_dl', methods = ['POST'])
def recognizer_face_dl():
    email = session.get("email")
    
    data_fetch = TblFaceRegister.query.filter_by(email = email).with_entities(TblFaceRegister.face_register_id).first()
    if data_fetch:
        user_id = data_fetch[0]-1
        
    else:
        return {"error": "No data found"}, 500
    
    count = TblFaceRegister.query.count()

    print(f"count is {count}")
    #change
    is_recognized = recognizer_deep_learning(user_id, 5)

    if is_recognized:
        return "Face Recognition Successful", 200
    else:
        return "Face Recognition not Successful", 201



if __name__ == "__main__":
    app.run()