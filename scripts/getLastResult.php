<?php
    session_start();
    if (isset($_SESSION['id'])) {
        $id = $_SESSION['id'];
        require "connect.php";

        $query = $DBH->prepare("SELECT  Name, Login, Status FROM (
                                    SELECT Name, Login, 'WIN' AS Status, Time FROM Match
                                        JOIN Account ON PlayerID_2 = PeopleID
                                        JOIN Games USING (GameID)
                                        WHERE PlayerID_1 = :id AND Status = 1
                                    UNION SELECT Name, Login, 'LOS' AS Status, Time FROM Match
                                        JOIN Account ON PlayerID_1 = PeopleID
                                        JOIN Games USING (GameID)
                                        WHERE PlayerID_2 = :id AND Status = 1
                                    ORDER BY Time DESC LIMIT 5)");
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