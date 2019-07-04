
let config = {
    apiKey: "AIzaSyDBckidQBiH288osQsDxkqB5wKPaeaXxi4",
    authDomain: "train-scheduler-7e3df.firebaseapp.com",
    databaseURL: "https://train-scheduler-7e3df.firebaseio.com",
    storageBucket: "train-scheduler-7e3df.appspot.com",
  };
  firebase.initializeApp(config);
    
    let trainData = firebase.database();
  
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();
  
    let trainName = $("#train-name-input")
      .val()
      .trim();
    let destination = $("#destination-input")
      .val()
      .trim();
    let firstTrain = $("#first-train-input")
      .val()
      .trim();
    let frequency = $("#frequency-input")
      .val()
      .trim();
  
    let newTrain = {
      name: trainName,
      destination: destination,
      firstTrain: firstTrain,
      frequency: frequency
    };
  
    trainData.ref().push(newTrain);
  
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);
  
    alert("Train successfully added");
  
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");
  });
  
  trainData.ref().on("child_added", function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());
  
    let tName = childSnapshot.val().name;
    let tDestination = childSnapshot.val().destination;
    let tFrequency = childSnapshot.val().frequency;
    let tFirstTrain = childSnapshot.val().firstTrain;
  
    let timeArr = tFirstTrain.split(":");
    let trainTime = moment()
      .hours(timeArr[0])
      .minutes(timeArr[1]);
    let maxMoment = moment.max(moment(), trainTime);
    let tMinutes;
    let tArrival;
  
    if (maxMoment === trainTime) {
      tArrival = trainTime.format("hh:mm A");
      tMinutes = trainTime.diff(moment(), "minutes");
    } else {
      let differenceTimes = moment().diff(trainTime, "minutes");
      let tRemainder = differenceTimes % tFrequency;
      tMinutes = tFrequency - tRemainder;
      tArrival = moment()
        .add(tMinutes, "m")
        .format("hh:mm A");
    }
    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);
  
    $("#train-table > tbody").append(
      $("<tr>").append(
        $("<td>").text(tName),
        $("<td>").text(tDestination),
        $("<td>").text(tFrequency),
        $("<td>").text(tArrival),
        $("<td>").text(tMinutes)
      )
    );
  });
  