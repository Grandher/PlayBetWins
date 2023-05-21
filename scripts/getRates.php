<?php
    require "connect.php";

    $gameID = $_POST["GameID"];

    $result = array();
    if ($gameID == 0) {
        $query = $DBH->prepare("SELECT Login, AVG(ScoreElo) AS Score,
                            Wins, Losses, Draws FROM Rating
                            JOIN Account ON PlayerID = PeopleID
                            GROUP BY PlayerID ORDER BY Score DESC LIMIT 10");
        $query->execute();
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($result, $row);
        }
    } else {
        $query = $DBH->prepare("SELECT Login, ScoreElo AS Score,
                                Wins, Losses, Draws FROM Rating
                                JOIN Account ON PlayerID = PeopleID
                                WHERE GameID = :gameID
                                ORDER BY Score DESC LIMIT 10");
        $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
        $query->execute();
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($result, $row);
        }
    }
    echo json_encode($result);
?>