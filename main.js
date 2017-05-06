$(document).ready(function() {

  // var dataArr = [];

  // Pulling earthquake data from beg. of year to 4/28/17 with a certain magnitude
  // var $xhr =
  // $.getJSON('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2017-01-01&endtime=2017-04-28&minmagnitude=6.5');

var $body = $('Body');

  function getData(event) {
  event.preventDefault();
  console.log('PASS');
  var $startDate = $('#startDate').val();
  var $endDate = $('#endDate').val();
  var $magnitude = $('#magnitude').val();
  var string = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime='+ $startDate + '&endtime=' + $endDate + '&minmagnitude=' + $magnitude;

  var $xhr = $.getJSON(string);


   $xhr.done(function(data) {
     $.each(data.features, function(){
         var contentString = '';
         var $element = $('<div>');
         var $time = new Date(this.properties.time);
         console.log($time);
         var $mag = this.properties.mag;
         console.log($mag);
         var $place = this.properties.place;
         console.log($place);
         contentString = '<strong>LOCATION:</strong> ' + this.properties.place.toString() + '<br>'  + ' <strong>MAGNITUDE:</strong> ' + this.properties.mag.toString() + '<br>' + ' <strong>TIME:</strong> ' + new Date(this.properties.time);
         var $lat = this.geometry.coordinates[1];
         var $long = this.geometry.coordinates[0];
         var $placetag = $('<p>');
         $placetag.append($('<span>').html('Location: '));
         $placetag.append($('<span>').html($place));
         $element.append($placetag);
         var $timetag = $('<p>');
         $timetag.append($('<span>').html('Time: '));
         $timetag.append($('<span>').html($time));
         $element.append($timetag);
         var $magtag = $('<p>');
         $magtag.append($('<span>').html('Magnitude: '));
         $magtag.append($('<span>').html($mag));
         $element.append($magtag);
         var $coords = $('<p>');
         $coords.append($('<span>').html('Lattitude: '));
         $coords.append($('<span>').html($lat));
         $coords.append($('<span>').html('Longitude: '));
         $coords.append($('<span>').html($long));
         $element.append($coords);
         $body.append($element);


         var latLng = new google.maps.LatLng($lat,$long);
         var infowindow = new google.maps.InfoWindow({
         content: contentString,
         maxWidth: 200
         });
         var marker = new google.maps.Marker({
           position: latLng,
           map: map,
           animation: google.maps.Animation.DROP
         });
         marker.addListener('click', function() {
         infowindow.open(map, marker);
         });
         console.log(map.data);
       });
     });
   $xhr.fail(function(err) {
     console.log(err);
   });

 }
 $('#userInput').on('submit', getData);
});
