var queryURL 
var city
var pastSearches
var pastSearchesLocal

$(document).ready(function(){
    loadPastSearches()

    $("#searchButton").click(function(){
        city = $("#citySearch").val()
        loadWeatherForecast()
    })
    
    $(".past-searches").click(function(){
        city = $(this).text()
        loadWeatherForecast()
    })
})

function loadPastSearches(){
    $("#searchDiv").empty()
    pastSearches = JSON.parse(localStorage.getItem("pastSearches"))
    for (x = 0; x <= pastSearches.length - 1; x++){    
        $("<div>").addClass("container p-3 bg-white border-bottom past-searches").text(pastSearches[x]).appendTo("#searchDiv")
    }
}

function loadWeatherForecast(){
    $("#weatherBox").empty()
    //Add to past searches
    if (pastSearches == null){
        pastSearches = [city]
    }
    else{
        pastSearches.unshift(city) 
        if (pastSearches.length > 5){ 
            pastSearches.pop()
        }
    }
    localStorage.setItem("pastSearches",JSON.stringify(pastSearches))

    loadPastSearches()
    
    queryURL = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&APPID=6a169eec8db9f60b4208735020ec9a6f`

    $.get("https://repos.codehot.tech/cors_proxy.php?" + escape(queryURL)).then(function(response){
        results = response

        today = new Date()
        date = " (" + today.getFullYear()+"/"+(today.getMonth()+1)+"/"+(today.getDay()+x) + ")"

        //Current Weather
        $("<div>").attr({
            class: "container my-6 border",
            id: "currentWeatherBox",
        }).appendTo("#weatherBox")
        $("<h4>").addClass("text-left").text(city + date).appendTo("#currentWeatherBox")
        weather = results.list[x].weather[0].main
        src = `./pictures/${weather}.png`
        $("<img>").attr({
            src: src,
            height: "30px",
            width: "30px"
        }).appendTo("#currentWeatherBox")
        $("<p>").addClass("text-left").text("Temperature: " + results.list[0].main.temp).appendTo("#currentWeatherBox")
        $("<p>").addClass("text-left").text("Humidity: " + results.list[0].main.humidity).appendTo("#currentWeatherBox")
        $("<p>").addClass("text-left").text("Wind Speed: " + results.list[0].wind.speed).appendTo("#currentWeatherBox")

        //5 Day Forecast
        $("<h4>").addClass("text-left").text("5 Day Forecast:").appendTo("#weatherBox")
        $("<div>").attr({
            class: "card-deck",
            id: "forecastDeck"
        }).appendTo($("#weatherBox"))

        for (x = 1; x <= 4; x++){
            $("<div>").attr({
                class: "card bg-primary text-white text-center p-3",
                id: "card"+x
            }).appendTo("#forecastDeck")
            $("<h5>").addClass("text-left").text(date).appendTo("#card"+x)
            weather = results.list[x].weather[0].main
            src = `./pictures/${weather}.png`
            $("<img>").attr({
                src: src,
                height: "30px",
                width: "30px"
            }).appendTo("#card"+x)
            $("<p>").addClass("text-left").text("Temp: " + Math.round(results.list[x].main.temp) + " °C").appendTo("#card"+x)
            $("<p>").addClass("text-left").text("Humidity: " + results.list[x].main.humidity).appendTo("#card"+x)
        }

    })
}