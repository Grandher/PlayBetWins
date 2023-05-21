<?php
    session_start();
    if (isset($_SESSION['id'])) {
        $id = $_SESSION['id'];
        require "connect.php";

        $query = $DBH->prepare("SELECT Name, Login, Sum FROM Bets
                                JOIN Games USING (GameID)
                                JOIN Account ON PlayerID = PeopleID
                                WHERE BettorID = :id ORDER BY Time DESC LIMIT 5");
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