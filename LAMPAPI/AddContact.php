<?php
	//Add a new contact to a specified user's contact list
	$inData = getRequestInfo();
	//Capture all of the incoming data from JSON	
	$id = 0;
	$FirstName = $inData["FirstName"];
	$LastName = $inData["LastName"];
	$Favorite = $inData["Favorite"];
	$Phone = $inData["Phone"];
	$Email = $inData["Email"];
	$UserID = $inData["UserID"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "OurDatabase"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//Prepare the query and bind the variables to the incoming JSON object
		$stmt = $conn->prepare("INSERT INTO Contacts (FirstName,LastName,Favorite,Phone,Email,UserID) VALUES (?,?,?,?,?,?)");
		$stmt->bind_param("ssissi", $FirstName, $LastName, $Favorite, $Phone, $Email, $UserID);
		$stmt->execute();
		$result = $stmt->get_result();

		//Upon successful insertion, return the new contact added
		if($result)
		{
			//TODO: Fix this somehow to get the auto-generate UserID from the MySQL database
			returnWithInfo( $FirstName, $LastName, $UserID);
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