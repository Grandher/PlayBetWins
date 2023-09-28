<?php
session_start();
if (isset($_SESSION['id'])) { // Проверка наличия сессии пользователя
    require "connect.php"; // Подключение к базе данных
    $id = $_SESSION['id']; // Получение идентификатора пользователя из сессии

    // Запрос для получения данных пользователя
    $query = $DBH->prepare("SELECT PeopleID, Login, Balance, Avatar, Reward, CheckmarkDate FROM Account
                            JOIN Checkmark ON CheckmarkDay = NumberDay
                            WHERE PeopleID=:id");
    $query->bindParam("id", $id, PDO::PARAM_STR);
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);

    // Запрос для получения статистики пользователя 
    $query = $DBH->prepare("SELECT SUM(Wins) AS Wins, SUM(Losses) AS Losses, SUM(Draws) AS Draws
                            FROM Rating GROUP BY PlayerID HAVING PlayerID = :id");
    $query->bindParam("id", $id, PDO::PARAM_STR);
    $query->execute();
    if ($rating = $query->fetch(PDO::FETCH_ASSOC)) {
        $result += $rating; // Добавление статистики к результатам
    } else {
        // Если статистика отсутствует, установка нулей
        $result += array(
            "Wins" => 0,
            "Losses" => 0,
            "Draws" => 0
        );
    }

    // Запрос для получения информации о текущем матче пользователя
    $query = $DBH->prepare("SELECT MatchID, PlayerID_1, PlayerID_2, GameID, Name AS GameName,
                                A1.Login AS PlayerLogin_1, A2.Login AS PlayerLogin_2,
                                A1.Avatar AS PlayerAvatar_1, A2.Avatar AS PlayerAvatar_2 FROM Match 
                            JOIN Account AS 'A1' ON (Match.PlayerID_1 = 'A1'.PeopleID)
                            JOIN Account AS 'A2' ON (Match.PlayerID_2 = 'A2'.PeopleID)
                            JOIN Games USING (GameID)
                            WHERE Status = 0 AND (PlayerID_1 = :id OR PlayerID_2 = :id);");
    $query->bindParam("id", $id, PDO::PARAM_STR);
    $query->execute();
    if ($data = $query->fetch(PDO::FETCH_ASSOC)) {
        $result += $data; // Добавление информации о текущем матче к результатам
    } else {
        exit("402"); // В случае отсутствия текущего матча, возврат статуса "402"
    }

    echo json_encode($result); // Вывод результатов в формате JSON
} else {
    echo "401"; // Если сессия пользователя отсутствует, возврат статуса "401"
}
