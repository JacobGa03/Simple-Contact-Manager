<?php

	require 'common.php';
	//Set the required fields to be filled in by the JSON
	$required = [
	'id'
	];
	//Get the input JSON and connect to the database
	$inData = getRequestParams($required);
	$conn = getDbConnection();
	
	try{
		//DELETE the Contact from the database
		// $stmt = $conn->prepare("DELETE FROM Contacts WHERE FirstName like ? AND LastName like ? AND Favorite = ? AND Phone like ? AND Email like ? AND UserID = ?");
		// $stmt->bind_param("ssissi", $inData['firstName'],$inData['lastName'],$inData['favorite'],$inData['phone'],$inData['email'],$inData['userId']);
		//DELETE a specific row identified by ID (which is auto-incremented by MySQL)
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE ID = ?");
		$stmt->bind_param("i", $inData['id']);
		$stmt->execute();
		$rslt = $stmt->get_result();

		//Return the $inData back to the user to show a successful deletion 
		returnJson($inData);
	}catch(mysqli_sql_exception $ex){
		returnError(CODE_SERVER_ERROR, $ex->getMessage());
	}finally{
		conn->close();
	}
?>
