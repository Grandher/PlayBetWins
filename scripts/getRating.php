<?php
    require "connect.php";

    $query = $DBH->prepare("SELECT Login, AVG(ScoreElo) AS Score, Name FROM Rating
                            JOIN Account ON PlayerID = PeopleID
                            LEFT JOIN Store ON Avatar = ProductID
                            GROUP BY PlayerID ORDER BY Score DESC LIMIT 5");
    $query->execute();
    $result = array();
    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        array_push($result, $row);
    }
    echo json_encode($result);
?>