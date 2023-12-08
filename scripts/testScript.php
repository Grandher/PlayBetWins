<?php
session_start();
if (isset($_SESSION['id']) and isset($_POST['game'])) {
    require "connect.php"; // Подключение к базе данных

    $id = $_SESSION['id'];
    $game = $_POST['game'];

    // Запрос для поиска уже существующего матча в данной игре
    // Проверка существующих матчей во всех играх
    $query = $DBH->prepare("SELECT SUM(number) AS Count FROM (
                        SELECT COUNT(*) AS number FROM Matching WHERE PlayerID = 28
                        UNION
                        SELECT COUNT(*) AS number FROM Match WHERE Status = 0 AND (PlayerID_1 = 28 OR PlayerID_2 = 29)
                    );");

    $query->execute();




    echo $query->rowCount();


    $query = $DBH->prepare("SELECT SUM(number) AS Count FROM (
                        SELECT COUNT(*) AS number FROM Matching WHERE PlayerID = :id
                        UNION
                        SELECT COUNT(*) AS number FROM Match WHERE Status = 0 AND (PlayerID_1 = :id OR PlayerID_2 = :id)
                    );");
    $query->bindParam("id", $id, PDO::PARAM_INT);
    $query->execute();

    $count = $query->fetch(PDO::FETCH_ASSOC)["Count"];
    if ($count == 0) {
        echo 1;
    }else{
    echo 2;}
}