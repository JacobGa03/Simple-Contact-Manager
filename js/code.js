//Grab the UN and PW from the input tags, then request the users info from the database
async function doLogin() {
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  //Ensure that the fields are filled in for the API
  if(username.value == '')
  {
    username.reportValidity();
    return;
  }
  if(password.value == '')
  {
    password.reportValidity();
    return;
  }

  //Gather the data to be sent to the API
  let requestData = {
    username: username.value,
    password: password.value
  };

  let [ code, result ] = await callApi("/Login.php", requestData);
  //Decode the response
  switch(code)  {
    case 200: // OK: Successful login
      saveUser(result);
      window.location.replace('dashboard.html');
      break;
    case 404: // NOT FOUND: Incorrect login
      password.setCustomValidity("Login/Password Combination Incorrect");
      password.reportValidity();
      //Reset code so we can resubmit and run the form again (If we don't then we are stuck here)
      code = 0;
      break;
    default:
      alert("An unknown error has occurred. Check browser console for details.");
      break;
  }
}
//Grab all of the user information from the form and create a new User.
async function doRegister() {
  let firstName = document.getElementById("firstName");
  let lastName = document.getElementById("lastName");
  let username = document.getElementById("username");
  let password = document.getElementById("password");
  let confirmPassword = document.getElementById("confirmPassword");
  //Do some sort of validation
  if(firstName.value == '')
  {
    firstName.reportValidity();
    return;
  }
  if(lastName.value == '')
  {
    lastName.reportValidity();
    return;
  }
  if(username.value == '')
  {
    username.reportValidity();
    return;
  }
  if(password.value == '')
  {
    password.reportValidity();
    return;
  }
  if(confirmPassword.value == '')
  {
		confirmPassword.setCustomValidity("Confirm Your Password");
    confirmPassword.reportValidity();
    return;
  }
  //Ensure that both passwords are the same
  if(password.value != confirmPassword.value)
  {
    //We can manipulate the "required" attribute to do some post-submission validation
		confirmPassword.setCustomValidity("Passwords Must Match");
    confirmPassword.reportValidity();
    return;
  }

  //Gather the data to be sent to the API
  let requestData = {
    username: username.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value
  };

  let [ code, result ] = await callApi("/Register.php", requestData);
  switch(code) {
    case 200: // OK: Successful registration
      saveUser(result);
      window.location.replace('dashboard.html');
      break;
    case 409: // CONFLICT: Requested username already exists
		  username.setCustomValidity("Username Already Taken. Please Choose Another One.");
      username.reportValidity();
      //Reset code so we can resubmit and run the form again (If we don't then we are stuck here)
      code = 0;
      break;
    default:
      alert("An unknown error has occurred. Check browser console for details.");
      break;
  }
}

//Add Contact for a specified user
async function addContact() {
  //Grab the user information
  let appUser = getUser();
  if(appUser == null) {
    // User is not logged in, how did we get here?
    console.log("addContact: User not logged in???");
    return;
  }

  let firstName = document.getElementById("add-firstName");
  let lastName = document.getElementById("add-lastName");
  let email = document.getElementById("add-email");
  let phone = document.getElementById("add-phone");
  //Do some verification
  if(firstName.value == '')
  {
    firstName.reportValidity();
    return;
  }
  if(lastName.value == '')
  {
    lastName.reportValidity();
    return;
  }
  if(email.value == '' || !(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)))
  {
    email.setCustomValidity("Only Emails of the Form 'example@email.com' are Allowed");
    email.reportValidity();
    return;
  }
  if(phone.value == '' || !(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(phone.value)))
  {
    phone.setCustomValidity("Phone Number Only Contain Numbers and/or Dashes");
    phone.reportValidity();
    return;
  }

  //Package our request
  let requestData = {
    firstName: document.getElementById("add-firstName").value,
    lastName: document.getElementById("add-lastName").value,
    favorite: 0, /*document.getElementById("add-favorite").value,*/
    /* TODO ^^^ Add overlay needs proper favorite checkbox or something */
    phone: document.getElementById("add-phone").value,
    email: document.getElementById("add-email").value,
    userId: appUser.id
  }

  let [ code, result ] = await callApi("/AddContact.php", requestData);
  if(code == 200) {
    console.log("add success"); // TODO
  } else {
    console.log("addContact: Something went wrong.");
  }

   let addResult = {
   Results: [
      {
          firstName: firstName.value,
          lastName: lastName.value,
          phone: phone.value,
          email: email.value,
          userId: appUser.id,
          id: result.id
      }
    ]
  };
  // Draw the new row
  drawRow(addResult);
  // Go back to the dashboard
  document.getElementById("aoverlay").classList.remove("active");
  // Clear the fields
  document.getElementById("add-firstName").value = '';
  document.getElementById("add-lastName").value = '';
  document.getElementById("add-email").value = '';
  document.getElementById("add-phone").value = '';
}

