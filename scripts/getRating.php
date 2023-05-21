<?php
    require "connect.php";

    $query = $DBH->prepare("SELECT Login, SUM(ScoreElo) AS Score FROM Rating
                            JOIN Account ON PlayerID = PeopleID
                            GROUP BY PlayerID ORDER BY Score DESC LIMIT 5");
    $query->execute();
    $result = array();
    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        array_push($result, $row);
    }
    echo json_encode($result);
?>