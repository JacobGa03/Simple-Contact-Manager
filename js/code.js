//TODO: Add more functions to call the API (Modify)
const urlBase = 'http://contact-manager.rodlop.net/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
//Log the user into their account when their credentials are entered
function doLogin()
{
	//When we pass the JSON to the API, they will return the UserID to the front end
	userId = 0;
	firstName = "";
	lastName = "";
	
	//Grab the login and password from the corresponding fields
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//It's always a good idea to NEVER store plaintext passwords
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	//Package the information into a JSON notation
	//For the Login.php we need to pass 'login' and 'password' to query the database
	let tmp = {username:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	//Use the API endpoint (Login.php)
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//Parse the JSON response from the API
				let jsonObject = JSON.parse( xhr.responseText );
				//NOTE: userId is a GLOBAL variable, therefore it can be reached from ANY function
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "Username/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				//TODO: Change this to whatever becomes the main dashboard page
				window.location.href = "crud.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}
//Create a new User only if the username isn't already taken
function doRegister(){
	//When we pass the JSON to the API, they will return the UserID to the front end
	userId = 0;
	firstName = "";
	lastName = "";
	
	//Grab the login and password from the corresponding fields
	let firstName = document.getElementById("firstName").value;
	let lastName = document.getElementById("lastName").value;
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
	//It's always a good idea to NEVER store plaintext passwords
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	//Package the information into a JSON notation
	//To register UN,PW, and both first and last names must be passed
	let tmp = {username:login,password:password,firstName:firstName,lastName:lastName};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Register.' + extension;

	//Use the API endpoint (Login.php)
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState == 4 && this.status == 200) 
			{
				//Parse the JSON response from the API
				let jsonObject = JSON.parse( xhr.responseText );
				//NOTE: userId is a GLOBAL variable, therefore it can be reached from ANY function
				userId = jsonObject.id;
				//Save the first and last name so we can display it
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				//TODO: Change this to whatever becomes the main dashboard page
				window.location.href = "crud.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}


}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	userId = -1;
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "firstName" )
		{
			firstName = tokens[1];
		}
		else if( tokens[0] == "lastName" )
		{
			lastName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
	}
}

function doLogout()
{
	userId = 0;
	firstName = "";
	lastName = "";
	document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
	window.location.href = "index.html";
}
//Adds a new contact to a Users list of Contacts
function addContact()
{
	//Get the new contact to add
	//TODO: There will need to be MULTIPLE inputs here from one of the pages
	let firstName = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	let lastName = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	let favorite = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	let phone = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	let email = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	//Create a JSON payload with fields for a new contact filled in
	let tmp = {firstName:firstName,lastName:lastName,favorite:favorite,phone:phone,email:email,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			//Display that the contact was added successfully
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Contact Added!";
			}
		};
		xhr.send(jsonPayload);
	}
	//There was some error when adding a new contact
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}
//TODO: Search for a contact
function searchContact()
{
	//Get the Contact to search for 
	//TODO: There will need to be MULTIPLE inputs here from one of the pages
	let firstName = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	let lastName = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	let favorite = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	let phone = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	let email = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";
	//TODO: Determine a way to take fields that aren't filled and turn them into values that aren't allowed for different fields in order to make the search not reliant on those fields
	
	//TODO: Change this to an array Leinecker video will help with this 
	let contactList = "";

	//Create a JSON payload with fields for a contact to search for
	let tmp = {firstName:firstName,lastName:lastName,favorite:favorite,phone:phone,email:email,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchContact.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			//Display that the contact was added successfully
			if (this.readyState == 4 && this.status == 200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Contact(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );
				
				//TODO: Figure out what to do for the array of JSON that is returned 
				for( let i=0; i<jsonObject.results.length; i++ )
				{
					colorList += jsonObject.results[i];
					if( i < jsonObject.results.length - 1 )
					{
						colorList += "<br />\r\n";
					}
				}
				
				document.getElementsByTagName("p")[0].innerHTML = colorList;
			}
		};
		xhr.send(jsonPayload);
	}
	//There was some error when adding a new contact
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
}