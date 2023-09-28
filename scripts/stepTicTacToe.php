<?php
session_start();
if (isset($_SESSION['id']) and isset($_POST['matchID'])) {
    require "connect.php"; // Подключение к базе данных

    $id = $_SESSION['id'];
    $matchID = $_POST['matchID'];
    $boardState = $_POST['boardState'];
    $whoseMove = $_POST['whoseMove'];

    // Запрос на наличие игры
    $query = $DBH->prepare("UPDATE 'tic-tac-toe' SET TimeLastMove = CURRENT_TIMESTAMP, Field = :boardState, whoseMove = :whoseMove WHERE MatchID = :matchID;");
    $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
    $query->bindParam("whoseMove", $whoseMove, PDO::PARAM_INT);
    $query->bindParam("boardState", $boardState, PDO::PARAM_STR);
    try {
        $result = $query->execute();
        echo '201';
    } catch (PDOException $e) {
        echo '500';
    }
} else {
    echo "401"; // Пользователь не аутентифицирован
}
