//Google Maps API
var mapsUrl = "https://maps.googleapis.com/maps/api/";
//latitude and Longitude Search
var geoCode = "geocode/json?address=";
//Places search 
var nearBy = "place/nearbysearch/json?"
var locate = "location=";
var typeSearch = "&radius=1500&type=restaurant";
//Google Maps Key
var mapsKey = "&key=AIzaSyD-9rm4gqljdlkdqlJyeFe2YHKfEIS3g6o";
//Weather API
var weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?id=524901&APPID=592238e535047ebb1662bcb732c20eb9&lat="
//CORS Proxy
var cors = "https://cors-proxy.htmldriven.com/?url="

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

//
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

        var latitude = result.lat;
        var longitude = result.lng;

        var newLocation = {

            location: location,
            lat: latitude,
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
    console.log(latitude + " : " + longitude);
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
    var latitude = snapshot.val().lat;
    var longitude = snapshot.val().lon;
    var location = snapshot.val().location;



    var queryURL = weatherUrl + latitude + "&lon=" + longitude
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(queryURL);
        var kelvin = response.list[0].main.temp;
        var convert = 1.8 * (kelvin-273) + 32;
        var temp = Math.ceil(convert);

        var summary = response.list[0].weather[0].main;
        for (i = 0; i < summary.length; i++) {
            summary = summary.replace(" ", "-");
        }
        var conditions = summary.toLowerCase();

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
        placesButton.addClass("places-button")
        placesButton.val(latitude + "," + longitude);
        placesButton.text("Get Nearby Places");
        bugDiv.append(placesButton);

        $("#bug-area").append(bugDiv);
    })
})



$("#bug-area").on('click', ".places-button", function() {
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

    var encode = mapsUrl + nearBy + locate + location + "&radius=" + distance + "&type=" + type + mapsKey;
    var encodeCors = encodeURIComponent(encode);
    var queryURL = cors + encodeCors;

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response)  {
        var places = JSON.parse(response.body);
        var placesResults = places.results;
        console.log(placesResults);
        for(i = 0; i < 10; i++)  {
            var icon = placesResults[i].icon;
            var name = placesResults[i].name;
            var rating = placesResults[i].rating;
            var address = placesResults[i].vicinity;
            console.log(map);
            
            


            $("tbody").append(
                "<tr><td><img src='" + icon + "'></td><td>"+ name + "</td><td>" + rating + "</td><td>" + address + "</td><td>" + map +  "</td></tr>");

            // var placesDiv = $("<div>");
            // placesDiv.addClass("places-div col-xs-5");
        
            // var iconDiv = $("<img>").attr("src", icon);
            // iconDiv.addClass("img-responsive");
            // var nameDiv = $("<p>").text(name);
            // var ratingDiv = $("<p>").text(rating);

            // placesDiv.append(iconDiv)
            // placesDiv.append(nameDiv);
            // placesDiv.append(ratingDiv);
            // $("#places-area").append(placesDiv);
        }
    })

})





  