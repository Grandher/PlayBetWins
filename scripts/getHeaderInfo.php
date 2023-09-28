<?php
    session_start();
    if (isset($_SESSION['id'])) {
        require "connect.php";
        $id = $_SESSION['id'];

        $query = $DBH->prepare("SELECT Login, Balance, Avatar, Reward, CheckmarkDate FROM Account
                                JOIN Checkmark ON CheckmarkDay = NumberDay
                                WHERE PeopleID=:id");
        $query->bindParam("id", $id, PDO::PARAM_STR);
        $query->execute();
        $result = $query->fetch(PDO::FETCH_ASSOC);

        $query = $DBH->prepare("SELECT SUM(Wins) AS Wins, SUM(Losses) AS Losses, SUM(Draws) AS Draws
                                FROM Rating GROUP BY PlayerID HAVING PlayerID = :id");
        $query->bindParam("id", $id, PDO::PARAM_STR);
        $query->execute();
        if ($rating = $query->fetch(PDO::FETCH_ASSOC)) {
            $result += $rating;
        } else {
            $result += array(
                "Wins" => 0,
                "Losses" => 0,
                "Draws" => 0
            );
        }

        echo json_encode($result);
    } else {
        echo "NotSession";
    }
?>