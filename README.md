## Goal:
To gain experience with building RESTful APIs.

## High-level description:
A very simple budget application for a single user. The
application supports several budget categories, and a set monthly limit
for each category (e.g., $700 for rent, $200 for food, $100 for gas, etc.).
The application allows the user to enter purchases and present an up to
date list of the user's remaining budgeted amount in each category (e.g., you
have $0/$700 left for rent, you are $20 over your food budget of $200, and you
have $44/$100 left for gas), and the amount spent on uncategorized purchases.

## Specifications:
1. You must build a RESTful API for accessing your budget category and purchase
	resources. Specifically, users should be able to perform HTTP GETs, POSTs,
	and DELETEs on `"/cats"` to get a list of budget categories, add a new
	category, and delete a category (respectively), and also perform HTTP GETs
	and POSTs to `"/purchases"` to get a list of individual purchases by the user
	and to add a new purchase.

1.  All data must be transmitted using JSON.

1. Since we assume for this project that your website manages the budget of
	only a single user, you do not need to implement any user management,
	login, or password authentication.

1. When the root resource of your site is accessed (`"/"`), your Flask
	application should send a basic page skeleton to the user along with a
	JavaScript application that will make AJAX requests to populate the page.
	Your Flask template should only replace the url for the JavaScript file.

1. Once the page is loaded by a user's browser, it should make AJAX requests
	for the list of categories and list of purchases made by the user using the
	RESTful API.

1. Because you are only outputting budget category summaries to the main page,
	use `console.log()` to print the JSON contents of every AJAX response you
	get to help out the TA when grading.

1. Once populated, the page should display the status of each of the user's
	budget categories, and the total of uncategorized purchases.

1. The user should always have the ability to add a new purchase (specifying
	the amount spent, what it was spent on, the date that it was spent, and the
	category it should be counted towards) or category (specifying name and
	limit), and also always have the ability to delete any existing category.

1. You do not need to regularly poll the server for updates. However, once user
	requests any changes (e.g., add a purchase, add a category, delete a
	category), your application should fetch updated information via the
	RESTful API, and recompute the status of each of the user's budget
	categories.

1. Because we are not storing the data using SQLAlchemy, you do not need to
	persist data across server instances.

	* If the server is killed (i.e., Ctrl+C issued), all category/purchase data
		can be forgotten.

1. You must build your website using JavaScript, JSON, AJAX, Python, and
	Flask.
	
	
1. Run The application by setting the FLASK_APP environment variable to your budget.py and running flask run
