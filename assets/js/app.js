var mapsUrl = "https://maps.googleapis.com/maps/api/";
var geoCode = "geocode/json?address=";
var nearBy = "place/nearbysearch/json?"
var locate = "&location=";
var typeSearch = "&radius=1500&type=restaurant";
var mapsKey = "&key=AIzaSyD-9rm4gqljdlkdqlJyeFe2YHKfEIS3g6o";
var placesKey = "&key=AIzaSyCyIytMxm9UxMaTB7NcJk_NNYm9r4PFVMo";

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
        bugDiv.val(lattitude + "," + longitude);

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

        $("#bug-area").append(bugDiv);
    })
})



// $("#bug-area").on('click', "div", function() {
//     var yelpURL = "https://api.yelp.com/v3/businesses/search?latitude=-37.8136276&longitude=144.9630576"

//     $.ajax({
//         url: yelpURL,
//         method: "GET",
//         authorization: yelpKey
//     })
// }).then(function(response){
//     console.log(response);
// })

    // var service = new google.maps.places.PlacesService();
    // // $("#bug-area").addClass("hidden");
    // // $("#cinema-area").removeClass("hidden");
    // var location = $(this).val();
    // var placesURL = mapsUrl + nearBy + mapsKey + locate + location + typeSearch 
    
    // console.log(placesURL);
    // // $.ajax({
    // //     url: placesURL,
    // //     method: "GET",
    // //     // headers: {origin: "https://www.google.com"}
    // //     // dataType: 'jsonp'
    // // }).then(function(response)  {
    // //     console.log("Hello");


    // // })
// })

// $("#cinema-area").on('click', ".cinema-div", function(){
//     var cinemaId = $(this).val();
//     var queryURL = showUrl + movieId + "&" + cinemaId + movieKey

//     console.log(queryURL);
// })




// $("#location-search").on('click', function()  {
//     var longitude = $("#long-term").val().trim();
//     var lattitude = $("#latt-term").val().trim();
//     console.log(lattitude + longitude);

// var queryURL = darkUrl + lattitude + "," + longitude
// $.ajax({
//     url: queryURL,
//     method: "GET"
// })  .then(function(response)  {

//     console.log(response)

//     var temp = response.currently.temperature;
//     var summary = response.currently.icon;

// if(summary = "Rainy")  {
//     alert("Clear");
// }


//         $("#summary").text(summary);
//         $("#temperature").text(temp);


//     })
// })

// $("#add-date").on('click', function()  {
//     var date = $("#date-term").val().trim();

//     moment().format(date, "L");
//     console.log("This is the date: " + date)
// })