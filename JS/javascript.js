//Service Fee: $85 if the customer’s phone is "not warranty", else $0.00

$('#warranty').change(function(){
	if (this.checked) {
		$('#serviceFee').val('0.00');
	} else {
		$('#serviceFee').val('85.00');
	}
});

//------------------------------------------------------------------------------------------------------
//Bond: the cost for a courtesy phone (and charger) only if the customer is a “consumer” type.
//      If customer is "business", no bond is required.

//------------------------------------------------------------------------------------------------------
//Assume there is a list of courtesy items as below:
let courtesyList = [{item: 'iPhone', bond: 275},
					{item: 'otherPhone', bond: 100},
					{item: 'charger', bond: 30}
				   ];
				   
//We will use "appState" object to track the form change when users interact with the app			   
let appState = {customerType: 'customer',
				courtesyPhone: {item: 'none', bond: 0 },//Allow to borrow ONLY 1 phone
				courtesyCharger: {item: 'none', bond: 0}//Allow to borrow ONLY 1 charger
			  };	

//------------------------------------------------------------------------------------------------------
			  
//Click 'Add' button event
$('#addBtn').click(function(e){
	//Prevent all the default function of the 'add' button
	e.preventDefault();
	
	//Get the selected item
	let selectedItemText = $('#itemList').find(':selected').text();
	let selectedItemValue = $('#itemList').find(':selected').val(); 
	let selectedItemBond = courtesyList.find(foundItem => foundItem.item.toLowerCase() == selectedItemValue.toLowerCase()).bond;
	
	//Build HTML code of this item 
	let newRow = `
		<tr class="newSelectedItem">
			<td>${selectedItemText}</td>
			<td>${selectedItemBond}</td>
		<tr>
	`;
	
	//Add this new item to the table if it's not existing yet
	if (appState.courtesyPhone.item == 'none' && selectedItemValue.toLowerCase().includes('phone')) {
		$('#borrowItems').append(newRow);
		//Update the appState
		appState.courtesyPhone.item = selectedItemValue;
		appState.courtesyPhone.bond = selectedItemBond;
		//Update the "bond" element
		if($('#customerType').is(':checked')) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} else {
			$('#bond').val(0);
		}
	} else if (appState.courtesyCharger.item == 'none' && selectedItemValue.toLowerCase().includes('charger')) {
		$('#borrowItems').append(newRow);
		//Update the appState
		appState.courtesyCharger.item = selectedItemValue;
		appState.courtesyCharger.bond = selectedItemBond;
		//Update the "bond" element
		if($('#customerType').is(':checked')) {
			$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
		} else {
			$('#bond').val(0);
		}
	} else {
		alert('The item was already added');
	}
	
});

//Click 'Remove' button event
$('#removeBtn').click(function(e){
	//Prevent all default actions attached to this button
	e.preventDefault();
	
	//Remove all added rows that have same class name as "newSelectedItem"
	$('.newSelectedItem').remove();
	
	//Update the appState
	appState.courtesyPhone = {item: 'none', bond: 0};
	appState.courtesyCharger = {item: 'none', bond: 0};
	
	//Update bond
	$('#bond').val(0);
});

//Change 'Customer Type' event
$('#customerType').click(function(){
	appState.customerType = 'customer';
	$('#bond').val(appState.courtesyPhone.bond + appState.courtesyCharger.bond);
});

$('#businessType').click(function(){
	appState.customerType = 'business';
	$('#bond').val(0);
});

//------------------------------------------------------------------------------------------------------

//Get coordinates - demo 1

var x = document.getElementById("demo");

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	} else {
		x.innerHTML = "Geolocation is not supported by this browser.";
	}
}

function showPosition(position) {
	x.innerHTML = "Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude;
}

//------------------------------------------------------------------------------------------------------

//Drag and drop - demo 2
	
//Use JQuery to manipulate CSS style
$('h2').css({
  'background-color': 'gray',
  'text-align': 'center',
  'border': 'solid 2px green',
  'padding': '20px',
  'color': 'red'
});

//Use JQuery to handle event: hover 
$('h2').hover(function(){
  $(this).css('background-color', 'green');
} , function(){
  $(this).css('background-color', 'gray');
});	

//-------------------------------------		
$(".box" ).draggable({
  scope: 'demoBox',
  revertDuration: 100,
  start: function( event, ui ) {
    //Reset
    $( ".box" ).draggable( "option", "revert", true );
    $('.result').html('-');
  }
});

$(".drag-area" ).droppable({
   scope: 'demoBox',
   drop: function( event, ui ) {
     let area = $(this).find(".drop-area").html();
     let box = $(ui.draggable).html();     
     $( ".box" ).draggable( "option", "revert", false );
     
     //Display action in text
     $('.result').html("[Action] <b>" + box + "</b>" +
                       " dropped on " + 
                       "<b>" + area + "</b>");
     
     //Re-align item
     $(ui.draggable).detach().css({top: 0,left: 0}).appendTo(this);
   }
});

//------------------------------------------------------------------------------------------------------

//FAQ page

let proxy = 'https://cors-anywhere.herokuapp.com/' ;
let json_url = "http://danieldangs.com/itwd6408/json/faqs.json";

//Use Jquery method to load Json file
$.getJSON(
	proxy + json_url, 
	function(data) {//Get json file and assign it to "data"		
		//Loop through all the questions and extract its question & answer
		console.log(data);
		$.each(data, function(i, question) {//i: index, question: object
			//Extract question and answer display on webpage
			let node =  '<div class="col-12 col-md-6 p-2">' + 
							'<div class="bg-warning h-100 p-2">' +
								'<h4>' + question.question + '</h4>' + 
								'<p>' + question.answer + '</p>' +
							'<div>' +
						'</div>';
			$('#questions').append(node)			
		});										
	}
);

//Filter or search function
$("#search-box").on("keyup", function() {
	//Get entered keywords
	let keywords = $(this).val().toLowerCase();
	//Loop through all questions (wrapped in <div> element inside "questions" section), find all question/answer containing keywords
	$("#questions div").filter(function() {
	  //Keep displaying all element containing the keyword
	  $(this).toggle($(this).html().toLowerCase().indexOf(keywords) > -1); //indexOf(keywords) returns "-1" if not containing the keyword
	});
});

//------------------------------------------------------------------------------------------------------

//Interactive map - demo 5

$('svg path').each(function(index, item) {
	var id = $(item).attr('id');
	
	$('svg #' + id).on('click', function(e) {
		var id = $(e.currentTarget).attr('id');
		$('svg path').removeClass('active');
		$(e.currentTarget).addClass('active');
		window.alert(id + ' Clicked');
	});
});

//------------------------------------------------------------------------------------------------------

//File upload - demo 4

const image_input = document.querySelector("#image-input");

image_input.addEventListener("change", function() {
	const reader = new FileReader();
	reader.addEventListener("load", () => {
		const uploaded_image = reader.result;
		document.querySelector("#display-image").style.backgroundImage = `url(${uploaded_image})`;
	});
	reader.readAsDataURL(this.files[0]);
});