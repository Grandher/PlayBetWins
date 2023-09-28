<?php
session_start();
if (isset($_SESSION['id']) or isset($_POST['MatchID'])) {
    require "connect.php"; // Подключение к базе данных

    $id = $_SESSION['id'];
    $MatchID = $_POST['MatchID'];
    $GameID = $_POST["GameID"];
    $Losser = $_POST["Losser"];
    $Winner = $_POST["Winner"];
    $isDraw = $_POST["isDraw"];

    $query = $DBH->prepare("SELECT Status FROM Match WHERE MatchID = :MatchID;");
    $query->bindParam("MatchID", $MatchID, PDO::PARAM_INT);
    $query->execute();
    if ($query->fetch(PDO::FETCH_ASSOC)["Status"] != 0) {
        exit("Уже сыграно");
    }

    if ($isDraw == 'true') {
        // Обработка ничьей
        // Увеличение счетчика ничьих для обоих игроков
        $query = $DBH->prepare("UPDATE Rating SET Draws = Draws + 1 WHERE GameID = :gameID AND PlayerID IN (:pl1, :pl2);");
        $query->bindParam("gameID", $GameID, PDO::PARAM_INT);
        $query->bindParam("pl1", $Winner, PDO::PARAM_INT);
        $query->bindParam("pl2", $Losser, PDO::PARAM_INT);
        $query->execute();

        // Добавление записей в рейтинг, если их нет
        $query = $DBH->prepare("INSERT INTO Rating (PlayerID, GameID, Draws)
                                SELECT :playerID, :gameID, 1 WHERE NOT EXISTS
                                (SELECT 1 from Rating WHERE PlayerID = :playerID AND GameID = :gameID);");
        $query->bindParam("gameID", $GameID, PDO::PARAM_INT);
        $query->bindParam("playerID", $Winner, PDO::PARAM_INT);
        $query->execute();

        $query = $DBH->prepare("INSERT INTO Rating (PlayerID, GameID, Draws)
                                SELECT :playerID, :gameID, 1 WHERE NOT EXISTS
                                (SELECT 1 from Rating WHERE PlayerID = :playerID AND GameID = :gameID);");
        $query->bindParam("gameID", $GameID, PDO::PARAM_INT);
        $query->bindParam("playerID", $Losser, PDO::PARAM_INT);
        $query->execute();

        // Установка статуса матча как завершенного
        $query = $DBH->prepare("UPDATE Match SET Status = 2 WHERE MatchID = :MatchID;");
        $query->bindParam("MatchID", $MatchID, PDO::PARAM_INT);
        try {
            $result = $query->execute();
            exit("201");
        } catch (PDOException $e) {
            exit("500");
        }
    }

    // Если матч не является ничьей распределить очки и ставки
    require "simulationGame.php";
    gameSimulation($DBH, $Winner, $Losser, $GameID);

    // Обновление статуса матча и игроков
    $query = $DBH->prepare("UPDATE Match SET PlayerID_1 = :Winner, PlayerID_2 = :Losser, Status = 1 WHERE MatchID = :MatchID;");
    $query->bindParam("MatchID", $MatchID, PDO::PARAM_INT);
    $query->bindParam("Winner", $Winner, PDO::PARAM_INT);
    $query->bindParam("Losser", $Losser, PDO::PARAM_INT);
    try {
        $result = $query->execute();
        echo '201';
    } catch (PDOException $e) {
        echo '500';
    }
} else {
    echo "401"; // Пользователь не аутентифицирован
}
