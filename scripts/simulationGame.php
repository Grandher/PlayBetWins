<?php
function gameSimulation($DBH, $winner, $losser, $gameID)
{
    /*Пересчёт побед и очков ELO*/

    //Получаем число очков человека 1
    $query = $DBH->prepare("SELECT ScoreElo FROM Rating WHERE PlayerID = :winner AND GameID = :gameID");
    $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
    $query->bindParam("winner", $winner, PDO::PARAM_INT);
    $query->execute();
    $winner_score = $query->fetch(PDO::FETCH_ASSOC);
    if (isset($winner_score['ScoreElo'])) { //Если победы есть прибавляем 1, иначе добавляем первую победу в таблицу
        $query = $DBH->prepare("UPDATE Rating SET Wins = Wins + 1 WHERE GameID = :gameID AND PlayerID = :winner");
    } else {
        $query = $DBH->prepare("INSERT INTO Rating (PlayerID, GameID, Wins) VALUES (:winner, :gameID, 1)");
        $winner_score["ScoreElo"] = 1000;
    }
    $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
    $query->bindParam("winner", $winner, PDO::PARAM_INT);
    $query->execute();
    //И человека 2
    $query = $DBH->prepare("SELECT ScoreElo FROM Rating WHERE PlayerID = :losser AND GameID = :gameID");
    $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
    $query->bindParam("losser", $losser, PDO::PARAM_INT);
    $query->execute();
    $losser_score = $query->fetch(PDO::FETCH_ASSOC);
    if (isset($losser_score['ScoreElo'])) {
        $query = $DBH->prepare("UPDATE Rating SET Losses = Losses + 1 WHERE GameID = :gameID AND PlayerID = :losser");
    } else {
        $query = $DBH->prepare("INSERT INTO Rating (PlayerID, GameID, Losses) VALUES (:losser, :gameID, 1)");
        $losser_score["ScoreElo"] = 1000;
    }
    $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
    $query->bindParam("losser", $losser, PDO::PARAM_INT);
    $query->execute();

    //Рассчёт очков ELO
    $E_a = 1 / (1 + pow(10, (abs($winner_score["ScoreElo"] - $losser_score["ScoreElo"]) / 400)));
    $winner_rating = $winner_score["ScoreElo"] + 40 * (1 - $E_a);
    $losser_rating = $losser_score["ScoreElo"] - 40 * $E_a;

    //Обновление данных
    $query = $DBH->prepare("UPDATE Rating SET ScoreElo = :rating WHERE GameID = :gameID AND PlayerID = :winner");
    $query->bindParam("rating", $winner_rating, PDO::PARAM_INT);
    $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
    $query->bindParam("winner", $winner, PDO::PARAM_INT);
    $query->execute();

    $query = $DBH->prepare("UPDATE Rating SET ScoreElo = :rating WHERE GameID = :gameID AND PlayerID = :losser");
    $query->bindParam("rating", $losser_rating, PDO::PARAM_INT);
    $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
    $query->bindParam("losser", $losser, PDO::PARAM_INT);
    $query->execute();

    /*Ставки*/

    //Узнаём есть ли ставки на первого игрока
    $query = $DBH->prepare("SELECT COUNT(*) AS result FROM Bets WHERE Status = 0 AND PlayerID = :player AND GameID = :gameID");
    $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
    $query->bindParam("player", $winner, PDO::PARAM_INT);
    $query->execute();
    $p1_bet = $query->fetch(PDO::FETCH_ASSOC);

    //Узнаём есть ли ставки на второго игрока
    $query = $DBH->prepare("SELECT COUNT(*) AS result FROM Bets WHERE Status = 0 AND PlayerID = :player AND GameID = :gameID");
    $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
    $query->bindParam("player", $losser, PDO::PARAM_INT);
    $query->execute();
    $p2_bet = $query->fetch(PDO::FETCH_ASSOC);

    //Если на обоих были ставки - распределяем пул на победителей
    if ($p1_bet['result'] > 0 and $p2_bet['result'] > 0) {
        //Получаем все несыгранные ставки на этих двух
        $query = $DBH->prepare("SELECT * FROM Bets WHERE Status = 0 AND PlayerID = :player AND GameID = :gameID");
        $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
        $query->bindParam("player", $winner, PDO::PARAM_INT);
        $query->execute();
        $p1_arr = array();
        $p1_Sum = 0;
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($p1_arr, $row);
            $p1_Sum += $row["Sum"];
        }

        $query = $DBH->prepare("SELECT * FROM Bets WHERE Status = 0 AND PlayerID = :player AND GameID = :gameID");
        $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
        $query->bindParam("player", $losser, PDO::PARAM_INT);
        $query->execute();
        $p2_arr = array();
        $p2_Sum = 0;
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($p2_arr, $row);
            $p2_Sum += $row["Sum"];
        }
        //Распределяем выигрыш

        for ($i = 0; $i < count($p1_arr); $i++) {
            $prize = $p1_arr[$i]['Sum'] * $p2_Sum / $p1_Sum + $p1_arr[$i]['Sum'];
            $betterID = $p1_arr[$i]["BettorID"];
            $query = $DBH->prepare("UPDATE Account SET Balance = Balance + :prize WHERE PeopleID = :betterID");
            $query->bindParam("prize", $prize, PDO::PARAM_INT);
            $query->bindParam("betterID", $betterID, PDO::PARAM_INT);
            $query->execute();
        }
        //Отмечаем ставки как сыгранные
        $query = $DBH->prepare("UPDATE Bets SET Status = 1 WHERE PlayerID IN (:pl1, :pl2)");
        $query->bindParam("pl1", $winner, PDO::PARAM_INT);
        $query->bindParam("pl2", $losser, PDO::PARAM_INT);
        $query->execute();
    }
}
