<?php
    require "connect.php";

    $p1 = rand(1,11);
    $p2 = rand(1,11);
    if ($p1 != $p2) {
        $game = rand(1,5);

        $query = $DBH->prepare("INSERT INTO Match (PlayerID_1,PlayerID_2,GameID,Status) VALUES (:p1,:p2,:game,1)");
        $query->bindParam("p1", $p1, PDO::PARAM_INT);
        $query->bindParam("p2", $p2, PDO::PARAM_INT);
        $query->bindParam("game", $game, PDO::PARAM_INT);

        try {
            $result = $query->execute();
            echo 'Ok';
        } catch (PDOException $e) {
            echo 'Неверные данные';
        }
    }
?>