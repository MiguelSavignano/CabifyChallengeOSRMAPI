var console;
var journeys = [
   {
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
   },
   {
       "id": "2",
       "region": "ES",
       "user_id": "1",
       "start_loc": [
           40.42781612,
           -3.69053515
       ],
       "end_loc": [
           40.45273632,
           -3.70322515
       ],
       "created_at": "2015-04-30T23:55:23Z"
   },
   {
       "id": "3",
       "region": "ES",
       "user_id": "14",
       "start_loc": [
           40.4542094,
           -3.6812724999999773
       ],
       "end_loc": [
           40.4921,
           -3.5935399999999618
       ],
       "created_at": "2015-05-02T06:55:23Z"
   },
   {
       "id": "4",
       "region": "ES",
       "user_id": "1",
       "start_loc": [
           40.408851,
           -3.692484000000036
       ],
       "end_loc": [
           40.50638500000001,
           -3.6719112000000678
       ],
       "time": "2015-05-02T13:55:23Z"
   },
   {
       "id": "5",
       "region": "ES",
       "user_id": "14",
       "start_loc": [
           40.46645561017568,
           -3.689838834106922
       ],
       "end_loc": [
           40.411141,
           -3.69356
       ],
       "created_at": "2015-05-05T05:50:00Z"
   },
   {
       "id": "6",
       "region": "MX",
       "user_id": "14",
       "start_loc": [
           19.40531158447266,
           -99.17715454101562
       ],
       "end_loc": [
           19.49521636962891,
           -99.119587
       ],
       "created_at": "2015-05-05T16:30:11Z"
   },
   {
       "id": "7",
       "region": "MX",
       "user_id": "14",
       "start_loc": [
           19.44203186035156,
           -99.20143034309149
       ],
       "end_loc": [
           19.43360137939453,
           -99.0709228515625
       ],
       "created_at": "2015-05-05T18:45:00Z"
   },
   {
       "id": "8",
       "region": "MX",
       "user_id": "14",
       "start_loc": [
           19.39804091534896,
           -99.1644262522459
       ],
       "end_loc": [
           19.42952488,
           -99.17952076
       ],
       "created_at": "2015-05-05T20:53:19Z"
   },
   {
       "id": "9",
       "region": "PE",
       "user_id": "16",
       "start_loc": [
           -12.024053,
           -77.11203599999999
       ],
       "end_loc": [
           -12.0970329,
           -77.03390790000003
       ],
       "created_at": "2015-05-06T16:05:20Z"
   },
   {
       "id": "10",
       "region": "ES",
       "user_id": "121",
       "start_loc": [
           40.43969425642679,
           -3.8107149297015472
       ],
       "end_loc": [
           40.4907123187136,
           -3.593661562633359
       ],
       "created_at": "2015-05-10T10:00:00Z"
   },
   {
       "id": "11",
       "region": "ES",
       "user_id": "23",
       "start_loc": [
           40.43862915039062,
           -3.717599868774414
       ],
       "end_loc": [
           40.43637084960938,
           -3.685964584350586
       ],
       "created_at": "2015-05-15T18:15:19Z"
   }
]

journeys.sort(function(a, b) {
    return (a.user_id) - (b.user_id);
});

var joureys_free = [];
var count_free = 0;
for (var i = 0; i < journeys.length-1; i++) {

	if (journeys[i].user_id == journeys[i+1].user_id ){
		console.log("free: "+count_free +" user_id: "+journeys[i].user_id +" i:"+ i);
		count_free++;
	}
	if (count_free == 3 ){
		console.log("free: "+count_free +" user_id: "+journeys[i].user_id +" i:"+ i);
		joureys_free.push(journeys[i].id);
		count_free = 0;
	}
		console.log("free: "+count_free +" user_id: "+journeys[i].user_id +" i:"+ i);

};

journeys.map(function(travel_data){
	if (joureys_free.indexOf(travel_data.id) != -1){
		GetDataTravel(travel_data, true);	
	}
	else
	GetDataTravel(travel_data);
});

function GetDataTravel(travel_data,free){
	$.getJSON("http://router.project-osrm.org/viaroute?"+
			  "loc="+travel_data.start_loc+
			  "&loc="+travel_data.end_loc+
			  "&geometry=false",
		function (data) {
			console = data;
			var route_sumary = data.route_summary;
			var jurney_price = (!free) ? JourneyPrice(travel_data,route_sumary.total_distance/1000) : "Free";
			var jurney_discount = (!free) ? DiscountMore10Km(travel_data,route_sumary.total_distance/1000) : "Free";
			var total_price = (!free) ? (jurney_price - jurney_discount) : "Free";
			$("tbody").append('<tr>')
			.append('<td>'+route_sumary.total_distance / 1000+'</td>')
			.append('<td>'+route_sumary.total_time+'</td>')
			.append('<td>'+Currency(travel_data.region)+'</td>')
			.append('<td>'+jurney_price+'</td>')
			.append('<td>'+jurney_discount+'</td>')
			.append('<td>'+total_price+'</td>')
	});
};

function DiscountMore10Km(travel_data,total_distance_km){
	var discount = 0.15;
	if (total_distance_km > 10){
		var distance_discount = total_distance_km - 10;
		return (distance_discount * PricePerKm(travel_data.region)) * (discount); 
	}
	else
		return 0;
}

function JourneyPrice(travel_data,total_distance_km){
	return (total_distance_km ) * PricePerKm(travel_data.region);
};

function PricePerKm(county){
	switch (county) {
		  case "ES":
		  		return 1.5;
		    break;
		  case "MX":
		  		return 14;
		    break;
		  case "PE":
		  		return 2.5;
		    break;
	}
}

function Currency(county){
	switch (county) {
	  case "ES":
	  		return "EUR";
	    break;
	  case "MX":
	  		return "MXN";
	    break;
	  case "PE":
	  		return "PEN";
	    break;
	  default:
	  		return "USD";
	   break;
	}
};
