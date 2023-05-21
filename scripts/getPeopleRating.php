<?php
    session_start();
    if (isset($_SESSION['id'])) {
        $id = $_SESSION['id'];
        require "connect.php";

        $query = $DBH->prepare("SELECT * FROM (
                                SELECT Login, SUM(ScoreElo) AS Score, ROW_NUMBER() OVER(ORDER BY SUM(ScoreElo) DESC) AS Rank 
                                    FROM Rating 
                                    JOIN Account ON PlayerID = PeopleID 
                                    GROUP BY PlayerID 
                                    ORDER BY Score DESC)
                                    LIMIT (SELECT NumberP FROM (
                                    SELECT PlayerID AS CurrentP, ROW_NUMBER() OVER(ORDER BY SUM(ScoreElo) DESC) AS NumberP
                                    FROM Rating GROUP BY PlayerID) WHERE CurrentP = :id)-3,5");
        $query->bindParam("id", $id, PDO::PARAM_INT);
        $query->execute();
        $result = array();
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($result, $row);
        }
        if (count($result) < 5) {
            $query = $DBH->prepare("SELECT * FROM
                                    (SELECT Login, SUM(ScoreElo) AS Score, ROW_NUMBER() OVER(ORDER BY SUM(ScoreElo) DESC) AS Rank 
                                        FROM Rating JOIN Account ON PlayerID = PeopleID 
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
?>