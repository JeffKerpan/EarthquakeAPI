$(document).ready(function() {
  var $body = $('Body');

    function getData(event) {
      event.preventDefault();

      var $startDate = $('#startDate').val();
      var $endDate = $('#endDate').val();
      var $magnitude = $('#magnitude').val();

      var string = 'http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson' + '&starttime=' + $startDate + '&endtime=' + $endDate + '&minmagnitude=' + $magnitude;

      var $xrh = $.getJSON(string);

      $xhr.done(function(data) {
        $.each(data.features, function() {
          var $element = $('<div>');
          $body.append($element);

          var $lat = this.geometry.coordinates[1];
          var $long = this.geometry.coordinates[0];
          var latLng = new google.maps.LatLng($lat, $long);

          var infowindow = new google.maps.InfoWindow({
            context: info_window_content(this.properties),
            madWidth: 200
          });

          map.data.setStyle(function(feature) {
            var magnitude = feature.getProperty('mag');
            return {
              icon: getCircle(magnitude)
            };
          });
          console.log(map.data);

          var circ = new google.maps.Circle({
            center:latLng,
            clickable:true,
            fillColor:'red',
            fillOpacity:0.3,
            map:map,
            radius:1000,
           //  scale: 100,
            strokeColor:'red',
            strokeOpacity:0.3
          });

          // var marker = new google.maps.Marker({
          //   position: latLng,
          //   map: map,
          //   animation: google.maps.Animation.DROP
          // });
          // marker.addListener('click', function() {
          //   infowindow.open(map, marker);
            console.log(circ);
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

function info_window_content(props) {
  return '<strong>LOCATION:</strong> ' +
  props.place.toString() + '<br>' +
  ' <strong>MAGNITUDE:</strong> ' +
  props.mag.toString() + '<br>' +
  ' <strong>TIME:</strong> ' +
  new Date(props.time);
}
