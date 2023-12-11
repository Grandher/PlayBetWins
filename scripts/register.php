<?php
    require "connect.php";

    $username = $_POST['username'];
    $password = $_POST['password'];
    $password_repeat = $_POST['password-repeat'];
    if ($password != $password_repeat) {
        echo 'Пароли не совпадают';
    } else {
        $password_hash = password_hash($password, PASSWORD_DEFAULT);
        $query = $DBH->prepare("SELECT COUNT(*) as Count FROM Account WHERE Login=:username");
        $query->bindParam("username", $username, PDO::PARAM_STR);

        $query->execute();
        $count = $query->fetch(PDO::FETCH_ASSOC);

        if ($count['Count'] > 0) {
            echo 'Логин занят';
        } else {
            $query = $DBH->prepare("INSERT INTO Account(Login, Password) VALUES (:username,:password_hash)");
            $query->bindParam("username", $username, PDO::PARAM_STR);
            $query->bindParam("password_hash", $password_hash, PDO::PARAM_STR);

            try {
                $result = $query->execute();
                session_start();
                $_SESSION['id'] = $DBH->lastInsertId();
                echo 'RegisterSuccess';
            } catch (PDOException $e) {
                echo 'Неверные данные';
            }
        }
    }

?>