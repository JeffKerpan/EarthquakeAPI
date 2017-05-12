var $shakeHard = $('.shake-hard');
var $mainContent = $('#mainContent');
var timeout = setTimeout(function() {
  $shakeHard.addClass('hideEarthquake');
  $mainContent.removeClass('hideThings');
}, 3000);

$(document).ready(function() {
  $('.button-collapse').sideNav();

var map;
(function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 2,
    center: new google.maps.LatLng(-20, 175),
    mapTypeId: 'terrain',
    zoomControl: true,
    mapTypeControl: true,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
  });

  google.maps.event.addDomListener(window, 'resize',
  function() {
    var center = map.getCenter();
    google.maps.event.trigger(map, 'resize');
    map.setCenter(center);
  });
})();

var $body = $('body');

function getData(event) {
  event.preventDefault();

  var $startDate = $('#startDate').val();
  var $endDate = $('#endDate').val();
  var $magnitude = $('#magnitude').val();

  var string = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson' + '$starttime=' + $stateDate + '&endtime=' + $endDate + '&minmagnitude=' + $magnitude;

  var $xhr = $.getJSON(string);

  $xhr.done(function(data) {
    $.each(data.features, function() {
      var $element = $('<div>');
      $body.append($element);

      var $lat = this.geometry.coordinates[1];
      var $long = this.geometry.coordinates[0];
      var latLng = new google.maps.LatLng($lat, $long);

      var infowindow = new google.maps.InfoWindow( {
        content: info_window_content(this.properties),
        maxWidth: 160,
        postion: latLng
      });

      map.data.setStyle(function(feature) {
        var magnitude = feature.getProperty('$magnitude');
        return {
          icon: getCircle(magnitude)
        };
      });

      var mag = Math.pow(2, this.properties.mag)*10000;
      var circ = new google.maps.Circle( {
        center: latLng,
        clickable: true,
        fillColor: 'red',
        fillOpacity: 0.3,
        map: map,
        radius: mag,
        strokeColor: 'white',
        strokeWeight: 0.7
      });

      circ.addListener('click', function() {
        infowindow.open(map, circ);
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
  ' <strong>MAGNITUDE:</strong>' +
  earthquakeData.mag.toString() + '<br>' +
  ' <strong>DATE:TIME:</strong> ' +
  new Date(earthquakeData.time);
}
