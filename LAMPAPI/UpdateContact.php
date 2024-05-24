<?php
	require 'common.php';
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
		//Find the user within the database
		$stmt = $conn->prepare('UPDATE Contacts SET `FirstName` = ?, `LastName` = ?, `Favorite` = ?, `Phone` = ?, `Email` = ? WHERE `ID` = ?');
		$stmt->bind_param('ssissi', $inData['firstName'], $inData['lastName'], $inData['favorite'], $inData['phone'], $inData['email'], $inData['id']);
		$stmt->execute();
		$rslt = $stmt->get_result();

		//Return the $inData back to the user to show a successful insertion
		returnJson($inData);
	}catch(mysqli_sql_exception $ex){
		returnError(CODE_SERVER_ERROR, $ex->getMessage());
	} finally {
		conn->close();
	}
?>