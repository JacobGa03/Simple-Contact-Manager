<?php

require 'common.php';

// Front-end *must* include these in their JSON request
$required = [
  'username',
  'password',
  'firstName',
  'lastName'
];

$inData = getRequestParams($required);
$conn = getDbConnection();

try {
  // Query the database to check if the requested username exists
  $stmt = $conn->prepare('SELECT * FROM Users WHERE `Login` = ?');
  $stmt->bind_param('s', $inData['username']);
  $stmt->execute();
  $rslt = $stmt->get_result();

  // If we're able to fetch at least one row, that means
  // that the username already exists.
  if($rslt->fetch_row() != null) {
    returnError(CODE_CONFLICT, "Username `{$inData['username']}` already exists");
  }

  // Insert the new user into the database
  $stmt = $conn->prepare('INSERT INTO Users (FirstName, LastName, Login, Password) VALUES (?,?,?,?)');
  $stmt->bind_param('ssss', $inData['firstName'], $inData['lastName'], $inData['username'], $inData['password']);
  $stmt->execute();

  // Generate the response JSON - we can resend the incoming request because
  // the fields are the same, but add the required ID field of the new user.
  // ($stmt->insert_id contains the generated AUTO_INCREMENT key from MySQL).
  $inData['id'] = $stmt->insert_id;
  returnJson($inData);
} catch(mysqli_sql_exception $ex) {
  returnError(CODE_SERVER_ERROR, $ex->getMessage());
} finally {
  conn->close();
}