/*
 * Update the properties of contact id with new information
 * from the editor overlay textboxes.
 */
async function updateContact(id) {
    //Grab the user information
    let appUser = getUser();
    if(appUser == null) {
      // User is not logged in, how did we get here?
      console.log("addContact: User not logged in???");
      return;
    }

    let requestData = {
      firstName: document.getElementById("edit-firstName").value,
      lastName: document.getElementById("edit-lastName").value,
      email: document.getElementById("edit-email").value,
      phone: document.getElementById("edit-phone").value,
      favorite: 0, // we still don't support favorite functionaliy
      id: id, // contact id from function argument
      userId: appUser.id // logged in user id
    };

    let [ code, result ] = await callApi("/UpdateContact.php", requestData);
    if(code == 200) {
      /* success */
    } else {
      /* handle error */
    }
}

/*
 * Delete a contact by contact id
 * Loop through and remove the row corresponding to the contact we deleted
 */
async function deleteContact(id) {
  let requestData = {
    id: id
  }
  let [ code, result ] = await callApi("/DeleteContact.php", requestData);
  if(code == 200) {
    /* TODO: Delete <tr> corresponding to the contact that we deleted. We should really AVOID reloading*/
  } else {
    /* oopsies */
  }
}

async function searchContact(){
  // Grab the input from the search bar
  let searchContent = document.getElementById('search-input').value;
  //Clear the table to only show matches
  document.getElementById("contacts-table-tbody").innerHTML = "";
  //Populate already calls the search API and should fill the table accordingly
  populateContactsTable(searchContent,searchContent,searchContent,searchContent);

  // Clear the input field after request is fulfilled
  document.getElementById("search-input").value = '';
}

/* Populate the contacts table of the dashboard page with all
 * the contacts for the application user
 * TODO: this queries all the contacts, do we need "lazy" loading??
 */
