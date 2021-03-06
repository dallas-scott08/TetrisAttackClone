﻿var matrix;//6 columns x 12 rows
var selector, rowCount, columnCount, ctx;
var max = 6;
var spriteSheet = new Image();

function initializeMatrix(columns, rows) {
    var initialMatrix = [];

    rowCount = rows;
    columnCount = columns;
    for (var i = 0; i < columns; i++) {
        initialMatrix[i] = [];
        for (var j = 0; j < rows; j++) {
            var newBlock = new Block(j, i, Math.floor(Math.random() * (max + 1)));
            initialMatrix[i][j] = newBlock;
        }
    }
    return initialMatrix;
}

function buildArrayFromColumns(row) {
    var blockArray = [];
    for (var i = 0; i < columnCount; i++) {
        blockArray.push(matrix[i][row])
    }
    return blockArray;
}

function checkArray(blockArray) {
    var deleteArray = [];
    for (var i = 1; i < blockArray.length-1; i++) {
        if (blockArray[i].blockType == blockArray[i - 1].blockType) {
            deleteArray.push(blockArray[i]);
            deleteArray.push(blockArray[i-1]);
        }
    }
    return deleteArray;
}

function checkMatrix() {
    for (var i = 0; i < columnCount; i++) {
        var checkedColumn = checkArray(matrix[i]);
        deleteBlocks(checkedColumn);
    }
    for (var j = 0; j < rowCount; j++) {
        var rowArray = buildArrayFromColumns(j);
        var checkedRow = checkArray(rowArray);
        deleteBlocks(checkedRow);
    }
}

function switchBlocks(selector) {
    var tempHolder = selector[0];
    selector[0] = selector[1];
    selector[1] = tempHolder;
}

function deleteBlocks(matchingBlocks) {
    for (var j = 0; j < matchingBlocks.length; j++) {
        matchingBlocks[j].blockType = max + 1;
    }
}

function dropBlockDown(block) {
    if (block.row == 0 || matrix[block.column][block.row - 1].blockType != max + 1) {
        return;
    }
    else {
        var selector = [matrix[block.column][block.row], matrix[block.column][block.row - 1]];
        switchBlocks(selector)
        dropBlockDown(block);
    }
}

function dropBlocksInRow(column) {
    for (var i = 1; i < rowCount; i++) {
        if (matrix[column][i - 1].blockType == max + 1
            && matrix[column][i].blockType != max + 1) {
            dropBlockDown(matrix[column][i]);
        }
    }
}

function dropAllBlocks() {
    for (var i = 0; i < columnCount; i++) {
        dropBlocksInRow(i);
    }
}

function findHighestBlock(column) {
    for (var i = rowCount - 1; i > 0; i--) {
        if (column[i].blockType != max + 1) {
            return column[i];
        }
    }
    return {};
}

function raiseBlocksUp(currentRow) {
    matrix[currentRow + 1] = matrix[currentRow];
    if (currentRow == 0) {
        return;
    } else if (currentRow = rows) {
        stop();
    }
    else {
        currentRow--;
        raiseBlocksUp(currentRow)
    }
}

function generateRow() {
    var row = [columnCount]
    for (var i = 0; i < columnCount; i++) {
        var newBlock = new Block(0, i, Math.floor(Math.random() * (max + 1)));
        row.push(newBlock);
    }
    return row;
}

function pause() { }
function stop() { }

$(document).ready(function () {
    matrix = initializeMatrix(6, 12);

    selector = [matrix[0][0], matrix[1][0]];
    checkMatrix();
    logCurrentMatrixState();
});

$(window).load(function () {
    createCanvas();
    dropAllBlocks();
    logCurrentMatrixState();
})

/*$(document).keydown(function (event) {
    var selector = [];
    switch (event.keyCode) {
        case KEY.LEFT:
            break;
        case KEY.RIGHT:
            break;
        case KEY.UP:
            break;
        case KEY.DOWN:
            break;
    }
    //switchBlocks(selector);
    //checkMatrix();
    //dropAllBlocks();
});*/

