<?php

/* This file contains common variables for the LAMP API,
 * as well as frequently used utility functions. Use as:
 * include 'common.php';
 */

// Database properties - these may be best to get from
// a properties file or similar rather placing here.
define('DB_HOST', 'localhost');
define('DB_USER', 'TheBeast');
define('DB_PASS', 'WeLoveCOP4331');
define('DB_NAME', 'OurDatabase');

// Common HTTP Response Codes - feel free to add more.
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
define('CODE_BAD_REQUEST', 400);
define('CODE_NOT_FOUND', 404);
define('CODE_CONFLICT', 409);
define('CODE_SERVER_ERROR', 500);

/* Get and decode the incoming JSON data from the request body; returns
 * an associative array with all its contents. Optionally, checks that
 * the incoming JSON contains all the specified key-value pairs - this
 * can help the front-end guys debug incorrectly formatted requests.
 */
function getRequestParams(array $required = null) : array {
  $inData = json_decode(file_get_contents('php://input'), true);
  if($inData == null) {
    returnError(CODE_BAD_REQUEST, 'Error parsing incoming JSON ' . json_last_error_msg());
  }
  if($required != null) {
    foreach($required as $key) {
      if(!isset($inData[$key])) {
        returnError(CODE_BAD_REQUEST, "Required parameter `$key` not provided in incoming JSON.");
      }
    }
  }
  return $inData;
}

/* Get a MySQLi connection to our database. */
function getDbConnection() : mysqli {
  try {
  $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
  return $conn;
  } catch(mysqli_sql_exception $ex) {
    returnError(CODE_SERVER_ERROR, 'getDbConnection() failed ' . $ex->getMessage());
  }
}

/* Serialize $out_data as JSON and send it in the body of the response.
 * Calling this function will end the PHP script.
 */
function returnJson(array $out_data) {
  $out_string = json_encode($out_data);
  header('Content-Type: application/json');
  echo $out_string;
  exit();
}

/*
 * Sets the HTTP response code and sends a JSON object with
 * a single error value as the response. Exits the PHP script.
 */
function returnError(int $code, string $message) {
  http_response_code($code); 
  returnJson(['error' => $message]);
}
