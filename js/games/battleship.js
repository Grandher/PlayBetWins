$(function () {
    $("#projection").text('Поле противника');
    $("#field").text('Ваше поле');

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
    ship.src = "img/games/battleship/K.svg"; // путь к изображению крестика

    const shoot = new Image();
    shoot.src = "img/games/battleship/B.svg"; // путь к изображению нолика

    const wound = new Image();
    wound.src = "img/games/battleship/X.svg";

    const destroy = new Image();
    destroy.src = "img/games/battleship/D.svg";

    // Обработчик onload для изображения крестика
    ship.onload = function () {
        drawGameBoard();
    };
    // Обработчик onload для изображения нолика
    shoot.onload = function () {
        drawGameBoard();
    };

    wound.onload = function () {
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
    const Player = window.gameData.Player;
    const Enemy = window.gameData.Enemy;

    $.post("scripts/loadBattleShip.php", {
        "matchID": matchID,
        "playerOne": Player,
        "playerTwo": Enemy
    }, function (data) {
        data = JSON.parse(data);
        if (data.PlayerID_1 == Player) {
            Projection = data.Field1First;
            MyField = data.Field2First;
            EnemyField = data.Field2Second;
        } else {
            Projection = data.Field1Second;
            MyField = data.Field2Second;
            EnemyField = data.Field2First;
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
                ctx.drawImage(wound, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "B") {
                ctx.drawImage(shoot, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "S") {
                ctx.drawImage(ship, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "D") {
                ctx.drawImage(destroy, col * cellSize, row * cellSize, cellSize, cellSize);
            }
        }

        for (let i = 0; i < MyField.length; i++) {
            const symbol = MyField[i];
            const row = Math.floor(i / boardSize);
            const col = i % boardSize;

            if (symbol === "X") {
                ctx2.drawImage(wound, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "B") {
                ctx2.drawImage(shoot, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "S") {
                ctx2.drawImage(ship, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "D") {
                ctx2.drawImage(destroy, col * cellSize, row * cellSize, cellSize, cellSize);
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
                    markSurroundingCellsRecursive(index);
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

    function markSurroundingCellsRecursive(i) {
        if (i >= 0 && i < 64 && EnemyField[i] === "X" &&
            (i % 8 === 0 || (i - 1 >= 0 && EnemyField[i - 1] !== "S")) &&
            (i % 8 === 7 || (i + 1 < 64 && EnemyField[i + 1] !== "S")) &&
            (i < 8 || (i - 8 >= 0 && EnemyField[i - 8] !== "S")) &&
            (i >= 56 || (i + 8 < 64 && EnemyField[i + 8] !== "S"))
        ) {
            Projection = Projection.substring(0, i) + "D" + Projection.substring(i + 1);
            EnemyField = EnemyField.substring(0, i) + "D" + EnemyField.substring(i + 1);

            if (i % 8 !== 0) {
                markSurroundingCellsRecursive(i - 1); // клетка слева
            }
            if (i % 8 !== 7) {
                markSurroundingCellsRecursive(i + 1); // клетка справа
            }
            if (i >= 8) {
                markSurroundingCellsRecursive(i - 8); // клетка сверху
            }
            if (i < 56) {
                markSurroundingCellsRecursive(i + 8); // клетка снизу
            }
        } else if (i >= 0 && i < 64 && EnemyField[i] === "N") {
            Projection = Projection.substring(0, i) + "B" + Projection.substring(i + 1);
            EnemyField = EnemyField.substring(0, i) + "B" + EnemyField.substring(i + 1);
        }
    }

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
        $.post("scripts/leaveGame.php", {
            'MatchID': matchID,
            'GameID': window.gameData.GameID,
            'Winner': Winner,
            'Losser': Losser,
            'isDraw': isDraw
        }, function (data) {
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

    let timeDiff = 0;
    TIMER = setInterval(function () {

        if (timeDiff <= 60000) {
            let seconds = 60 - Math.floor(timeDiff / 1000);
            let min = Math.floor(seconds / 60);
            let sec = seconds % 60;
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
            if (data.Status == 1) {
                endGame(data.PlayerID_1, data.PlayerID_2, false);
            } else {
                if (data.PlayerID_1 == Player) {
                    Projection = data.Field1First;
                    MyField = data.Field2First;
                    EnemyField = data.Field2Second;
                } else {
                    Projection = data.Field1Second;
                    MyField = data.Field2Second;
                    EnemyField = data.Field2First
                }
                whoCross = data.whoCross;
                whoseMove = data.whoseMove;
                TimeLastMove = new Date(data.TimeLastMove).getTime();
                CurrentTime = new Date(data.CurrentTime).getTime();
                timeDiff = CurrentTime - TimeLastMove;

                // Вызываем функцию для отрисовки игровой доски
                drawGameBoard();
                activePlayer();
            }
        });

    }, 1000);

});
