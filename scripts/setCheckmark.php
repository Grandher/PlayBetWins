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
    // Преобразование строк в объекты DateTime
    $currentDate = new DateTime($dates['CurrentDate']);
    $checkmarkDate = new DateTime($dates['CheckmarkDate']);
    $reward = $dates['Reward'];

    // Сравнение дат
    $diff = $currentDate->diff($checkmarkDate);

    // Проверка, что разница между датами больше или равна одному дню
    if ($diff->days >= 1) {
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
