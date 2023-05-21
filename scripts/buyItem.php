<?php
    session_start();
    if (isset($_SESSION['id'])) {
        $id = $_SESSION['id'];
        require "connect.php";
        $prodID = $_POST["ProductID"];

        $query = $DBH->prepare("SELECT Balance FROM Account WHERE PeopleID = :id");
        $query->bindParam("id", $id, PDO::PARAM_INT);
        $query->execute();
        $balance = $query->fetch(PDO::FETCH_ASSOC)["Balance"];

        $query = $DBH->prepare("SELECT Price FROM Store WHERE ProductID = :prodID");
        $query->bindParam("prodID", $prodID, PDO::PARAM_INT);
        $query->execute();
        $price = $query->fetch(PDO::FETCH_ASSOC)["Price"];

        if ($balance > $price) {
            $query = $DBH->prepare("UPDATE Account SET Balance = Balance - :price WHERE PeopleID = :id");
            $query->bindParam("price", $price, PDO::PARAM_INT);
            $query->bindParam("id", $id, PDO::PARAM_INT);
            $query->execute();
        
            $query = $DBH->prepare("INSERT INTO ProductAccount (PeopleID, ProductID) VALUES (:id, :prodID)");
            $query->bindParam("id", $id, PDO::PARAM_INT);
            $query->bindParam("prodID", $prodID, PDO::PARAM_INT);

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