const admin = require('firebase-admin');

// 1. Initialize Firebase Admin SDK (Need to download a 'Service Account Key' JSON file)
// You get this key file from Firebase Console -> Project Settings -> Service Accounts
const serviceAccount = require("./heartsync-esp1357-firebase-adminsdk-fbsvc-d170c09c54.json"); // <-- UPDATE THIS LINE

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://heartsync-esp1357-default-rtdb.firebaseio.com" // <-- UPDATE THIS LINE
});
const db = admin.database();

// Function to generate and push a simulated data point
function pushFakeData() {
  // Simulate raw ECG values between 800 and 1800
  const ecgValue = Math.floor(Math.random() * 1000) + 800; 

  const newData = {
    time_ms: Date.now(),
    ecg_val: ecgValue
  };

  // PUSH data to the /HeartData path
  db.ref('HeartData').push(newData);
}

// Run the push function repeatedly every 50ms, simulating the ESP32 loop()
console.log("Starting real-time data simulation...");
setInterval(pushFakeData, 50);