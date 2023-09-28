<?php
session_start();
if (isset($_SESSION['id'])) {
    require "connect.php"; // Подключение к базе данных

    $id = $_SESSION['id'];

    $query = $DBH->prepare("DELETE FROM Matching WHERE PlayerID = :id;");
    $query->bindParam("id", $id, PDO::PARAM_INT);
    try {
        $result = $query->execute();
        echo '204'; // Успешное удаление
    } catch (PDOException $e) {
        echo '500'; // Ошибка при удалении
    }
} else {
    echo "401"; // Пользователь не аутентифицирован
}
