$(function () {
    $("#projection").text('Поле противника');
    $("#projection").css("text-align","center");
    $("#field").text('Мое поле');
    $("#field").css("text-align","center");

    $("#respondCanvas").css("width", "340");
    $("#respondCanvas").css("height", "340");
    $("#respondCanvas2").css("width", "340");
    $("#respondCanvas2").css("height", "340");
    $("#respondCanvas2").css("display", "");

    const canvas = document.getElementById("respondCanvas");
    const ctx = canvas.getContext("2d");

    const canvas2 = document.getElementById("respondCanvas2");
    const ctx2 = canvas2.getContext("2d");

    // Размер игровой доски
    const boardSize = 8;
    let cellSize;
    let scaleFactorX, scaleFactorY;

    // Создание изображений для крестика и нолика
    const ship = new Image();
    ship.src = "img/games/tic-tac-toe/K.svg"; // путь к изображению крестика

    const shoot = new Image();
    shoot.src = "img/games/tic-tac-toe/B.svg"; // путь к изображению нолика

    const destroy = new Image();
    destroy.src = "img/games/tic-tac-toe/X.svg"; // путь к изображению нолика

    // Обработчик onload для изображения крестика
    ship.onload = function () {
        drawGameBoard();
    };
    // Обработчик onload для изображения нолика
    shoot.onload = function () {
        drawGameBoard();
    };

    destroy.onload = function () {
        drawGameBoard();
    };

    // Строка для хранения состояния игровой доски
    let Projection = "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN";
    let MyField = "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN";
    let EnemyField = "NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNS";

    let whoCross;
    let whoseMove;
    let currentPlayer;

    const matchID = window.gameData.MatchID;
    console.log(matchID);
    const Player = window.gameData.Player;
    const Enemy = window.gameData.Enemy;

    $.post("scripts/loadBattleShip.php", {
        "matchID": matchID,
        "playerOne": Player,
        "playerTwo": Enemy
    }, function (data) {
        data = JSON.parse(data);
        console.log(data)
        console.log("Player = " + Player);
        console.log("Player1 = " + data.PlayerID_1);
        console.log("Player2 = " + data.PlayerID_2);
        if (data.PlayerID_1 == Player) {
            Projection = data.Field1First;
            MyField = data.Field2First;
            EnemyField = data.Field2Second;
            console.log("True");
        } else {
            Projection = data.Field1Second;
            MyField = data.Field2Second;
            EnemyField = data.Field2First;
            console.log("False");
        }
        whoCross = data.whoCross;
        whoseMove = data.whoseMove;
        currentPlayer = whoCross == Player ? "X" : "O";


        // Вызываем функцию для отрисовки игровой доски
        drawGameBoard();
    });

    // Очистка canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    }

    // Рисование игровой доски
    function drawBoard() {
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 5;

        ctx2.strokeStyle = "blue";
        ctx2.lineWidth = 5;

        // Горизонтальные линии
        for (let i = 1; i < boardSize; i++) {
            const y = i * cellSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        for (let i = 1; i < boardSize; i++) {
            const y = i * cellSize;
            ctx2.beginPath();
            ctx2.moveTo(0, y);
            ctx2.lineTo(canvas2.width, y);
            ctx2.stroke();
        }


        // Вертикальные линии
        for (let i = 1; i < boardSize; i++) {
            const x = i * cellSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }


        for (let i = 1; i < boardSize; i++) {
            const x = i * cellSize;
            ctx2.beginPath();
            ctx2.moveTo(x, 0);
            ctx2.lineTo(x, canvas2.height);
            ctx2.stroke();
        }

    }

    // Отрисовка игровой доски
    function drawGameBoard() {
        clearCanvas();
        drawBoard();

        // Отрисовка крестиков и ноликов на доске
        for (let i = 0; i < Projection.length; i++) {
            const symbol = Projection[i];
            const row = Math.floor(i / boardSize);
            const col = i % boardSize;

            if (symbol === "X") {
                ctx.drawImage(destroy, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "B") {
                ctx.drawImage(shoot, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "S") {
                ctx.drawImage(ship, col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }


        for (let i = 0; i < MyField.length; i++) {
            const symbol = MyField[i];
            const row = Math.floor(i / boardSize);
            const col = i % boardSize;

            if (symbol === "X") {
                ctx2.drawImage(destroy, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "B") {
                ctx2.drawImage(shoot, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "S") {
                ctx2.drawImage(ship, col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }


    }

    // Обработка изменения размеров холста
    function resizeCanvas() {
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        cellSize = canvas.width / boardSize;
        scaleFactorX = canvas.width / rect.width;
        scaleFactorY = canvas.height / rect.height;


        const rect2 = canvas2.getBoundingClientRect();
        canvas2.width = rect2.width;
        canvas2.height = rect2.height;
        cellSize = canvas2.width / boardSize;
        scaleFactorX = canvas2.width / rect2.width;
        scaleFactorY = canvas2.height / rect2.height;


        drawGameBoard();
    }

    // Отметка текущего хода
    function activePlayer() {
        $(".playerInfo").each(function () {
            $(this).attr("playerID") == whoseMove ?
                $(this).find("img").addClass("selected") : $(this).find("img").removeClass("selected");
        });
    }

    // Вызываем функцию для установки начальных размеров и отрисовки доски
    resizeCanvas();

    // Обработка изменения размера окна браузера
    window.addEventListener("resize", resizeCanvas);

    // Обработка клика на доске
    canvas.addEventListener("click", (event) => {
        if (whoseMove == Player) {
            const rect = canvas.getBoundingClientRect();
            const x = (event.clientX - rect.left) * scaleFactorX;
            const y = (event.clientY - rect.top) * scaleFactorY;
            const col = Math.floor(x / cellSize);
            const row = Math.floor(y / cellSize);
            console.log(col)
            console.log(row)
            const index = row * boardSize + col;
            let move = 0;

            // Проверка, что клетка пуста и можно поставить крестик или нолик
            if (EnemyField[index] === "N" || EnemyField[index] === "S") {
                if (EnemyField[index] === "N") {
                    Projection = Projection.substring(0, index) + "B" + Projection.substring(index + 1);
                    EnemyField = EnemyField.substring(0, index) + "B" + EnemyField.substring(index + 1);
                    $.post("scripts/stepBattleShip.php", {
                        "matchID": matchID,
                        "boardState": Projection,
                        "EnemyField": EnemyField,
                        "whoseMove": Enemy,
                        "index": index,
                        "Player": Player,
                        "move": move
                    }, function () {
                    });
                    activePlayer();
                }

                if (EnemyField[index] === "S") {
                    Projection = Projection.substring(0, index) + "X" + Projection.substring(index + 1);
                    EnemyField = EnemyField.substring(0, index) + "X" + EnemyField.substring(index + 1);
                    move = 1;
                    $.post("scripts/stepBattleShip.php", {
                        "matchID": matchID,
                        "boardState": Projection,
                        "EnemyField": EnemyField,
                        "whoseMove": Enemy,
                        "index": index,
                        "Player": Player,
                        "move": move
                    }, function () {
                    });
                }



                // Перерисовка доски после хода
                drawGameBoard();
            }
        }
    });

    $("#modal-success .button__thanksforpay").click(function () {
        window.location.href = 'home.html';
    });

    $(document).click(function (e) {
        if (e.target.id == "modal-conf") {
            $("body").css("overflow", "auto");
            $("#modal-conf").fadeOut(400);
        }
        if (e.target.id == "modal-success") {
            window.location.href = 'home.html';
        }
    })

    function checkWin() {

        if (EnemyField.indexOf("S") == -1) {
            return "G";
        }

        return null; // Нет выигрыша
    }

    function endGame(Winner, Losser, isDraw = false) {
        clearInterval(TIMER);
        console.log({"Победитель": Winner, "Проигравший": Losser});
        $.post("scripts/leaveGame.php", {
            'MatchID': matchID,
            'GameID': window.gameData.GameID,
            'Winner': Winner,
            'Losser': Losser,
            'isDraw': isDraw
        }, function (data) {
            //console.log(data);
            if (isDraw) {
                $("#modal-success").find("h3").text("Ничья");
            } else if (Winner == Player) {
                $("#modal-success").find("h3").text("Вы победили");
            } else {
                $("#modal-success").find("h3").text("Вы проиграли");
            }
            $("body").css("overflow", "hidden");
            $("#modal-success").fadeIn(400);
            $("#modal-success").css("top", $(document).scrollTop());
        });
    }


    let TimeLastMove = new Date();
    ;
    TIMER = setInterval(function () {

        let currentDate = new Date();
        let timeDiff = new Date(currentDate.getTime() - TimeLastMove.getTime());
        timeDiff = timeDiff.toISOString().substring(15, 19);
        timeDiff = parseInt(timeDiff.split(":")[0], 10) * 60 + parseInt(timeDiff.split(":")[1], 10);

        if (timeDiff <= 60) {
            min = parseInt((60 - timeDiff) / 60, 10);
            sec = parseInt((60 - timeDiff) % 60, 10);
            sec = sec < 10 ? "0" + sec : sec;
            $('.stepTimer span').text(min + ":" + sec);
        } else {
            $('.stepTimer span').text("0:00");
            let Winner = whoseMove == Player ? Enemy : Player;
            endGame(Winner, whoseMove, false);
        }

        let gameResult = checkWin();
        if (gameResult) {
            if (gameResult == "G") {
                endGame(Player, Enemy, false);
            }
        }

        $.post("scripts/loadBattleShip.php", {
            "matchID": matchID,
            "playerOne": Player,
            "playerTwo": Enemy,
        }, function (data) {
            data = JSON.parse(data);
            console.log("Player = " + Player);
            console.log(data);
            console.log("Player1 = " + data.PlayerID_1);
            console.log("Player2 = " + data.PlayerID_2);

            if (data.Status == 1) {
                console.log(data);
                endGame(data.PlayerID_1, data.PlayerID_2, false);
            } else {
                if (data.PlayerID_1 == Player) {
                    Projection = data.Field1First;
                    MyField = data.Field2First;
                    EnemyField = data.Field2Second;
                    console.log("True");
                } else {
                    Projection = data.Field1Second;
                    MyField = data.Field2Second;
                    EnemyField = data.Field2First
                    console.log("False");
                }
                whoCross = data.whoCross;
                whoseMove = data.whoseMove;
                TimeLastMove = new Date(data.TimeLastMove);

                // Вызываем функцию для отрисовки игровой доски
                drawGameBoard();
                activePlayer();
            }
        });

    }, 1000);

});
