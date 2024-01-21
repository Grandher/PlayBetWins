<?php
    session_start();
    if (isset($_SESSION['id'])) {
        $id = $_SESSION['id'];
        require "connect.php";

        $query = $DBH->prepare("SELECT GameID, Title, Name
                                FROM (
                                    SELECT GameID, Title, Name, Time,
                                        ROW_NUMBER() OVER (PARTITION BY GameID ORDER BY Time DESC) as rn
                                    FROM Match 
                                    JOIN Games USING (GameID)
                                    WHERE PlayerID_1 = :id OR PlayerID_2 = :id
                                ) AS ranked
                                WHERE rn = 1
                                ORDER BY Time DESC
                                LIMIT 4;");
        $query->bindParam("id", $id, PDO::PARAM_INT);
        $query->execute();
        $result = array();
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($result, $row);
        }
        echo json_encode($result);
    } else {
        echo "returnToIndex";
    }
?>