gameFieldBorderX = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
gameFieldBorderY = ['1', '2', '3', '4', '5', '6', '7', '8'];
shipsConf = [
    {maxShips: 1, pointCount: 4},
    {maxShips: 2, pointCount: 3},
    {maxShips: 3, pointCount: 2},
    {maxShips: 4, pointCount: 1}
];
CELL_WITH_SHIP = 1;
CELL_EMPTY = 0;

function generateRandomShipMap() {
    var map = [];
    // генерация карты расположения, вклчающей отрицательный координаты
    // для возможности размещения у границ
    for (var yPoint = -1; yPoint < (gameFieldBorderY.length + 1); yPoint++) {
        for (var xPoint = -1; xPoint < (gameFieldBorderX.length + 1); xPoint++) {
            if (!map[yPoint]) {
                map[yPoint] = [];
            }
            map[yPoint][xPoint] = this.CELL_EMPTY;
        }
    }

    // получение копии настроек кораблей для дальнейших манипуляций
    var shipsConfiguration = JSON.parse(JSON.stringify(shipsConf));
    var allShipsPlaced = false;
    while (allShipsPlaced === false) {
        var xPoint = getRandomInt(0, gameFieldBorderX.length);
        var yPoint = getRandomInt(0, gameFieldBorderY.length);
        if (isPointFree(map, xPoint, yPoint) === true) {
            if (canPutHorizontal(map, xPoint, yPoint, shipsConfiguration[0].pointCount, gameFieldBorderX.length)) {
                for (var i = 0; i < shipsConfiguration[0].pointCount; i++) {
                    map[yPoint][xPoint + i] = CELL_WITH_SHIP;
                }
            } else if (canPutVertical(map, xPoint, yPoint, shipsConfiguration[0].pointCount, gameFieldBorderY.length)) {
                for (var i = 0; i < shipsConfiguration[0].pointCount; i++) {
                    map[yPoint + i][xPoint] = CELL_WITH_SHIP;
                }
            } else {
                continue;
            }

            // обоновление настроек кораблей, если цикл не был пропущен
            // и корабль стало быть расставлен
            shipsConfiguration[0].maxShips--;
            if (shipsConfiguration[0].maxShips < 1) {
                shipsConfiguration.splice(0, 1);
            }
            if (shipsConfiguration.length === 0) {
                allShipsPlaced = true;
            }
        }
    }
    str = "";
    for (let i = 0; i < map.length; i++) {
        map[i] = map[i].slice(0, 8);
    }

    map = map.slice(0, 8)

    for (let i = 0; i < map.length; i++) {

        for (let j = 0; j < map.length; j++) {
            str += map[i][j];
        }
    }
    str = str.replaceAll("1" ,"S");
    str = str.replaceAll("0","N")
    console.log(str)
    return str;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


/**
 * Проверка, возможно ли разместить тут однопалубный корабль
 * @param {type} map
 * @param {type} xPoint
 * @param {type} yPoint
 * @return {Boolean}
 */
function isPointFree(map, xPoint, yPoint) {
    // текущая и далее по часовй стрелке вокруг
    if (map[yPoint][xPoint] === CELL_EMPTY
        && map[yPoint - 1][xPoint] === CELL_EMPTY
        && map[yPoint - 1][xPoint + 1] === CELL_EMPTY
        && map[yPoint][xPoint + 1] === CELL_EMPTY
        && map[yPoint + 1][xPoint + 1] === CELL_EMPTY
        && map[yPoint + 1][xPoint] === CELL_EMPTY
        && map[yPoint + 1][xPoint - 1] === CELL_EMPTY
        && map[yPoint][xPoint - 1] === CELL_EMPTY
        && map[yPoint - 1][xPoint - 1] === CELL_EMPTY
    ) {
        return true;
    }
    return false;
}


/**
 * Возможно вставки корабля горизонтально
 * @param {type} map
 * @param {type} xPoint
 * @param {type} yPoint
 * @param {type} shipLength
 * @param {type} coordLength
 * @return {Boolean}
 */
function canPutHorizontal(map, xPoint, yPoint, shipLength, coordLength) {
    var freePoints = 0;
    for (var x = xPoint; x < coordLength; x++) {
        // текущая и далее по часовй стрелке в гориз направл
        if (map[yPoint][x] === CELL_EMPTY
            && map[yPoint - 1][x] === CELL_EMPTY
            && map[yPoint - 1][x + 1] === CELL_EMPTY
            && map[yPoint][x + 1] === CELL_EMPTY
            && map[yPoint + 1][x + 1] === CELL_EMPTY
            && map[yPoint + 1][x] === CELL_EMPTY
        ) {
            freePoints++;
        } else {
            break;
        }
    }
    return freePoints >= shipLength;
}


/**
 * Возможно ли вставить корабль вертикально
 *
 * @param {type} map
 * @param {type} xPoint
 * @param {type} yPoint
 * @param {type} shipLength
 * @param {type} coordLength
 * @return {Boolean}
 */
function canPutVertical(map, xPoint, yPoint, shipLength, coordLength) {
    var freePoints = 0;
    for (var y = yPoint; y < coordLength; y++) {
        // текущая и далее по часовй стрелке в вертикальном направлении
        if (map[y][xPoint] === CELL_EMPTY
            && map[y + 1][xPoint] === CELL_EMPTY
            && map[y + 1][xPoint + 1] === CELL_EMPTY
            && map[y + 1][xPoint] === CELL_EMPTY
            && map[y][xPoint - 1] === CELL_EMPTY
            && map[y - 1][xPoint - 1] === CELL_EMPTY
        ) {
            freePoints++;
        } else {
            break;
        }
    }
    return freePoints >= shipLength;
}