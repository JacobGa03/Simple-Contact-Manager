<?php
	//Delete a given contact from the table
	$inData = getRequestInfo();
	
	$id = 0;
	$FirstName = "%".$inData["FirstName"]."%";
	$LastName = "%".$inData["LastName"]."%";
	// $Favorite = $inData["Favorite"];
	// $Phone = $inData["Phone"];
	// $Email = $inData["Email"];
	$UserID = $inData["UserID"];

	//TODO: NEED TO CHANGE THIS      UN          PW               table name
	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "OurDatabase"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//TODO: Need to change this too, probably??
		$stmt = $conn->prepare("DELETE FROM Contacts  WHERE (FirstName like ? OR LastName like ?) AND UserID = ?");
		$stmt->bind_param("ssi", $FirstName, $LastName,$UserID);
		$stmt->execute();
		$result = $stmt->get_result();

		if($result)
		{
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>