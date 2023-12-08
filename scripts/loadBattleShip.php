<?php

function placeShips($board, $shipLengths)
{
    foreach ($shipLengths as $length) {
        $placed = false;
        while (!$placed) {
            $x = rand(0, count($board) - 1);
            $y = rand(0, count($board) - 1);
            $dir = rand(0, 1);
            if ($dir == 0) {
                if ($y + $length <= count($board) && !hasShipsInArea($board, $x, $y, $x, $y + $length - 1)) {
                    for ($i = $y; $i < $y + $length; $i++) {
                        $board[$x][$i] = 'ship';
                    }
                    $placed = true;
                }
            } else {
                if ($x + $length <= count($board) && !hasShipsInArea($board, $x, $y, $x + $length - 1, $y)) {
                    for ($i = $x; $i < $x + $length; $i++) {
                        $board[$i][$y] = 'ship';
                    }
                    $placed = true;
                }
            }
        }
    }
    $str = null;
    for ($i = 0; $i < count($board); $i++) {
        for ($j = 0; $j < count($board); $j++) {
            if ($board[$i][$j] == "ship") {
                $str .= "S";
            }
            if ($board[$i][$j] == "empty") {
                $str .= "N";
            }
        }
    }
    return $str;
}


function hasShipsInArea($board, $x1, $y1, $x2, $y2)
{
    for ($i = max(0, $x1 - 1); $i <= min(count($board) - 1, $x2 + 1); $i++) {
        for ($j = max(0, $y1 - 1); $j <= min(count($board) - 1, $y2 + 1); $j++) {
            if ($board[$i][$j] == 'ship') {
                return true;
            }
        }
    }
    return false;
}


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
        $query = $DBH->prepare("DELETE FROM 'BattleShip' WHERE MatchID = :matchID;");
        $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
        $query->execute();
        exit(json_encode($match));
    }

    // Запрос на наличие игры
    $query = $DBH->prepare("SELECT * FROM 'BattleShip' INNER JOIN Match using(MatchID) WHERE MatchID = :matchID;");
    $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
    $query->execute();
    $line = $query->fetch(PDO::FETCH_ASSOC);
    if ($line) {
        echo json_encode($line);
    } else {

        set_time_limit(2);
        $field = array_fill(0, 8, array_fill(0, 8, 'empty'));
        $shipLengths = array(4, 3, 3, 2, 2, 1, 1, 1);
        $myField = placeShips($field, $shipLengths);
        $enemyField = placeShips($field, $shipLengths);


        /* $randMyField  = rand(1, 20);
         $query1 = $DBH->prepare("SELECT * FROM 'BattleShipField' WHERE Id = :Id;");
         $query1->bindParam("Id", $randMyField, PDO::PARAM_INT);
         $query1->execute();
         $myField = $query1->fetch(PDO::FETCH_ASSOC)['Field'];



         $randEnemyField  = rand(1, 20);
         $query2 = $DBH->prepare("SELECT * FROM 'BattleShipField' WHERE Id = :Id;");
         $query2->bindParam("Id", $randEnemyField, PDO::PARAM_INT);
         $query2->execute();
         $enemyField = $query2->fetch(PDO::FETCH_ASSOC)['Field'];*/


        // Случайно определяем кто крестик
        $whoCross = rand(0, 1) == 1 ? $playerOne : $playerTwo;
        // Случайно определяем чей ход
        $whoseMove = rand(0, 1) == 1 ? $playerOne : $playerTwo;


        $query = $DBH->prepare("INSERT INTO 'BattleShip' (MatchID, whoCross, whoseMove,Field2First,Field2Second) VALUES (:matchID,:whoCross,:whoseMove,:Field2First,:Field2Second);");
        $query->bindParam("matchID", $matchID, PDO::PARAM_INT);
        $query->bindParam("whoCross", $whoCross, PDO::PARAM_INT);
        $query->bindParam("whoseMove", $whoseMove, PDO::PARAM_INT);
        $query->bindParam("Field2First", $myField, PDO::PARAM_STR);
        $query->bindParam("Field2Second", $enemyField, PDO::PARAM_STR);
        $query->execute();

        $result = array(
            "whoCross" => $whoCross,
            "whoseMove" => $whoseMove,
            "Field1First" => "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",
            "Field2First" => $myField,
            "Field1Second" => "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN",
            "Field2Second" => $enemyField,
            "PlayerID_1" => $playerOne,
            "PlayerID_2" => $playerTwo
        );
        echo json_encode($result);
    }
} else {
    echo "401"; // Пользователь не аутентифицирован
}
