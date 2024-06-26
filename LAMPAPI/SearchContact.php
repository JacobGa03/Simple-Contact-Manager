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

	//Set the first and last names to %%, so they can be partially matched
	$inData['firstName'] = '%'.$inData['firstName'].'%';
	$inData['lastName'] = '%'.$inData['lastName'].'%';
	$inData['phone'] = '%'.$inData['phone'].'%';
	$inData['email'] = '%'.$inData['email'].'%';
	//Keep track of the total matches found
	$searchCount = 0;
	//Keep an array of Contact JSON objects
	$searchResult = "";
	try{
		//Find the user within the database. The additional CONCAT condition allows searching by full name.
		$stmt = $conn->prepare('SELECT * FROM Contacts WHERE (`firstName` LIKE ? OR `lastName` LIKE ? OR `favorite` = ? OR `phone` LIKE ? OR `email` LIKE ? OR CONCAT(`firstName`, " ", `lastName`) LIKE ?) AND `userId` = ?');
		$stmt->bind_param('ssisssi', $inData['firstName'], $inData['lastName'], $inData['favorite'], $inData['phone'], $inData['email'], $inData['firstName'], $inData['userId']);
		$stmt->execute();
		$rslt = $stmt->get_result();

		//Loop through all of the rows that matched the search	
		while($row = $rslt->fetch_assoc()){
			//Append a comma only if we've append the first result first
			if($searchCount>0){
				$searchResult .= ",";
			}
			$searchCount++;
			$searchResult .= '{"firstName" : "' . $row["FirstName"]. '", "lastName" : "' . $row["LastName"]. '", "phone" : "' . $row["Phone"]. '", "email" : "' . $row["Email"]. '", "userId" : "' . $row["UserID"].'", "id" : "' . $row["ID"]. '"}';
		}

		//We found no contact matching our search
		if($searchCount == 0){
			returnError(CODE_NOT_FOUND,"{$inData['firstName']} {$inData['lastName']} not found");
		}
		//Return the list of Contacts matched
		returnJsonString($searchResult);
	}catch(mysqli_sql_exception $ex){
		returnError(CODE_SERVER_ERROR, $ex->getMessage());
	} finally {
		conn->close();
	}
?>
