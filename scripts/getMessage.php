<?php
session_start();
if (isset($_SESSION['id']) and isset($_POST["MatchID"])) {
    require "connect.php";

    $match = $_POST["MatchID"];

    $query = $DBH->prepare("SELECT AuthorID, Content, 'S2'.Name AS Smile, Time, 'S1'.Name AS Avatar FROM Messages 
                            JOIN Account ON AuthorID = PeopleID
                            LEFT JOIN Store AS 'S1' ON Avatar = 'S1'.ProductID
                            LEFT JOIN Store AS 'S2' ON SmileID = 'S2'.ProductID
                            WHERE MatchID = :match
                            ORDER BY Time");
    $query->bindParam("match", $match, PDO::PARAM_INT);
    $query->execute();
    $result = array();
    while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
        array_push($result, $row);
    }
    echo json_encode($result);
} else {
    echo "returnToIndex";
}
