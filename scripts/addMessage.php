<?php
session_start();
if (isset($_SESSION['id']) and isset($_POST['MatchID'])) {
    require "connect.php"; // Подключение к базе данных

    $id = $_SESSION['id'];
    $match = $_POST['MatchID'];
    $message = $_POST['Message'];
    $smile = $_POST['Smile'];

    // Если у игрока нет активных матчей, добавление его в очередь
    $query = $DBH->prepare("INSERT INTO Messages (AuthorID, MatchID, Content, SmileID) VALUES (:id, :match, :message, :smile)");
    $query->bindParam("id", $id, PDO::PARAM_INT);
    $query->bindParam("match", $match, PDO::PARAM_INT);

    if (isset($message) and $message) {
        $query->bindParam("message", $message, PDO::PARAM_STR);
    } else {
        $query->bindValue("message", null, PDO::PARAM_NULL);
    }

    if (isset($smile) and $smile) {
        $query->bindParam("smile", $smile, PDO::PARAM_INT);
    } else {
        $query->bindValue("smile", null, PDO::PARAM_NULL);
    }

    try {
        $result = $query->execute();
        echo '201'; // Успешное добавление в очередь
    } catch (PDOException $e) {
        echo '500'; // Ошибка при добавлении
    }
} else {
    echo "401"; // Пользователь не аутентифицирован
}
