<?php
session_start();
if (isset($_SESSION['id']) and isset($_POST['matchID'])) {
    require "connect.php"; // Подключение к базе данных

    $id = $_SESSION['id'];
    $matchID = $_POST['matchID'];
    $playerOne = $_POST['playerOne'];
    $playerTwo = $_POST['playerTwo'];

    // Запрос об окончании игры
    $query = $DBH->prepare("SELECT * FROM Match WHERE MatchID = :matchID;");
    $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
    $query->execute();
    $match = $query->fetch(PDO::FETCH_ASSOC);
    if ($match['Status'] == 1) {
        $query = $DBH->prepare("DELETE FROM 'tic-tac-toe' WHERE MatchID = :matchID;");
        $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
        $query->execute();
        exit(json_encode($match));
    }

    // Запрос на наличие игры
    $query = $DBH->prepare("SELECT * FROM 'tic-tac-toe' WHERE MatchID = :matchID;");
    $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
    $query->execute();
    $line = $query->fetch(PDO::FETCH_ASSOC);

    if ($line) {
        echo json_encode($line);
    } else {
        // Случайно определяем кто крестик
        $whoCross = rand(0, 1) == 1 ? $playerOne : $playerTwo;
        // Случайно определяем чей ход
        $whoseMove = rand(0, 1) == 1 ? $playerOne : $playerTwo;

        $query = $DBH->prepare("INSERT INTO 'tic-tac-toe' (MatchID, whoCross, whoseMove) VALUES (:matchID,:whoCross,:whoseMove);");
        $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
        $query->bindParam("whoCross", $whoCross, PDO::PARAM_INT);
        $query->bindParam("whoseMove", $whoseMove, PDO::PARAM_INT);
        $query->execute();

        $result = array(
            "whoCross" => $whoCross,
            "whoseMove" => $whoseMove,
            "Field" => "NNNNNNNNN"
        );
        echo json_encode($result);
    }
} else {
    echo "401"; // Пользователь не аутентифицирован
}
