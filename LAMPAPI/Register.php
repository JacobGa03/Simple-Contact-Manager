<?php
	//Register a new user to the web app (This amounts to adding another user to the User table)
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	$login = "";
	$password = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "OurDatabase"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//TODO: Might have to check to see if the login and password exist already

		//This query works for inserting a NEW user to the Users table
		$stmt = $conn->prepare("INSERT into Users (FirstName,LastName,Login,Password) VALUES (?,?,?,?)");
		//Bind the firstName, lastName, login and password to the '?' in our query
		$stmt->bind_param("ssss", $inData["FirstName"], $inData["LastName"], $inData["Login"], $inData["Password"]);
		$stmt->execute();

		//Return the full name of the user along with their assigned ID (go to same stage as login)
		if($stmt->affected_rows > 0)
		{
			returnWithInfo( $inData['FirstName'], $inData['LastName'], $conn->insert_id);
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}
	
	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"ID":0,"FirstName":"","LastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"ID":' . $id . ',"FirstName":"' . $firstName . '","LastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>