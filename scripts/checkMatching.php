<?php
session_start();
if (isset($_SESSION['id']) or isset($_POST['game'])) {
    require "connect.php"; // Подключение к базе данных

    $id = $_SESSION['id'];
    $game = $_POST['game'];

    // Запрос для подсчета активных матчей, в которых участвует игрок
    $query = $DBH->prepare("SELECT COUNT(*) AS Count FROM Match WHERE Status = 0 AND GameID = :game AND (PlayerID_1 = :id OR PlayerID_2 = :id);");
    $query->bindParam("id", $id, PDO::PARAM_INT);
    $query->bindParam("game", $game, PDO::PARAM_INT);
    $query->execute();
    $count = $query->fetch(PDO::FETCH_ASSOC)["Count"];

    if ($count > 0) {
        echo "200"; // У игрока есть активные матчи в этой игре
    } else {
        // Запрос для получения списка игроков, находящихся в очереди для этой игры
        $query = $DBH->prepare("SELECT PlayerID FROM Matching WHERE GameID = :game;");
        $query->bindParam("game", $game, PDO::PARAM_INT);
        $query->execute();

        $player_list = array();
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($player_list, $row["PlayerID"]);
        }

        if (count($player_list) > 1) {
            // Если в очереди есть хотя бы два игрока, создается новый матч
            $query = $DBH->prepare("INSERT INTO Match (PlayerID_1, PlayerID_2, GameID, Status) VALUES (:id1, :id2, :game, 0);");
            $query->bindParam("id1", $player_list[0], PDO::PARAM_INT);
            $query->bindParam("id2", $player_list[1], PDO::PARAM_INT);
            $query->bindParam("game", $game, PDO::PARAM_INT);
            $query->execute();

            // Удаление игроков из очереди
            $query = $DBH->prepare("DELETE FROM Matching WHERE PlayerID in (:id1, :id2);");
            $query->bindParam("id1", $player_list[0], PDO::PARAM_INT);
            $query->bindParam("id2", $player_list[1], PDO::PARAM_INT);
            $query->execute();

            echo "200"; // Успешное создание матча
        } else {
            echo "400"; // Недостаточно игроков в очереди
        }
    }
} else {
    echo "401"; // Пользователь не аутентифицирован
}
