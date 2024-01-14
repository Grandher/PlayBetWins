<?php
session_start();
if (isset($_SESSION['id'])) {
    $id = $_SESSION['id'];
    require "connect.php";

    $avatar = $_POST["Avatar"];

    $query = $DBH->prepare("UPDATE Account SET Avatar = :avatar WHERE PeopleID = :id");
    $query->bindParam("avatar", $avatar, PDO::PARAM_INT);
    $query->bindParam("id", $id, PDO::PARAM_INT);
    try {
        $result = $query->execute();
        echo '200';
    } catch (PDOException $e) {
        echo '500';
    }
}