async function populateContactsTable(firstName, lastName, phone, email) {
  let appUser = getUser();
  if(appUser == null) {
    // User is not logged in, how did we get here?
    console.log("populateContactsTable: User not logged in???");
    return;
  }
  //Set the Username at the top so we know who is using
  document.getElementById("username").textContent = appUser.username;

  // if these strings were not empty, the api would return contacts
  // that (partial) match; but because they're empty all contacts will
  // be returned
  let requestData = {
    firstName: firstName,
    lastName: lastName,
    phone: phone,
    email: phone,
    favorite: -1,
    userId: appUser.id,
  };
  let [ code, result ] = await callApi("/SearchContact.php", requestData);

  switch(code) {
  case 404: // NOT FOUND: no contacts match
    /* TODO: clear the table, for example or do something else */
    console.log("populateContactsTable: zero contacts found");
    break;
  case 200: // OK
    // Draw all of the contacts
    drawRow(result);
    break;
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
/* Draw a new <tr> for all of the contacts within result (array)
*  The contact info and buttons are also drawn.
*/
function drawRow(result){
  // retrieve the HTML table element
  let table = document.getElementById("contacts-table-tbody");

  // the functions that will be attached to ALL the Edit/Delete buttons
  let editCallback = (evt) => {
    // get the element that got triggered (ie, the button)
    let editButton = evt.currentTarget;
    // show the HTML overlay
    let overlay = document.getElementById("eoverlay");
    overlay.classList.add("active");

    // fill the textboxes of the overlay with existing contact data
    document.getElementById("edit-firstName").value = editButton.associatedContact.firstName;
    document.getElementById("edit-lastName").value = editButton.associatedContact.lastName;
    document.getElementById("edit-email").value = editButton.associatedContact.email;
    document.getElementById("edit-phone").value = editButton.associatedContact.phone;

    // the confirm button of the overlay...
    let confirmButton = document.getElementById("confirm-edit");
    // ...attach it to the edit function and bind contact id
    confirmButton.addEventListener("click", () => {
      updateContact(editButton.associatedContact.id);
      overlay.classList.remove("active"); // hide overlay
      // get the row of the table...
      let tableRow = editButton.closest("tr");
      // and changes the name, phone and mail to match update
      let newfirstname = document.getElementById("edit-firstName").value;
      let newlastname = document.getElementById("edit-lastName").value;
      let newphone = document.getElementById("edit-phone").value;
      let newemail = document.getElementById("edit-email").value;
      editButton.associatedContact.firstName = newfirstname;
      editButton.associatedContact.lastName = newlastname;
      editButton.associatedContact.phone = newphone;
      editButton.associatedContact.email = newemail;
      tableRow.querySelector("#nameCell").replaceChildren(document.createTextNode(newfirstname + ' ' + newlastname));
      tableRow.querySelector("#phoneCell").replaceChildren(document.createTextNode(newphone));
      tableRow.querySelector("#emailCell").replaceChildren(document.createTextNode(newemail));
     })
  };

  let deleteCallback = (evt) => {
    // get the element that got triggered (ie, the button)
    let deleteButton = evt.currentTarget;

    // show the HTML overlay
    let overlay = document.getElementById("doverlay");
    overlay.classList.add("active");
    // the confirm button of the overlay...
    let confirmButton = document.getElementById("confirm-delete");
    // ...attach it to the delete function and bind contact id
    confirmButton.addEventListener("click", () => {
      deleteContact(deleteButton.associatedContact.id);
      overlay.classList.remove("active"); // hide overlay
      // get the row of the table...
      let tableRow = deleteButton.closest("tr");
      table.removeChild(tableRow); // ...and delete it
    });
  };

  // iterate over the received array of objects
  for(contact of result["Results"]) {
    // create entries on the HTML table for each contact
    //TODO: Can we someway add some properties so we can make delete easier?
    let newRow = table.insertRow();
    // Set the id of the new row to ('row' + contact.id)
    newRow.setAttribute("id", "row"+contact.id);
    let nameCell = newRow.insertCell();
    let emailCell = newRow.insertCell();
    let phoneCell = newRow.insertCell();
    nameCell.appendChild(document.createTextNode(contact.firstName + " " + contact.lastName));
    nameCell.setAttribute("id", "nameCell");
    emailCell.appendChild(document.createTextNode(contact.email));
    emailCell.setAttribute("id", "emailCell");
    phoneCell.appendChild(document.createTextNode(contact.phone));
    phoneCell.setAttribute("id", "phoneCell");
    // create the two buttons and add the necessary class plus text
    let buttonsCell = newRow.insertCell();
    let buttonEdit = document.createElement("button");
    let buttonDelete = document.createElement("button");
    buttonEdit.setAttribute("class", "buttonY");
    buttonDelete.setAttribute("class", "buttonR");
    buttonEdit.appendChild(document.createTextNode("Edit"));
    buttonDelete.appendChild(document.createTextNode("Delete"));
    // this is the trick - assign a custom parameter to the element itself!
    // go ahead and just copy the whole contact to the button's internal object
    buttonEdit.associatedContact = contact;
    buttonDelete.associatedContact = contact;
    // when clicked, the button will call the function and
    // pass itself as an argument
    buttonEdit.addEventListener("click", editCallback);
    buttonDelete.addEventListener("click", deleteCallback);
    // place them in the table
    buttonsCell.appendChild(buttonEdit);
    buttonsCell.appendChild(buttonDelete);
  }
}
