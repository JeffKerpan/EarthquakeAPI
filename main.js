//Shaking a picture for a set amount of time when the page loads and then hiding that picture and showing the main content of the page.
var $shakeSlow = $('.shake-hard');
var $mainContent = $('#mainContent');
var timeout = setTimeout(function() {
  $shakeSlow.addClass('hideEarthquake');
  $mainContent.removeClass('hideThings');
}, 1000);

$(document).ready(function() {
  // $("#datepicker").datepicker();
  $(".button-collapse").sideNav();

//Initialize the Google Map inside of an IIFE so that it loads before everything else
  var map;
  (function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 2,
      center: new google.maps.LatLng(20,175),
      // center: new google.maps.LatLng(2.8,-187.3),
      mapTypeId: 'terrain',
      zoomControl: true,
      mapTypeControl: true,
      scaleControl: true,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: true,

      // zoomControlOptions: {
      //   position: google.maps.ControlPosition.RIGHT_CENTER
      // },
    });
    //Resize Google Maps mostly correct when browser window is shrunk down.  Was having issues with the Zoom buttons disapearing when the browser was small, mobile sized.
    google.maps.event.addDomListener(window, "resize", function() {
      console.log('resize');
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });
  })();

//Appened things to the body quickly
var $body = $('body');

  //When the form/s are submitted this is the data.  The JSON call is dependant on all 3 of these forms being filled in and button clicked.
  function getData(event) {
  event.preventDefault();
  var $startDate = $('#startDate').val();
  var $endDate = $('#endDate').val();
  var $magnitude = $('#magnitude').val();

  //Once getData function runs it then plugs the variables into the string.
  var string = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson' + '&starttime=' + $startDate + '&endtime=' + $endDate + '&minmagnitude=' + $magnitude;

  //This is the actual AJAX request to get the data from USGS API.  Passing in the string variable as the argument so that each time the form data changes it'll pull different data from USGS.
  var $xhr = $.getJSON(string);

  //Once the AJAX request is done, it creates an element div and appends it to the body.
   $xhr.done(function(data) {
     $.each(data.features, function(){
        var $element = $('<div>');
        $body.append($element);

        //Pulling the new Latitudes and Longitudes for each Earthquake
        console.log(this.properties);
        var $lat = this.geometry.coordinates[1];
        var $long = this.geometry.coordinates[0];
        var latLng = new google.maps.LatLng($lat,$long);

        //Populate Info Windows
        var infowindow = new google.maps.InfoWindow({
          content: info_window_content(this.properties),
          maxWidth: 160,
          position: latLng

        });

        // map.data.loadGeoJson(data);

        //Setting the style of the Markers to Circles
        map.data.setStyle(function(feature) {
          var magnitude = feature.getProperty('$magnitude');
          return {
            icon: getCircle(magnitude)
          };
        });

       console.log(map.data);

       //Function to populate the circles onto the Google Map
      //  function getCircle(magnitude) {
      //   return {
      //     path: google.maps.SymbolPath.CIRCLE,
      //     fillColor: 'red',
      //     fillOpacity: 0.2,
      //     scale: Math.pow(2, magnitude),
      //     strokeColor: 'white',
      //     strokeWeight: 0.5
      //   };
      // }

        //Populates the Circles on the Google Map in the correct position but the scale based on magnitude doesn't work and the Circles are on the map but VERY small
        // let adjMag = (this.properties.mag * 1000000)/10;
        let mag = Math.pow(2, this.properties.mag)*10000;
        console.log(mag);
        let circ = new google.maps.Circle({
         center:latLng,
         clickable:true,
         fillColor:'red',
         fillOpacity:0.3,
         map:map,
         radius:mag,
        //  scale: mag,
         strokeColor:'white',
        //  strokeOpacity:0.3,
         strokeWeight: 0.7
       });

       console.log(circ);

      //Adding an event listener when a User clicks on a Circle
       circ.addListener('click', function() {
       infowindow.open(map, circ);
       });
      //  circ.addListener('focus', function() {
      //    infowindow.close(map, circ);
      //  });

        //Previous was to get a Marker on the Google Map, is working!!!
        //  var marker = new google.maps.Marker({
        //    position: latLng,
        //    map: map,
        //    animation: google.maps.Animation.DROP
        //  });

        //Adding an event listener when a User clicks on a Marker to pop open an Info Window with information about that particular earthquake.
        //  marker.addListener('click', function() {
        //  infowindow.open(map, circ);
        //  });
     });
  });
   $xhr.fail(function(err) {
     console.log(err);
   });
 }
 //Triggers the information submission.
 $('#userInput').on('submit', getData);

});

//Function to input earthquake info into the Info Windows
function info_window_content(earthquakeData) {
  return '<strong>LOCATION:</strong> ' +
  earthquakeData.place.toString() + '<br>' +
  ' <strong>MAGNITUDE:</strong> ' +
  earthquakeData.mag.toString() + '<br>' +
  ' <strong>TIME:</strong> ' +
  new Date(earthquakeData.time);
}
