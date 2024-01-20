<?php
session_start();
if (isset($_SESSION['id'])) {
    $id = $_SESSION['id'];
    require "connect.php";

    $query = $DBH->prepare("SELECT * FROM (
                            SELECT Login, AVG(ScoreElo) AS Score, ROW_NUMBER() OVER(ORDER BY AVG(ScoreElo) DESC) AS Rank, Name 
                                FROM Rating 
                                JOIN Account ON PlayerID = PeopleID 
                                LEFT JOIN Store ON Avatar = ProductID
                                GROUP BY PlayerID 
                                ORDER BY Score DESC)
                                LIMIT (SELECT NumberP FROM (
                                    SELECT PlayerID AS CurrentP, ROW_NUMBER() OVER(ORDER BY AVG(ScoreElo) DESC) AS NumberP
                                    FROM Rating GROUP BY PlayerID) WHERE CurrentP = :id)-4,5");
    $query->bindParam("id", $id, PDO::PARAM_INT);
    $result = array();

    try {
        $query->execute();
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($result, $row);
        }
    } catch (PDOException $e) {
        ;
    }
    
    if (count($result) < 5) {
        $query = $DBH->prepare("SELECT * FROM
                                (SELECT Login, AVG(ScoreElo) AS Score, ROW_NUMBER() OVER(ORDER BY AVG(ScoreElo) DESC) AS Rank, Name 
                                    FROM Rating JOIN Account ON PlayerID = PeopleID
                                    LEFT JOIN Store ON Avatar = ProductID 
                                    GROUP BY PlayerID ORDER BY Score ASC LIMIT 5)
                                ORDER BY Rank ASC");
        $query->execute();
        $result = array();
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($result, $row);
        }
    }
    echo json_encode($result);
} else {
    echo "returnToIndex";
}
