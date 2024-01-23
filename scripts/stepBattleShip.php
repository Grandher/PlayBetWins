<?php
session_start();
if (isset($_SESSION['id']) and isset($_POST['matchID'])) {
    require "connect.php"; // Подключение к базе данных

    $id = $_SESSION['id'];
    $matchID = $_POST['matchID'];
    $boardState = $_POST['boardState'];
    $enemyField = $_POST['EnemyField'];
    $whoseMove = $_POST['whoseMove'];
    $player = $_POST['Player'];
    $move = $_POST['move'];

    $checkQuery = $DBH->prepare("SELECT * FROM Match WHERE MatchID = :matchID;");
    $checkQuery->bindParam("matchID", $matchID, PDO::PARAM_INT);
    $checkQuery->execute();
    $match = $checkQuery->fetch(PDO::FETCH_ASSOC);

    if ($move == 1) {
        if ($match['PlayerID_1'] == $player) {
            $query = $DBH->prepare("UPDATE 'BattleShip' SET TimeLastMove = datetime(CURRENT_TIMESTAMP, '+4 hours'), Field1First = :boardState ,Field2Second = :EnemyField WHERE MatchID = :matchID;");
            $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
            $query->bindParam("boardState", $boardState, PDO::PARAM_STR);
            $query->bindParam("EnemyField", $enemyField, PDO::PARAM_STR);
            try {
                $result = $query->execute();
                echo '201';
            } catch (PDOException $e) {
                echo '500';
            }
        } else {
            $query = $DBH->prepare("UPDATE 'BattleShip' SET TimeLastMove = datetime(CURRENT_TIMESTAMP, '+4 hours'), Field1Second = :boardState, Field2First = :EnemyField WHERE MatchID = :matchID;");
            $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
            $query->bindParam("boardState", $boardState, PDO::PARAM_STR);
            $query->bindParam("EnemyField", $enemyField, PDO::PARAM_STR);
            try {
                $result = $query->execute();
                echo '201';
            } catch (PDOException $e) {
                echo '500';
            }
        }
    } else {
        if ($match['PlayerID_1'] == $player) {
            $query = $DBH->prepare("UPDATE 'BattleShip' SET TimeLastMove = datetime(CURRENT_TIMESTAMP, '+4 hours'), Field1First = :boardState ,Field2Second = :EnemyField, whoseMove = :whoseMove WHERE MatchID = :matchID;");
            $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
            $query->bindParam("whoseMove", $whoseMove, PDO::PARAM_INT);
            $query->bindParam("boardState", $boardState, PDO::PARAM_STR);
            $query->bindParam("EnemyField", $enemyField, PDO::PARAM_STR);
            try {
                $result = $query->execute();
                echo '201';
            } catch (PDOException $e) {
                echo '500';
            }
        } else {
            $query = $DBH->prepare("UPDATE 'BattleShip' SET TimeLastMove = datetime(CURRENT_TIMESTAMP, '+4 hours'), Field1Second = :boardState, Field2First = :EnemyField, whoseMove = :whoseMove WHERE MatchID = :matchID;");
            $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
            $query->bindParam("whoseMove", $whoseMove, PDO::PARAM_INT);
            $query->bindParam("boardState", $boardState, PDO::PARAM_STR);
            $query->bindParam("EnemyField", $enemyField, PDO::PARAM_STR);
            try {
                $result = $query->execute();
                echo '201';
            } catch (PDOException $e) {
                echo '500';
            }
        }
    }
} else {
    echo "401"; // Пользователь не аутентифицирован
}
