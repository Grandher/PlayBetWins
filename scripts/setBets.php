<?php
    session_start();
    if (isset($_SESSION['id'])) {
        $id = $_SESSION['id'];
        require "connect.php";

        $playerLogin = $_POST["Player"];
        $gameID = $_POST["GameID"];
        $betSum = $_POST["Summa"];

        $query = $DBH->prepare("SELECT Balance FROM Account WHERE PeopleID = :id");
        $query->bindParam("id", $id, PDO::PARAM_INT);
        $query->execute();
        $balance = $query->fetch(PDO::FETCH_ASSOC)["Balance"];

        if ($balance > $betSum) {
            $query = $DBH->prepare("UPDATE Account SET Balance = Balance - :price WHERE PeopleID = :id");
            $query->bindParam("price", $betSum, PDO::PARAM_INT);
            $query->bindParam("id", $id, PDO::PARAM_INT);
            $query->execute();


            $query = $DBH->prepare("INSERT INTO Bets (BettorID, PlayerID, GameID, Sum) 
                                    VALUES (:id, (SELECT PeopleID FROM Account WHERE Login = :pLogin), :gameID, :betSum)");
            $query->bindParam("id", $id, PDO::PARAM_INT);
            $query->bindParam("pLogin", $playerLogin, PDO::PARAM_STR);
            $query->bindParam("gameID", $gameID, PDO::PARAM_INT);
            $query->bindParam("betSum", $betSum, PDO::PARAM_INT);

            try {
                $result = $query->execute();
                echo 'Ok';
            } catch (PDOException $e) {
                echo 'Error';
            }
        } else {
            echo 'insufficientFunds';
        }
    }

?>