// -------------------------------------------
//   ECG Monitoring Using Arduino + AD8232
//   Clean Graph + Lead-Off Detection
// -------------------------------------------

int ecgPin = A0;        // AD8232 OUTPUT → A0
int leadOffPlus = 10;   // LO+  → 10
int leadOffMinus = 11;  // LO-  → 11

void setup() {
  Serial.begin(9600);
  pinMode(ecgPin, INPUT);
  pinMode(leadOffPlus, INPUT);
  pinMode(leadOffMinus, INPUT);

  Serial.println("ECG Monitoring Started...");
}

void loop() {

  // If electrodes are not attached properly
  if (digitalRead(leadOffPlus) == 1 || digitalRead(leadOffMinus) == 1) {
    Serial.println(0);   // show flat line if lead is off
    return;
  }

  // Read analog ECG value
  int ecgValue = analogRead(ecgPin);

  // Print value to Serial Plotter
  Serial.println(ecgValue);

  delay(15);  // controls graph speed (10–20 ms is best)
}