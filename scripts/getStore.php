<?php
    require "connect.php";

    $query = $DBH->prepare("SELECT * FROM Store");
    $query->execute();
    $store = array();
    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        array_push($store, $row);
    }

    $peopleitems = array();
    session_start();
    if (isset($_SESSION['id'])) {
        $id = $_SESSION['id'];
        $query = $DBH->prepare("SELECT Type, ProductID FROM ProductAccount
                                JOIN Store USING (ProductID)
                                WHERE PeopleID = :id");
        $query->bindParam("id", $id, PDO::PARAM_INT);
        $query->execute();
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($peopleitems, $row);
        }
    }

    echo json_encode(array("shop"=>$store, "peopleitems"=>$peopleitems));

?>