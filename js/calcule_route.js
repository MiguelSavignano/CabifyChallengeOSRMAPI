var console;
var travel_data = {
       "id": "1",
       "region": "ES",
       "user_id": "1",
       "start_loc": [
           40.4680577,
           -3.68662464
       ],
       "end_loc": [
           40.4693121,
           -3.57150993
       ],
       "created_at": "2015-04-28T23:55:23Z"
   };

function GetDataTravel(travel_data){
	$.getJSON("http://router.project-osrm.org/viaroute?"+
			  "loc="+travel_data.start_loc+
			  "&loc="+travel_data.end_loc+
			  "geometry=false",
		function (data) {
			console = data;
			var route_sumary = data.route_summary
			$("tbody").append('<tr>')
			.append('<td>'+route_sumary.total_distance+'</td>')
			.append('<td>'+route_sumary.total_time+'</td>')
	});
}
