<?php
    require "connect.php";
    $username = $_POST['username'];
    $password = $_POST['password'];

    $query = $DBH->prepare("SELECT * FROM Account WHERE Login=:username");
    $query->bindParam("username", $username, PDO::PARAM_STR);
    $query->execute();
    $result = $query->fetch(PDO::FETCH_ASSOC);
    if (!$result) {
        echo 'Нет такого пользователя';
    } else {
        if (password_verify($password, $result['Password'])) {
            //Запускаем пользователю сессию
            session_start();
            //Записываем id
            $_SESSION['id'] = $result['PeopleID'];
            //Сообщение об успехе
            echo 'SessionStart';
        } else {
            echo 'Неверный пароль';
        }
    }
?>
