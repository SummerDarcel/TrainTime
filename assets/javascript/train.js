var config = {
  apiKey: "AIzaSyC8VUxifpblQeyPoE42NJtCymJc1agVPe0",
  authDomain: "c-mon-ride.firebaseapp.com",
  databaseURL: "https://c-mon-ride.firebaseio.com",
  projectId: "c-mon-ride",
  storageBucket: "",
};

firebase.initializeApp(config);

var database = firebase.database();
// Initial Values
var name = "";
var destination = "";
var firstTrain = "";
var frequency = "";

// 2. Button for adding trains
$("#add-train-btn").on("click", function (event) {
  event.preventDefault();

  // Grabs user input
  var name = $("#train-name-input").val().trim();
  var destination = $("#destination-input").val().trim();
  var firstTrain = $("#firstTrain-input");
  var frequency = $("#frequency-input");

  // Creates local "temporary" object for holding train data
  var newTrain = {
    name: name,
    destination: destination,
    firstTrain: firstTrain,
    frequency: frequency
  };

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.name);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);

  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstTrain-input").val("");
  $("#frequency-input").val("");
});

// 3. Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrain = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;

  var minAway;
  //
  var firstTrainNew = moment(childSnapshot.val().firstTrain,"hh:mm").subtract(1,"years");
  // Diff between the current and firstTrain
  var diffTime = moment().diff(moment(firstTrainNew), "minutes");
  var remainder = diffTime % childSnapshot.val().frequency;
  //Min till next train
  var minAway = childSnapshot.val().frequency - remainder;
  //Next Train Time
  var nextTrain = moment().add(minAway, "minutes");
  nextTrain = moment(nextTrain).format("hh:mm");
  
  // train Info
  console.log(name);
  console.log(destination);
  console.log(firstTrain);
  console.log(frequency);

  //var firstTrain = moment.unix(firstTrain).format("hh:mm");
  //var frequency = frequency * frequency;
 // console.log(frequency);

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(name),
    $("<td>").text(destination),
    $("<td>").text(firstTrain),
    $("<td>").text(frequency),
  );
  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});


