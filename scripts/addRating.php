<?php
    require "connect.php";

    $people = rand(1,11);
    $game = rand(1,5);
    $s = rand(500,1500);
    $w = rand(1,50);
    $l = rand(1,50);
    $d = rand(1,50);

    $query = $DBH->prepare("INSERT INTO Rating VALUES (:people,:game,:score,:w,:l,:d)");
    $query->bindParam("people", $people, PDO::PARAM_INT);
    $query->bindParam("game", $game, PDO::PARAM_INT);
    $query->bindParam("score", $s, PDO::PARAM_INT);
    $query->bindParam("w", $w, PDO::PARAM_INT);
    $query->bindParam("l", $l, PDO::PARAM_INT);
    $query->bindParam("d", $d, PDO::PARAM_INT);

    try {
        $result = $query->execute();
        echo 'Ok';
    } catch (PDOException $e) {
        echo 'Неверные данные';
    }
?>