// WARNING: The API Key must be your public Web API Key (starts with AIza...); 
// the value provided in the prompt is a Private Key ID and won't work in the browser.
const firebaseConfig = {
    apiKey: "d170c09c54941c08dd897a0b4fe5a073aaf4f90d", // <-- MUST BE A PUBLIC KEY
    authDomain: "heartsync-esp1357.firebaseapp.com",
    databaseURL: "https://heartsync-esp1357-default-rtdb.firebaseio.com", 
    projectId: "heartsync-esp1357",
};

// Initialize the Firebase App
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Reference to the HeartData path (Assuming your simulator pushes to 'HeartData')
const dbRef = firebase.database().ref('HeartData');

// --- Chart Setup (Requires <canvas id="ecgChart"> in HTML) ---
const ctx = document.getElementById('ecgChart').getContext('2d');
const MAX_POINTS = 200; // Keep 200 points for a smooth, scrolling trace

let ecgChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'ECG Signal (Simulated)',
            data: [],
            // Using Electric Green for the Monitor Aesthetic
            borderColor: 'hsla(0, 0%, 0%, 1.00)', 
            borderWidth: 2,
            tension: 0.1,
            pointRadius: 0
        }]
    },
    options: {
        animation: false, // Critical for real-time streaming
        scales: {
            x: { display: false }, // Hide X-axis
            y: { 
                min: 500, 
                max: 2000, 
                // Set text color for dark mode visibility
                ticks: { color: 'white' }, 
                title: { display: true, text: 'Raw ADC Value', color: 'rgba(0, 0, 0, 1)' } 
            } 
        },
        plugins: {
            legend: { display: false } // Hide the legend
        }
    }
});

// --- Real-Time Listener ---
dbRef.limitToLast(1).on('child_added', (snapshot) => {
    const data = snapshot.val();
    
    // Check if the expected data key exists (must match simulator/ESP32 output)
    const ecgValue = data.ecg_val; 
    if (typeof ecgValue !== 'number') return; // Exit if data is invalid or not found

    // Add the new point
    ecgChart.data.labels.push(ecgChart.data.datasets[0].data.length); 
    ecgChart.data.datasets[0].data.push(ecgValue);

    // Keep the chart scrolling by removing the oldest point
    if (ecgChart.data.labels.length > MAX_POINTS) {
        ecgChart.data.labels.shift();
        ecgChart.data.datasets[0].data.shift();
    }

    // Update the chart view
    ecgChart.update();
});