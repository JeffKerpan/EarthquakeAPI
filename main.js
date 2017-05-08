$(document).ready(function() {
  var map;
  (function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 2,
      center: new google.maps.LatLng(2.8,-187.3),
      mapTypeId: 'terrain'
    });
  })();

var $body = $('Body');

  function getData(event) {
  event.preventDefault();
  var $startDate = $('#startDate').val();
  var $endDate = $('#endDate').val();
  var $magnitude = $('#magnitude').val();

  var string = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson' + '&starttime=' + $startDate + '&endtime=' + $endDate + '&minmagnitude=' + $magnitude;

  var $xhr = $.getJSON(string);

   $xhr.done(function(data) {
     $.each(data.features, function(){
        var $element = $('<div>');
        $body.append($element);

        var $lat = this.geometry.coordinates[1];
        var $long = this.geometry.coordinates[0];
        var latLng = new google.maps.LatLng($lat,$long);

        var infowindow = new google.maps.InfoWindow({
          content: info_window_content(this.properties),
          maxWidth: 160
        });

       console.log(map.data);

         var marker = new google.maps.Marker({
           position: latLng,
           map: map,
           animation: google.maps.Animation.DROP
         });

         marker.addListener('click', function() {
         infowindow.open(map, marker);
         });
     });
  });
   $xhr.fail(function(err) {
     console.log(err);
   });
 }

 $('#userInput').on('submit', getData);

});

function info_window_content(earthquakeData) {
  return '<strong>LOCATION:</strong> ' +
  earthquakeData.place.toString() + '<br>' +
  ' <strong>MAGNITUDE:</strong> ' +
  earthquakeData.mag.toString() + '<br>' +
  ' <strong>TIME:</strong> ' +
  new Date(earthquakeData.time);
}
