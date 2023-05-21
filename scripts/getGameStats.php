<?php
    if (isset($_POST['game'])) {
        $game = substr($_POST['game'], 1);
        
        require "connect.php";
        $topPlayer = array();
        $query = $DBH->prepare("SELECT Login, Avatar, Wins, Losses, Draws, ScoreElo FROM Rating
                                JOIN Games USING (GameID)
                                JOIN Account ON PlayerID = PeopleID
                                WHERE Name = :game ORDER BY ScoreElo DESC LIMIT 10");
        $query->bindParam("game", $game, PDO::PARAM_STR);
        $query->execute();
        while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
            array_push($topPlayer, $row);
        }

        $query = $DBH->prepare("SELECT * FROM Games WHERE Name = :game");
        $query->bindParam("game", $game, PDO::PARAM_STR);
        $query->execute();
        $gameInfo = $query->fetch(PDO::FETCH_ASSOC);

        $gameScore = "NotFound";
        session_start();
        if (isset($_SESSION['id'])) {
            $id = $_SESSION['id'];
            
            $query = $DBH->prepare("SELECT Wins, Losses, Draws FROM Rating
                                    JOIN Games USING (GameID)
                                    WHERE Name = :game AND PlayerID = :id");
            $query->bindParam("id", $id, PDO::PARAM_INT);
            $query->bindParam("game", $game, PDO::PARAM_STR);
            $query->execute();
            if ($score = $query->fetch(PDO::FETCH_ASSOC)) {
                $gameScore = $score;
            }
            
            
        }

        echo json_encode(array("topPlayer"=>$topPlayer, "gameInfo"=>$gameInfo, "gameScore"=>$gameScore));
    }    
?>