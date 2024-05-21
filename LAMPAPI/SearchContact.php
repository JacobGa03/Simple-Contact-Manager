<?php
	//Search for a certain contact with partial name matching
	$inData = getRequestInfo();
	//Structure ALL incoming Strings for the 'like' clause	
	$FirstName = "%".$inData["FirstName"]."%";
	$LastName = "%".$inData["LastName"]."%";
	$UserID = $inData["UserID"];
	//Keep track of the amount of matches we find
	$searchCount= 0;
	$searchResult = "";

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "OurDatabase"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		//Set up the SELECT query and run it
		$stmt = $conn->prepare("SELECT FirstName,LastName,Phone,Email,UserID,ID FROM Contacts WHERE (FirstName like ? OR LastName like ?) AND UserID = ?");
		$stmt->bind_param("ssi", $FirstName, $LastName, $UserID);
		$stmt->execute();
		$result = $stmt->get_result();

		//Loop through all of the rows that matched the search	
		while($row = $result->fetch_assoc()){
			//Append a comma only if we've append the first result first
			if($searchCount>0)
			{
				$searchResult .= ",";
			}
			$searchCount++;
			$searchResult .='{"FirstName" : "' . $row["FirstName"]. '", "LastName" : "' . $row["LastName"]. '", "Phone" : "' . $row["Phone"]. '", "Email" : "' . $row["Email"]. '", "UserID" : "' . $row["UserID"].'", "ID" : "' . $row["ID"]. '"}';
		}

		//We found no contact matching our search
		if($searchCount == 0){
			returnWithError("No Contacts Found");
		}
		//We found at least one contact matching our search
		else{
			returnWithInfo($searchResult);
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
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"Results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>