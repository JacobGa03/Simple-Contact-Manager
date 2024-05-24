<?php
	require 'common.php';
	//Set the required fields to be filled in by the JSON
	$required = [
	'firstName',
	'lastName',
	'favorite',
	'phone',
	'email',
	'userId'
	];
	//Get the input JSON and connect to the database
	$inData = getRequestParams($required);
	$conn = getDbConnection();
	
	try{
		//INSERT the new Contact into the database
		$stmt = $conn->prepare('INSERT INTO Contacts (FirstName,LastName,Favorite,Phone,Email,UserID) VALUES (?,?,?,?,?,?)');
		$stmt->bind_param('ssissi', $inData['firstName'], $inData['lastName'], $inData['favorite'],$inData['phone'],$inData['email'],$inData['userId']);
		$stmt->execute();
		//There is code to get the correct id to return to the user
		$rslt = $stmt->get_result();
		//Grab the id of inserted contact. This will make deleting easier
		$inData['id'] = $conn->insert_id;

		//Return the $inData back to the user to show a successful insertion
		returnJson($inData);
	}catch(mysqli_sql_exception $ex){
		returnError(CODE_SERVER_ERROR, $ex->getMessage());
	}finally{
		conn->close();
	}
?>