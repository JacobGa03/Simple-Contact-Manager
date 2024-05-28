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
		$stmt = $conn->prepare("DELETE FROM Contacts WHERE id = ?");
		$stmt->bind_param("i", $inData['id']);
		$stmt->execute();

		//Return the $inData back to the user to show a successful deletion 
		returnJson($inData);
	}catch(mysqli_sql_exception $ex){
		returnError(CODE_SERVER_ERROR, $ex->getMessage());
	}finally{
		conn->close();
	}
?>
