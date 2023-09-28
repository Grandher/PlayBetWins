$(function () {
    const canvas = document.getElementById("respondCanvas");
    const ctx = canvas.getContext("2d");

    // Размер игровой доски
    const boardSize = 3;
    let cellSize;
    let scaleFactorX, scaleFactorY;

    // Создание изображений для крестика и нолика
    const crossImg = new Image();
    crossImg.src = "img/games/tic-tac-toe/X.svg"; // путь к изображению крестика

    const circleImg = new Image();
    circleImg.src = "img/games/tic-tac-toe/O.svg"; // путь к изображению нолика

    // Обработчик onload для изображения крестика
    crossImg.onload = function () { drawGameBoard(); };
    // Обработчик onload для изображения нолика
    circleImg.onload = function () { drawGameBoard(); };

    // Строка для хранения состояния игровой доски
    let boardState = "NNNNNNNNN";
    let whoCross;
    let whoseMove;
    let currentPlayer;

    const matchID = window.gameData.MatchID;
    const Player = window.gameData.Player;
    const Enemy = window.gameData.Enemy;

    $.post("scripts/loadTicTacToe.php", {
        "matchID": matchID,
        "playerOne": Player,
        "playerTwo": Enemy
    }, function (data) {
        data = JSON.parse(data);
        console.log(data);

        boardState = data.Field;
        whoCross = data.whoCross;
        whoseMove = data.whoseMove;
        currentPlayer = whoCross == Player ? "X" : "O";

        // Вызываем функцию для отрисовки игровой доски
        drawGameBoard();
    });

    // Очистка canvas
    function clearCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    // Рисование игровой доски
    function drawBoard() {
        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;

        // Горизонтальные линии
        for (let i = 1; i < boardSize; i++) {
            const y = i * cellSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Вертикальные линии
        for (let i = 1; i < boardSize; i++) {
            const x = i * cellSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }
    }

    // Отрисовка игровой доски
    function drawGameBoard() {
        clearCanvas();
        drawBoard();

        // Отрисовка крестиков и ноликов на доске
        for (let i = 0; i < boardState.length; i++) {
            const symbol = boardState[i];
            const row = Math.floor(i / boardSize);
            const col = i % boardSize;

            if (symbol === "X") {
                ctx.drawImage(crossImg, col * cellSize, row * cellSize, cellSize, cellSize);
            } else if (symbol === "O") {
                ctx.drawImage(circleImg, col * cellSize, row * cellSize, cellSize, cellSize);
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

            // Проверка, что клетка пуста и можно поставить крестик или нолик
            if (boardState[index] === "N") {

                boardState = boardState.substring(0, index) + currentPlayer + boardState.substring(index + 1);

                $.post("scripts/stepTicTacToe.php", {
                    "matchID": matchID,
                    "boardState": boardState,
                    "whoseMove": Enemy
                }, function () {
                });

                // Перерисовка доски после хода
                drawGameBoard();
                activePlayer();
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
        const countN = (boardState.match(/N/g) || []).length;

        const winCombinations = [
            "012", "345", "678", // Горизонтальные линии
            "036", "147", "258", // Вертикальные линии
            "048", "246"         // Диагональные линии
        ];

        for (const combo of winCombinations) {
            const [a, b, c] = combo.split("").map(Number);
            if (boardState[a] === boardState[b] && boardState[b] === boardState[c] && boardState[a] !== "N") {
                return boardState[a]; // Возвращаем победителя
            }
        }

        if (countN == 0) {
            return "D";
        }

        return null; // Нет выигрыша
    }

    function endGame(Winner, Losser, isDraw = false) {
        clearInterval(TIMER);
        console.log({ "Победитель": Winner, "Проигравший": Losser });
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
            } else
                if (Winner == Player) {
                    $("#modal-success").find("h3").text("Вы победили");
                } else {
                    $("#modal-success").find("h3").text("Вы проиграли");
                }
            $("body").css("overflow", "hidden");
            $("#modal-success").fadeIn(400);
            $("#modal-success").css("top", $(document).scrollTop());
        });
    }


    let TimeLastMove = new Date();;
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
            if (gameResult == "D") {
                endGame(Player, Enemy, true);
            } else {
                let Winner, Losser;
                Winner = currentPlayer == gameResult ? Player : Enemy;
                Losser = currentPlayer == gameResult ? Enemy : Player;

                endGame(Winner, Losser, false);
            }
        }

        $.post("scripts/loadTicTacToe.php", {
            "matchID": matchID,
            "playerOne": Player,
            "playerTwo": Enemy
        }, function (data) {
            data = JSON.parse(data);

            if (data.Status == 1) {
                console.log(data);
                endGame(data.PlayerID_1, data.PlayerID_2, false);
            }
            else {

                boardState = data.Field;
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