var timer = new Timer();

function render (now) {
  requestAnimationFrame(render);
  timer.tick(now);
  if (timer.elapsed >= 250) {
    timer.last = now - (timer.elapsed % 250);
    // draw jewel
  }
}

Timer.prototype = {
    tick: function (now) {
      this.last = this.last || now
      this.elapsed = now - this.last
    }
}

function createCanvas() {
    var canvas = document.getElementById("game");
    ctx = canvas.getContext("2d");
    var blockSprite = new Sprite(0);
    blockSprite.draw(9, 15);
    //var img = document.getElementById("sprites");
    //ctx.drawImage(img, 10, 10);
}

function Sprite(options) {
    this.size = 50;
    this.spriteSize = 8;
    this.blockType = options.blockType;
    this.interval = 1000 / options.fps;
    this.timer = new Timer();
    this.row = options.row;
    this.column = options.column;
}

Sprite.prototype = {
    draw: function (canvasX, canvasY) {
        this.determineXY();
        ctx.drawImage(document.getElementById("sprites"),
            this.pixelsLeft, this.pixelsTop,
            this.spriteSize, this.spriteSize,
            canvasX, canvasY,
            this.size, this.size);
    },
    determineXY: function () {
        switch (this.blockType) {
            case 0:
                this.pixelsLeft = 0;
                this.pixelsTop = 0;
                break;
            case 1:
                this.pixelsLeft = 8;
                this.pixelsTop = 0;
                break;
            case 2:
                this.pixelsLeft = 16;
                this.pixelsTop = 0;
                break;
            case 3:
                this.pixelsLeft = 0;
                this.pixelsTop = 8;
                break;
            case 4:
                this.pixelsLeft = 8;
                this.pixelsTop = 8;
                break;
            case 5:
                this.pixelsLeft = 16;
                this.pixelsTop = 8;
                break;
            case 6:
                this.pixelsLeft = 0;
                this.pixelsTop = 16;
                break;
            case 7:
                this.pixelsLeft = 8;
                this.pixelsTop = 16;
                break;
            case 8:
                this.pixelsLeft = 16;
                this.pixelsTop = 16;
                break;
        }
    },
    render: function (now) {
        requestAnimationFrame(this.render);
        this.timer.tick(now)
        if (this.timer.elapsed >= this.interval) {
          var then = this.timer.elapsed % this.interval
          this.timer.last = now - then
          // draw sprite
          this.draw(9,13);
        }
    }
}

function Block(row, column, blockType){
    this.row = row;
    this.column = column;
    this.blockType = blockType;
    this.sprite = new Sprite({blockType: blockType, row: row, column: column, fps: 4});
}

// callback -- after all images are loaded 
function draw(images){ 
    // or whatever you want in your callback 
    context.drawImage(images.image1, 10, 10, 50, 50);
    context.drawImage(images.image2, 10, 100, 50, 50);
}

var images = {};
var URLs = { image1: 'Sprites.png' };
/*LoadImages(URLs, draw);

function LoadImages(URLs, callback) {
    var loaded = 0;
    var needed = 0;
    for (var url in URLs)
    {
        needed++;
    }
    for (var url in URLs)
    {
        images[url] = new Image();
        images[url].onload = function () {
            if (++loaded >= numImages) {
                callback(images);
            }
        };
        images[url].src = "~/Images/Sprites.png";
    }
}*/

function logCurrentMatrixState() {
    var matrixAsString;
    for (var i = 0; i < columnCount; i++) {
        matrixAsString += "{";
        for (var j = 0; j < columnCount; j++) {
            matrixAsString = matrix[i][j].blockType
                + ", " + matrix[i][j].column
                + ", " + matrix[i][j].row + "}";
        }
        matrix += "\n";
    }
    console.log(matrixAsString);
}