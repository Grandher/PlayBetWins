<?php
session_start();
if (isset($_SESSION['id'])) {
    $id = $_SESSION['id'];
    require "connect.php";

    $password = $_POST['password'];
    $newPassword = $_POST['newPassword'];
    $password_hash = password_hash($newPassword, PASSWORD_DEFAULT);

    $query = $DBH->prepare("SELECT Password FROM Account WHERE PeopleID = :id");
    $query->bindParam("id", $id, PDO::PARAM_INT);
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if (password_verify($password, $result['Password'])) {
        $query = $DBH->prepare("UPDATE Account SET Password = :password WHERE PeopleID = :id");
        $query->bindParam("password", $password_hash, PDO::PARAM_STR);
        $query->bindParam("id", $id, PDO::PARAM_INT);
        try {
            $result = $query->execute();
            echo '200';
        } catch (PDOException $e) {
            echo '500';
        }
    } else {
        echo 'Неверный пароль';
    }
}
