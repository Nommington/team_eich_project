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
var cors = "http://cors-proxy.htmldriven.com/?url="

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
        bugDiv.addClass("bug-div col-xs-2 col-sm-2")
        

        //Add the location, temp, and conditions to button
        //toDo: replace summary div with an icon based on value of summary
        var locationDiv = $("<p class='location'>").text(location);
        var sumDiv = $("<img class='img-responsive'>")
        sumDiv.attr("id", conditions);
        var tempDiv = $("<p class='temp'>").text(temp);

        //Append all divs to the button then add button to container
        bugDiv.append(locationDiv);
        bugDiv.append(sumDiv);
        bugDiv.append(tempDiv);



        var placesButton = $("<img class='img-responsive'>")
        placesButton.addClass("places-button")
        placesButton.val(latitude + "," + longitude);
        placesButton.attr('src', "assets/images/places.png");
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
            var iconTD = $("<td>")
            var iconImage = $("<img>").attr('src', icon);
            iconTD.append(iconImage);
            var lat = placesResults[i].geometry.location.lat;
            var lng = placesResults[i].geometry.location.lng;
            var location = lat + "," + lng;
            var name = placesResults[i].name;
            var nameDiv = $("<td>").text(name);
            var rating = placesResults[i].rating;
            var address = placesResults[i].vicinity;
            var mapsIcon = "assets/images/google-maps.png";
            var iconDiv = $("<td>");
            var iconMap = $("<img>");
            var placeId = placesResults[i].place_id;
            console.log(placeId);
            iconMap.attr("data-name", placeId)
            iconMap.attr("id", "map-search");
        
            iconMap.attr("src", mapsIcon);
            iconDiv.append(iconMap);
        
            var tableRow = $("<tr>");
            tableRow.append(iconTD);
            tableRow.append(nameDiv);
            tableRow.append(iconDiv);
            $("tbody").append(tableRow);
    
        }
    })

})

$(document).on('click', "#map-search", function() {
    $("#map-div").empty();
    var placeID = $(this).attr("data-name");
    console.log(placeID);

    var iframe = $('<iframe frameborder=0 style="border:0" src=https://www.google.com/maps/embed/v1/place?key=AIzaSyB8GERsvE3gXS0XvGeTLpol5NpS9kZgEIc&q=place_id:' + placeID + '></iframe>');
    $("#map-div").append(iframe);
    });

