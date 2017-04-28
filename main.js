$(document).ready(function() {



  var dataArr = [];

  // Pulling earthquake data from beg. of year to 4/28/17 with a certain magnitude
  var $xhr =
  $.getJSON('https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2017-01-01&endtime=2017-04-28&minmagnitude=6.5');

   $xhr.done(function(data) {
     console.log(data);
     for (var i = 0; i < data.features.length; i++) {
       var obj = {};
       obj.magnitude = data.features[i].properties.mag;
       obj.location = data.features[i].properties.place;
       obj.time = (new Date(data.features[i].properties.time));
       obj.latitude = data.features[i].geometry.coordinates[1];
       obj.longitude = data.features[i].geometry.coordinates[0];
       dataArr.push(obj);
     }
       for (var x = 0; x < dataArr.length; x++) {
         var latLng = new google.maps.LatLng(dataArr[x].latitude, dataArr[x].longitude);
         console.log(latLng);
         var marker = new google.maps.Marker({
           position: latLng,
           map: map
         });
       }
       console.log(dataArr);
     });
   $xhr.fail(function(err) {
     console.log(err);
   });

 });
