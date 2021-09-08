let purchases = [];
let categories = [];
const curMonth = new Date();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let currentPurchases = [];
function setup() {
	populatePage();

	document.getElementById("addCat_submit").addEventListener("click", postCat, true);
	document.getElementById("addPur_submit").addEventListener("click", postPur, true);
	document.getElementById("currentMonth").innerHTML = months[curMonth.getMonth()];


}


function getHandlerCat(xhr) {
	let x;
	if (xhr.readyState === XMLHttpRequest.DONE) {
		console.log("GET Categories Response:");
		console.log(xhr.responseText);

		if (xhr.status === 200) {

			categories = JSON.parse(xhr.responseText); // Parse the response of the json object we got back

			var y = document.getElementById("addPur_category");
			var len = y.length;

			var htmlCatTable = document.getElementById("categories");

			x = htmlCatTable.rows.length;


			for (j = 0; j < x; j++) {
				htmlCatTable.deleteRow(0);
			}


			for (i = 0; i < len; i++) {
				y.remove(0);
			}

			//rewrite functionally
			for (let i = 0; i < categories.length; i++) {
				addCategory(categories[i], i);
			}

			var xhr = new XMLHttpRequest();


			xhr.onreadystatechange = function () { getPurchaseFilteredByMonthHandler(xhr) };
			xhr.open("GET", "/purchases/?month=" + (curMonth.getMonth() + 1));
			console.log("GET Purchases Array Filtered By Month REQUEST: /purchases/?month=" + (curMonth.getMonth() + 1));
			xhr.send();

		}
	}
}

function getPurchaseFilteredByMonthHandler(xhr) {

	if (xhr.readyState === XMLHttpRequest.DONE) {

		console.log(xhr.responseText);
		console.log("GET Purchase Array Filtered By Month RESPONSE:");

		if (xhr.status === 200) {
			currentPurchases = JSON.parse(xhr.responseText);

			for (let i = 0; i < categories.length; i++) {
				bubbleCategories(categories[i], i);
			}
		}
	}


}

function bubbleCategories(catItem, id) {
	// this line is ripped straight from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
	// and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
	//no i am not that smart but it did help me learn rust for the exam
	var addPurchases = (accumulator, currentValue) => accumulator + currentValue.amount;
	var status = catItem.budget - currentPurchases.filter(purchase => purchase.cat === catItem.cat).reduce(addPurchases, 0);
	document.getElementById("categories").rows[id].cells[1].innerText = "" + status;
}


function postCat() {
	var xhr = new XMLHttpRequest();


	var category = document.getElementById("addCat_category").value;
	var budget = document.getElementById("addCat_budget").value;

	xhr.onreadystatechange = function() { postCatHandler(xhr) };
	xhr.open("POST", "/cats/");
	console.log("POST Cat REQUEST: /cats/");

	var data = {};
	data["cat"] = category;
	data["budget"] = budget;

	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	console.log(JSON.stringify(data));
	xhr.send(JSON.stringify(data));
}

function postCatHandler(xhr) {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		console.log("POST Cat RESPONSE:");
		console.log(xhr.responseText);

		if (xhr.status > 199 && xhr.status < 300) {
			document.getElementById("addCat_category").value = "";
			document.getElementById("addCat_budget").value = "";
			populatePage();
		}
	}
}

function delSingleCat(in_id) {
	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() { handleDeleteCategories(xhr) }; // Listener on http request to listen for changes to the state
	xhr.open("DELETE", "/cats/" + in_id);
	console.log("DELETE Cat REQUEST: /cats/" + in_id);

	xhr.send();
}

function handleDeleteCategories(xhr) {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		console.log("DELETE Category RESPONSE:");
		console.log(xhr.responseText);


		if (xhr.status > 199 && xhr.status < 300) {
			populatePage();
		}


	}
}

function addCategory(item, id) {
	var tableRef = document.getElementById("categories");
	var newRow = tableRef.insertRow();
	newRow.insertCell().appendChild(document.createTextNode(item.cat));
	newRow.insertCell().appendChild(document.createTextNode(""));
	newRow.insertCell().appendChild(document.createTextNode("$" + item.budget));

	if(id !== 0) {
		var a = document.createElement('a');
		a.onclick = function() { delSingleCat(id); };
		a.appendChild(document.createTextNode("Delete"));
		newRow.insertCell().appendChild(a);
	} else {
		newRow.insertCell();
	}
		
	let optbox = document.getElementById("addPur_category");
	let opttions = document.createElement('option');
	opttions.value = id;
	opttions.text = item.cat;
	optbox.appendChild(opttions);

}



function getPurHandler(xhr) {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		console.log("GET Purchases RESPONSE:");
		console.log(xhr.responseText);

		if (xhr.status === 200) {

			purchases = JSON.parse(xhr.responseText); // Parse the response of the json object we got back

			while (document.getElementById("purchases").rows.length > 0) {
				document.getElementById("purchases").deleteRow(0);
			}


			for(let i = 0; i < purchases.length; i++){
				addPurchase(purchases[i]);
			}

		}
	}
}

function postPur() {

	var date = new Date(document.getElementById("addPur_date").value + ' GMT -0500');
	var item = document.getElementById("addPur_item").value;
	var category = document.getElementById("addPur_category").value;
	var amount = document.getElementById("addPur_amount").value;

	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() { postPurHandler(xhr) };
	xhr.open("POST", "/purchases/");
	console.log("POST Purchase REQUEST: /purchases/");
	console.log(date);

	var data = {};

	data["date"] = (date.getMonth()+1) + "-" + date.getDate();
	data["item"] = item;
	data["cat_id"] = parseInt(category);
	data["amount"] = amount;

	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

	console.log(JSON.stringify(data));
	xhr.send(JSON.stringify(data));
}

function postPurHandler(xhr) {
	if (xhr.readyState === XMLHttpRequest.DONE) {
		console.log("POST Purchase Response:");
		console.log(xhr.responseText);

		if (xhr.status >= 200 && xhr.status < 300) {
			document.getElementById("addPur_date").value = "";
			document.getElementById("addPur_item").value = "";
			document.getElementById("addPur_category").value = "";
			document.getElementById("addPur_amount").value = "";
			populatePage();
		}
	}
}



function addPurchase(item) {
	var purtable = document.getElementById("purchases");
	var newRow   = purtable.insertRow();
    let monAndDay = new Date(item.date);
	newRow.insertCell().appendChild(document.createTextNode((monAndDay.getMonth()+1) + "/" + monAndDay.getDate()));
	newRow.insertCell().appendChild(document.createTextNode(item.item));
	newRow.insertCell().appendChild(document.createTextNode(item.cat));

	newRow.insertCell().appendChild(document.createTextNode("$"+item.amount));


}

function populatePage(){

	var xhr1 = new XMLHttpRequest();

	if (!xhr1) {
		alert('Unable to make XMLHTTP Req');
		return false;
	}

	xhr1.onreadystatechange = function() { getHandlerCat(xhr1) };
	xhr1.open("GET", "/cats/");
	console.log("GET Categories REQUESTED: /cats/");
	xhr1.send();

	var xhr2 = new XMLHttpRequest();

	if (!xhr2) {
		alert('Giving up :( Cannot create an XMLHTTP instance');
		return false;
	}

	xhr2.onreadystatechange = function() { getPurHandler(xhr2) };
	xhr2.open("GET", "/purchases/");
	console.log("GET Purchases REQUESTED:/purchases/");
	xhr2.send();



}

window.addEventListener("load", setup, true);