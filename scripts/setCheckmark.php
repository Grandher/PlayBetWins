<?php
session_start();
if (isset($_SESSION['id'])) {
    $id = $_SESSION['id'];
    require "connect.php";

    $query = $DBH->prepare("SELECT CURRENT_TIMESTAMP AS CurrentDate, CheckmarkDate, Reward FROM Account
                            JOIN Checkmark ON CheckmarkDay = NumberDay WHERE PeopleID = :id");
    $query->bindParam("id", $id, PDO::PARAM_INT);
    $query->execute();
    $dates = $query->fetch(PDO::FETCH_ASSOC);
    $reward = $dates['Reward'];

    $flag = false;
    if ($dates['CheckmarkDate'] != 0) {
        // Преобразование строк в объекты DateTime
        $currentDate = new DateTime($dates['CurrentDate']);
        $checkmarkDate = new DateTime($dates['CheckmarkDate']);
        // Сравнение дат
        $diff = $currentDate->diff($checkmarkDate);
        if ($diff->days >= 1) {
            $flag = true;
        }
    } else {
        $flag = true;
    }

    // Проверка, что разница между датами больше или равна одному дню
    if ($flag) {
        $query = $DBH->prepare("UPDATE Account SET CheckmarkDay = CheckmarkDay % 7 + 1, CheckmarkDate = CURRENT_TIMESTAMP WHERE PeopleID = :id;");
        $query->bindParam("id", $id, PDO::PARAM_INT);
        $query->execute();

        $query = $DBH->prepare("UPDATE Account SET Balance = Balance + :reward WHERE PeopleID = :id;");
        $query->bindParam("reward", $reward, PDO::PARAM_INT);
        $query->bindParam("id", $id, PDO::PARAM_INT);
        $query->execute();

        try {
            echo '200';
        } catch (PDOException $e) {
            echo '400';
        }
    } else {
        echo "400";
    }
}
