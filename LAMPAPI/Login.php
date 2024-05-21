<?php
	require 'common.php';
	//Set the required fields to be filled in by the JSON
	$required = [
	'username',
	'password'
	];
	//Get the input JSON and connect to the database
	$inData = getInputData($required);
	$conn = getDbConnection();

	try{
		//Find the user within the database
		$stmt = $conn->prepare('SELECT * FROM Users WHERE Login = ? AND Password = ?');
		$stmt->bind_param('ss', $inData['username'], $inData['password']);
		$stmt->execute();
		$rslt = $stmt->get_result();
		$row = $rslt->fetch_assoc();

		//The login and password weren't found in the Users table
		if($row == null){
    		returnError(CODE_NOT_FOUND, "Username/Password not found");
		}
		//Grab the id of the User
		$inData['id'] = $row['ID'];
		//Return the user found back as JSON
		returnJson($inData);
	}catch(mysqli_sql_exception $ex){
		returnError(CODE_SERVER_ERROR, $ex->getMessage());
	} finally {
		conn->close();
	}
?>