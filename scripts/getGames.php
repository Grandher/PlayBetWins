<?php
    require "connect.php";

    $query = $DBH->prepare("SELECT * FROM Games");
    $query->execute();
    $result = array();
    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        array_push($result, $row);
    }
    echo json_encode($result);
?>