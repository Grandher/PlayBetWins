<?php
session_start();
if (isset($_SESSION['id']) and isset($_POST['game'])) {
    require "connect.php"; // Подключение к базе данных

    $id = $_SESSION['id'];
    $game = $_POST['game'];

    // Запрос для поиска уже существующего матча в данной игре
    $query = $DBH->prepare("SELECT MatchID, Time, datetime(CURRENT_TIMESTAMP, '+4 hours') AS CurrentTime
                            FROM Match WHERE Status = 0 AND GameID = :game AND (PlayerID_1 = :id OR PlayerID_2 = :id);");
    $query->bindParam("id", $id, PDO::PARAM_INT);
    $query->bindParam("game", $game, PDO::PARAM_INT);
    $query->execute();

    if ($match = $query->fetch(PDO::FETCH_ASSOC)) {
        $time = strtotime($match['Time']);
        $currentTime = strtotime($match['CurrentTime']);

        $interval = $currentTime - $time;

        // Если разница больше 600 секунд (10 минут), завершаем матч ничьёй
        if ($interval > 600) {
            $matchID = $match['MatchID'];
            $updateQuery = $DBH->prepare("UPDATE Match SET Status = 2 WHERE MatchID = :matchID;");
            $updateQuery->bindParam(':matchID', $matchID, PDO::PARAM_INT);
            $updateQuery->execute();
        } else {
            exit("208"); // Иначе возвращаем игрока в матч
        }
    }

    // Запрос для поиска уже существующей очереди в данной игре
    $query = $DBH->prepare("SELECT COUNT(*) AS Amount FROM Matching WHERE GameID = :game AND PlayerID = :id;");
    $query->bindParam("id", $id, PDO::PARAM_INT);
    $query->bindParam("game", $game, PDO::PARAM_INT);
    $query->execute();
    $amount = $query->fetch(PDO::FETCH_ASSOC)["Amount"];
    if ($amount > 0) {
        exit("201");
    }


    // Проверка существующих матчей во всех играх
    $query = $DBH->prepare("SELECT SUM(number) AS Count FROM (
                        SELECT COUNT(*) AS number FROM Matching WHERE PlayerID = :id
                        UNION
                        SELECT COUNT(*) AS number FROM Match WHERE Status = 0 AND (PlayerID_1 = :id OR PlayerID_2 = :id)
                    );");
    $query->bindParam("id", $id, PDO::PARAM_INT);
    $query->execute();
    $count = $query->fetch(PDO::FETCH_ASSOC)["Count"];

    if ($count == 0) {
        // Если у игрока нет активных матчей, добавление его в очередь
        $query = $DBH->prepare("INSERT INTO Matching VALUES (:id,:game);");
        $query->bindParam("id", $id, PDO::PARAM_INT);
        $query->bindParam("game", $game, PDO::PARAM_INT);
        try {
            $result = $query->execute();
            echo '201'; // Успешное добавление в очередь
        } catch (PDOException $e) {
            echo '500'; // Ошибка при добавлении
        }
    } else {
        echo "402"; // Игрок уже находится в активном матче
    }
} else {
    echo "401"; // Пользователь не аутентифицирован
}
