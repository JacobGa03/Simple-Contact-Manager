
async function doLogin() {
  let requestData = {
    username: document.getElementById("username").value,
    password: document.getElementById("password").value
  };

  let [ code, result ] = await callApi("/Login.php", requestData);
  switch(code)  {
    case 200: // OK: Successful login
      saveUser(result);
      //TODO: Change this to whatever becomes the main dashboard page
      window.location.replace('crud.html') 
      break;
    case 404: // NOT FOUND: Incorrect login
      document.getElementById("loginResult").innerHTML = "Login/Password combination incorrect";
      break;
    default:
      alert("An unknown error has occured. Check browser console for details.");
      break;
  }
}

async function doRegister() {
  let password = document.getElementById("password").value;
  let confirmPassword = document.getElementById("confirmPassword").value;

  if(password != confirmPassword)
  {
    document.getElementById("registerResult").innerHTML = "Make sure your passwords match";
    return;
  }

  let requestData = {
    username: document.getElementById("username").value,
    password: password,
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value
  };

  let [ code, result ] = await callApi("/Register.php", requestData);
  switch(code) {
    case 200: // OK: Successful registration
      saveUser(result);
      //TODO: Change this to whatever becomes the main dashboard page
      window.location.replace('crud.html') 
      break;
    case 409: // CONFLICT: Requested username already exists
      document.getElementById("registerResult").innerHTML = "Username already taken. Please choose another one.";
      break;
    default:
      alert("An unknown error has occured. Check browser console for details.");
      break;
  }
}

async function addContact() {
  let appUser = getUser();
  if(appUser == null) {
    // User is not logged in, how did we get here?
    console.log("addContact: User not logged in???");
    return;
  }

  //TODO: There will need to be MULTIPLE inputs here from one of the pages
  let requestData = {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    favorite: document.getElementById("favorite").value,
    phone: document.getElementById("phone").value,
    email: document.getElementById("email").value,
    userId: appUser.id
  }

  let [ code, result ] = await callApi("/AddContact.php", requestData);
  if(code == 200) {
    document.getElementById("colorAddResult").innerHTML = "Contact Added!";
  } else {
    console.log("addContact: Something went wrong.");
  }
}

/*
 * Sends a request to the specified endpoint. Automatically handles
 * the construction of the JSON request and decoding of the reply.
 *
 * Usage example:
 *
 *   let requestData = {
 *     foo: "someValue",
 *     bar: 100
 *   };
 *   let [ code, result ] = callApi("/Something.php", requestData);
 *
 * `code` will be the HTTP status code integer, 200 indicates success.
 * `result` will be a javascript object containing all values returned
 *   by the API.
 */
async function callApi(endpointPath, requestData) {
  // Construct and send request to backend.
  let url = window.location.origin + "/LAMPAPI" + endpointPath;
  let options = {
    body: JSON.stringify(requestData),
    method: "POST"
  };
  let responseObject = await fetch(url, options);

  // Decode the JSON reply.
  let responseBody = await responseObject.text();
  let result = JSON.parse(responseBody);
  
  // Our API always replies with 200 OK for successful requests, other status codes
  // indicate errors and API includes an error string in the result object.
  // For now, just log them to the browser's console.
  if(responseObject.status != 200) {
    console.log("Error from backend (status=%d): %s", responseObject.status, result.error);
  }

  // Return to the caller two values - the status code and decoded result object.
  // It's easy to access by destructuring assignment, see:
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
  return [ responseObject.status, result ];
}

/*
 * The following two functions save and retrieve the user information
 * via a browser cookie by encoding a javascript object as JSON and
 * saving the resulting string under the cookie named "user".
 * If no such cookie exist, getUser() returns null.
 *
 * These cookie handler functions are very crude, we can take a look at
 * a proper JS library like js-cookie if we need to do more complex tasks.
 */

function saveUser(userData) {
  // Expire time (20 minutes)
  let d = new Date();
  d.setTime(d.getTime() + 20 * 60 * 1000);
  // Encode object as JSON and escape special characters
  let value = JSON.stringify(userData);
  value = encodeURIComponent(value);
  // Save it
  document.cookie = "user=" + value + ";"
    + "expires=" + d.toUTCString() + ";"
    + "path=/";
}

function getUser() {
  let obj = null;
  // Find the cookie named "user"
  for(let c of document.cookie.split(";")) {
    c = c.trimStart();
    if(c.startsWith('user=')) {
      // Found it! Read the string to the right
      // of the "=" and decode it as JSON.
      let value = c.substring(5);
      value = decodeURIComponent(value);
      obj = JSON.parse(value);
      break;
    }
  }
  return obj;
}
