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
  var firstTrain = moment($("#firstTrain-input").val()).format("HH:mm");
  var frequency = $("#frequency-input").val();
console.log(firstTrain);
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
  console.log(newTrain.frequency)

  alert("train successfully added");

  // Clears all of the text-boxes
  $("#train-name-input").val("");
  $("#destination-input").val("");
  $("#firstTrain-input").val("");
  $("#frequency-input").val("")

});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot) {
  console.log(childSnapshot.val());

  // Store everything into a variable.
  var name = childSnapshot.val().name;
  var destination = childSnapshot.val().destination;
  var firstTrainNew = childSnapshot.val().firstTrain;
  var frequency = childSnapshot.val().frequency;
  

  var firstTrain = moment(firstTrainNew, "X").subtract(1, "years");
  console.log(firstTrainNew)

  //Current Time
  var currentTime = moment().format();

  // Diff between the current and firstTrain
  var diffTime = moment().diff(moment(firstTrain), "minutes");
  console.log("Differennce in time: " + diffTime);
  //
  var remainder = diffTime % childSnapshot.val().frequency;
  console.log(remainder)

  //Min till next train
  var minAway = frequency - remainder;
  console.log(minAway);
  //Next Train Time

  var nextTrain = moment().add(minAway, "minutes").format("HH:mm A");
  //nextTrain = moment(nextTrain).format("HH:mm");
  console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));

  // Create the new row
  var newRow = $("<tr>").append(
    $("<td>").text(name),
    $("<td>").text(destination),
    $("<td>").text(frequency), 
    $("<td>").text(nextTrain),
    $("<td>").text(minAway),
   
    
    

  );
  // Append the new row to the table
  $("#train-table > tbody").append(newRow);
});


