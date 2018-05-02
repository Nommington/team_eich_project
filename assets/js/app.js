var mapsUrl = "https://maps.googleapis.com/maps/api/";
var geoCode = "geocode/json?address=";
var nearBy = "place/nearbysearch/json?"
var locate = "location=";
var typeSearch = "&radius=1500&type=restaurant";
var mapsKey = "&key=AIzaSyD-9rm4gqljdlkdqlJyeFe2YHKfEIS3g6o";
var placesKey = "&key=AIzaSyCyIytMxm9UxMaTB7NcJk_NNYm9r4PFVMo";
var cors = "http://cors-proxy.htmldriven.com/?url="

var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=592238e535047ebb1662bcb732c20eb9&lat="


var yelpKey = "S6BIH0SfrulQ7YOPlHJCWlXsqFfH199mDG2T0dLGuskTrE8k5Z_sFqgP96FIdbQsbvcxBJLxINNESRP9z6ngDJC2P0l27-EWORwirFCg_6Iqga0t3SJjKGm9hgjgWnYx"

var config = {
    apiKey: "AIzaSyBAY1lHQ0eUQ7hBjeAfWo_xSBE4Q3eEkC4",
    authDomain: "weather-history-1524803336220.firebaseapp.com",
    databaseURL: "https://weather-history-1524803336220.firebaseio.com",
    projectId: "weather-history-1524803336220",
    storageBucket: "weather-history-1524803336220.appspot.com",
    messagingSenderId: "1063851500267"
};
firebase.initializeApp(config);

var database = firebase.database();

//   var icons = {
//       clear: "assets/images/cloudy.png"
//   }



// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=
// https://api.darksky.net/forecast/55c20b7e129d72010d38eb997b53d47e/35.1001511,-80.8051842


var convertLocation = function() {

    var addressInput = $("#search-term").val();
    for (i = 0; i < addressInput.length; i++) {
        addressInput = addressInput.replace(" ", "+");
    }

    var queryURL = mapsUrl + geoCode + addressInput + mapsKey;
    console.log(queryURL);
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {



        var result = response.results[0].geometry.location;
        var location = response.results[0].formatted_address;
        console.log("This is: " + location)

        var lattitude = result.lat;
        var longitude = result.lng;

        var newLocation = {

            location: location,
            lat: lattitude,
            lon: longitude
        }
        // Push to firebase
        database.ref().push(newLocation)



        swal({
            title: "Good job!",
            text: "You clicked the button!",
            icon: "success",
            button: "Aww yiss!",
        });

    })

}



$("#run-search").on('click', function(event) {
    event.preventDefault();
    $("#bug-area").removeClass("hidden");
    $("#places-area").empty();
    $("#places-area").addClass("hidden");
    convertLocation();
    $("#search-term").val("");


})

database.ref().on("child_added", function(snapshot) {

    //Getting the values of the firebase objects
    var lattitude = snapshot.val().lat;
    var longitude = snapshot.val().lon;
    var location = snapshot.val().location;
    console.log("Lattitude: " + lattitude);
    console.log("Longitude :" + longitude);


    var queryURL = weatherUrl + lattitude + "&lon=" + longitude
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(queryURL);
        var kelvin = response.list[0].main.temp;
        var convert = 1.8 * (kelvin-273) + 32;
        var temp = Math.ceil(convert);
        console.log("Temperature: " + temp);

        var summary = response.list[0].weather[0].main;
        for (i = 0; i < summary.length; i++) {
            summary = summary.replace(" ", "-");
        }
        var conditions = summary.toLowerCase();
        console.log("Condtions: " + conditions);

        //Creating a button to hold the city weather info
        var bugDiv = $("<div>")
        bugDiv.addClass("bug-div col-xs-5 col-sm-5")
        

        //Add the location, temp, and conditions to button
        //toDo: replace summary div with an icon based on value of summary
        var locationDiv = $("<p>").text(location);
        var sumDiv = $("<img>")
        sumDiv.attr("id", conditions);
        var tempDiv = $("<p>").text(temp);

        //Append all divs to the button then add button to container
        bugDiv.append(locationDiv);
        bugDiv.append(sumDiv);
        bugDiv.append(tempDiv);



        var placesButton = $("<button>")
        placesButton.val(lattitude + "," + longitude);
        placesButton.text("Get Nearby Places");
        bugDiv.append(placesButton);

        $("#bug-area").append(bugDiv);
    })
})



$("#bug-area").on('click', "button", function() {
    $("#bug-area").addClass("hidden");
    $("#places-search-div").removeClass("hidden");
    var location = $(this).val();
    $("#location-input").val(location);
})

$("#places-submit").on('click', function()  {
    var distanceMiles = $("#distance").val();
    var miles = parseInt(distanceMiles);
    var meters = miles/0.00062137;
    var distance = Math.ceil(meters);

    var typeVal = $("#type").val();
    var typeRep = typeVal.replace(" ", "_");
    var type = typeRep.toLowerCase();

    var location = $("#location-input").val();

    $("#places-search-div").addClass("hidden");
    $("#places-area").removeClass("hidden");

    var encode = mapsUrl + nearBy + locate + location + "&radius=" + distance + "&type=" + type + placesKey;
    var encodeCors = encodeURIComponent(encode);
    console.log(encode);
    var queryURL = cors + encodeCors;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response)  {
        var places = JSON.parse(response.body);
        var placesResults = places.results;
        console.log(placesResults);
        for(i = 0; i < 4; i++)  {
            var name = placesResults[i].name;
            var rating = placesResults[i].rating;
            var icon = placesResults[i].icon;
            console.log(name + rating + icon);

            var placesDiv = $("<div>");
            placesDiv.addClass("places-div col-xs-5");
        
            var iconDiv = $("<img>").attr("src", icon);
            iconDiv.addClass("img-responsive");
            var nameDiv = $("<p>").text(name);
            var ratingDiv = $("<p>").text(rating);

            placesDiv.append(iconDiv)
            placesDiv.append(nameDiv);
            placesDiv.append(ratingDiv);
            $("#places-area").append(placesDiv);
        }
    })

})


    // var location = $(this).val();
    // var encode =  mapsUrl + nearBy + locate + location + typeSearch + placesKey
    // var hello = encodeURIComponent(encode);
    // console.log(hello);
    // var queryURL = cors + hello;
    // $.ajax({
    //     url: queryURL,
    //     method: "GET"
    // }).then(function(response){
    //     console.log("Google " + queryURL)
    
    

    // });




  