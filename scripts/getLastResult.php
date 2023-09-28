<?php
    session_start();
    if (isset($_SESSION['id'])) {
        $id = $_SESSION['id'];
        require "connect.php";

        $query = $DBH->prepare("SELECT Login, Status, Name FROM (
                                    SELECT PlayerID_2 AS PeopleID, 'WIN' AS Status, GameID, Time FROM Match
                                        WHERE PlayerID_1 = :id AND Status = 1
                                    UNION SELECT PlayerID_1 AS PeopleID, 'LOS' AS Status, GameID, Time FROM Match
                                        WHERE PlayerID_2 = :id AND Status = 1
                                    UNION SELECT PlayerID_2 AS PeopleID, 'DRAW' AS Status, GameID, Time FROM Match
                                        WHERE PlayerID_1 = :id AND Status = 2
                                    UNION SELECT PlayerID_1 AS PeopleID, 'DRAW' AS Status, GameID, Time FROM Match
                                        WHERE PlayerID_2 = :id AND Status = 2
                                    ORDER BY Time DESC LIMIT 5)
                                JOIN Account USING (PeopleID)
                                JOIN Games USING (GameID);");
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