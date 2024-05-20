<?php
	//Add a new contact to a specified user's contact list
	$inData = getRequestInfo();
	
	$id = 0;
	$firstName = "";
	$lastName = "";
	$favorite = 0;
	$phoneNumber = "";
	$email = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "OurDatabase"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//TODO: Need to change this too, probably insert??
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName,LastName,Favorite,Phone,Email,UserID) VALUES (?,?,?,?,?,?)");
		$stmt->bind_param("ssissi", $inData["FirstName"], $inData["LastName"], $inData["Favorite"], $inData["Phone"], $inData["Email"], $inData["UserID"]);
		$stmt->execute();
		$result = $stmt->get_result();

		//Upon successful insertion, return the new contact added
		if($result)
		{
			//Same issue w/ getting the id of the newly added contact
			returnWithInfo( $inData['FirstName'], $inData['LastName'], $inData['UserID']);
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