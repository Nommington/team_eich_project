var geoUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=";
var geoKey = "&key=AIzaSyD-9rm4gqljdlkdqlJyeFe2YHKfEIS3g6o"

var darkUrl = "https://api.darksky.net/forecast/55c20b7e129d72010d38eb997b53d47e/"
var darkKey = "55c20b7e129d72010d38eb997b53d47e"

var movieUrl = "https://api.internationalshowtimes.com/v4/cinemas/?apikey=Xr2MeuJCI7mhVLZPpbutMNo68SKQNBGt/"
var movieLocation = "&near_to="
var movieDistance = "&distance="

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



// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=
// https://api.darksky.net/forecast/55c20b7e129d72010d38eb997b53d47e/35.1001511,-80.8051842


    var convertLocation = function()  {

        var addressInput = $("#search-term").val();
        for(i = 0; i < addressInput.length; i++)  {
            addressInput = addressInput.replace(" ", "+");
        }
    
        var queryURL = geoUrl + addressInput + geoKey;
        console.log(queryURL);
        $.ajax({
            url: queryURL,
            method: "GET"
        }) .then(function(response)  {
            
            
    
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
    
    $("#run-search").on('click', function(event){
        event.preventDefault();
        convertLocation();
        $("#search-term").val("");
       
        
    })
    
    database.ref().on("child_added", function(snapshot)  {
    
        //Getting the values of the firebase objects
        var lattitude = snapshot.val().lat;
        var longitude = snapshot.val().lon;
        var location = snapshot.val().location;
        console.log("Lattitude: " + lattitude);
        console.log("Longitude :" + longitude);
    
    
        var queryURL = darkUrl + lattitude + "," + longitude
        $.ajax({
            url: queryURL,
            method: "GET"
        })  .then(function(response)  {

            var temp = response.currently.temperature;
            console.log("Temperature: " + temp);
        
            var summary = response.currently.summary;
            console.log("Condtions: " + summary)
            
            //Creating a button to hold the city weather info
            var bugDiv = $("<button>")
            bugDiv.addClass("bug-div")
            bugDiv.val(lattitude + "," + longitude);

            //Add the location, temp, and conditions to button
            //toDo: replace summary div with an icon based on value of summary
            var locationDiv = $("<p>").text(location);
            var tempDiv = $("<p>").text(temp);
            var sumDiv = $("<p>").text(summary);
    
            //Append all divs to the button then add button to container
            bugDiv.append(locationDiv);
            bugDiv.append(tempDiv);
            bugDiv.append(sumDiv);
            $("#bug-area").append(bugDiv);
        })
    })

    $("#bug-area").on('click', "button", function()  {
        var location = $(this).val();
        var queryURL = movieUrl + movieLocation + location
        console.log(queryURL);
    })





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




