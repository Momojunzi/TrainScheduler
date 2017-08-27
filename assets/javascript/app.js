var config = {
	apiKey: "AIzaSyDrzVs1VwbBbnv4WxjEFsGAEwkfVNiELRk",
	authDomain: "train-scheduler-f4fd3.firebaseapp.com",
	databaseURL: "https://train-scheduler-f4fd3.firebaseio.com",
	projectId: "train-scheduler-f4fd3",
	storageBucket: "train-scheduler-f4fd3.appspot.com",
	messagingSenderId: "261251455253"
};
firebase.initializeApp(config);
var database = firebase.database();


$(document).ready(function(){

	setInterval(function(){
		var currentTime = moment().format('h:mm:ss a');
		var timeDisplay = $('<h1>').html(currentTime);
		$('#timeDisplay').html(timeDisplay);
	}, 1000);

	$('#submit').on('click', function(){
		event.preventDefault();
		var trainName = $('#trainName').val().trim();
		var destination = $('#destination').val().trim();
		var firstTrain = $('#firstTrain').val().trim();
		var frequency = $('#frequency').val().trim();

		database.ref().push({
			trainName: trainName,
			destination: destination,
			firstTrain: firstTrain,
			frequency: frequency
		});
	});

	database.ref().on("child_added", function(snapshot) {
		var data = snapshot.val();
		var trainName = data.trainName;
		var destination = data.destination;
		var firstTrain = data.firstTrain;
		var frequency = data.frequency;
		var firstTrainConverted = moment(firstTrain, "hh:mm").subtract(1, "years");
		var currentTime = moment();
		var timeDifference = currentTime.diff(moment(firstTrainConverted), "minutes");
		var tRemainder = timeDifference % frequency;
		var minutesAway = frequency - tRemainder;
		var nextTrain = moment().add(minutesAway, "minutes").format("hh:mm a");
		$('#tbody').append("<tr>" +
								"<td id='table-trainName'> " + trainName + "</td>" +
								"<td id='table-destination'> " + destination + "</td>" +
					       	 	"<td id='table-frequency'> " + frequency + "</td>" +
					        	"<td id='next-train'> " + nextTrain + "</td>" +
					        	"<td id='minutes-away'>" + minutesAway + "</td>" +
				        	"</tr>");

	}, function(errorObject) {
		console.log("there was an error pulling data from the databse: " + errorObject.code);
	})
});