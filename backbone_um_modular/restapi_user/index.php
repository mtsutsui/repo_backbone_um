<?php

require 'Slim/Slim.php';
$app = new Slim();

//mas 11/19 copied from index.php for angular_tdavis folder
//$app->get('/users', 'getUsers');
$app->get('/users', function() use ($app) {
	$req = $app->request();
	$searchval = $req->get('username');
	$sql = '';
	//$searchVal = $_GET['username'];  //this should work if not using Slim
	if ($searchval == ''){
		$sql = "select * FROM user ORDER BY firstname";
	}else{
		$sql = "select * FROM user where firstname LIKE " . "'" . $searchval . "%'" ;
	}

	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		// echo '{"user": ' . json_encode($users) . '}';
		echo json_encode($users);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
});

$app->get('/users/:id',	'getUser');
//$app->get('/wines/search/:query', 'findByName');
$app->post('/users', 'addUser');
$app->put('/users/:id', 'updateUser');
$app->delete('/users/:id', 'deleteUser');

$app->run();

/*
//mas no longer need this
function getUsers() {
	$sql = "select * FROM user ORDER BY firstname";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$users = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		// echo '{"user": ' . json_encode($users) . '}';
		echo json_encode($users);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}
*/

function getUser($id) {
	$sql = "SELECT * FROM user WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$user = $stmt->fetchObject();  
		$db = null;
		echo json_encode($user); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function addUser() {
	//error_log('addUser\n', 3, '/var/tmp/php.log');  //mas this causes internal error ... directory not found??? os commented out
	$request = Slim::getInstance()->request();
	$user = json_decode($request->getBody());
	$sql = "INSERT INTO user (firstname, lastname, age) VALUES (:firstname, :lastname, :age)";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("firstname", $user->firstname);
		$stmt->bindParam("lastname", $user->lastname);
		$stmt->bindParam("age", $user->age);
		$stmt->execute();
		$user->id = $db->lastInsertId();
		$db = null;
		echo json_encode($user); 
	} catch(PDOException $e) {
		//error_log($e->getMessage(), 3, '/var/tmp/php.log');  //mas comment out
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function updateUser($id) {
	$request = Slim::getInstance()->request();
	$body = $request->getBody();
	$user = json_decode($body);
	$sql = "UPDATE user SET firstname=:firstname, lastname=:lastname, age=:age WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("firstname", $user->firstname);
                $stmt->bindParam("lastname", $user->lastname);
		$stmt->bindParam("age", $user->age);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
		echo json_encode($user); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function deleteUser($id) {
	$sql = "DELETE FROM user WHERE id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$db = null;
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

/*
function findByName($query) {
	$sql = "SELECT * FROM wine WHERE UPPER(name) LIKE :query ORDER BY name";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$wines = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($wines);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}
*/

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	//$dbpass="";
        $dbpass="billevans";  //mas 
	//$dbname="cellar";
        $dbname="tdavis";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>