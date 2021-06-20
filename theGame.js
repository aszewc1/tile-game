//
// draggable canvas elements
//

function dragIt() {
    // creates reference to menu div
    var menu = document.getElementById("menuRef");

    // adds mouse listeners to the menu and document body
    // depending on where actions are allowed to happen
    menu.addEventListener('mousedown', startClick);
    document.body.addEventListener('mousemove', drag);
    document.body.addEventListener('mouseup', endDrag);
    document.body.addEventListener('mouseleave', leaveOops);
    menu.addEventListener('touchstart', startClick);
    document.body.addEventListener('touchmove', drag);
    document.body.addEventListener('touchend', endDrag);
    document.body.addEventListener('touchleave', leaveOops);
    document.body.addEventListener('touchcancel', endDrag);

    // creates a baby canvas to drag around
    var overlay = document.createElement("CANVAS");
    var ctxt = overlay.getContext("2d");
    overlay.width = 64;
    overlay.height = 76;
    overlay.id = "overlay";

    // initializes variables that allow for dragging
    var offsetX = menu.style.offsetX;
    var offsetY = menu.style.offsetY;
    var cWidth = overlay.width;
    var cHeight = overlay.height;
    var drawThis;
    var isDragging = false;
    var isIn = false;
    var MouseX, MouseY;
    let currentDroppable = null;

    /* function for starting click action
     * @param e     the mouse down event
     */
    function startClick(e) {

        // only calls the function to start dragging if we have clicked
        // a draggable group
        if (e.target.classList.contains("draggable")) {
            drawThis = e.target;
            startDrag(e);
        }
        else if (e.target.parentNode.classList.contains("draggable-group")) {
            drawThis = e.target.parentNode;
            startDrag(e);
        }
    }

    /* function for starting dragging action
     * @param e     the mouse down event
     */
    function startDrag(e) {

        console.log(drawThis.id);

        // draws image onto baby canvas
        ctxt.drawImage(
            Loader.getImage(drawThis.id),   // image
            (1 - 1) * map.tsize,            // source x
            0,                              // source y
            map.tsize,                      // source width
            map.tsize + 12,                 // source height
            0,                              // target x
            0,                              // target y
            cWidth,                         // target width
            cHeight                         // target height
        );

        // defines variables based on mouse position
        MouseX = parseInt(e.clientX - 64/2) + window.pageXOffset;
        MouseY = parseInt(e.clientY - 76/2) + window.pageYOffset;

        // troubleshooting helper
        var str = "X: " + (MouseX) + " Y: " + (MouseY) + " SCROLLH: " + window.pageYOffset;
        console.log(str);

        // adjusts baby canvas location for the page layout and scroll
        overlay.style.left = MouseX + "px";
        overlay.style.top = MouseY + "px";
        document.body.appendChild(overlay);

        // dragging is happening
        isDragging = true;
    }

    /* function for handling an occuring drag
     * @param e     the mouse move event
     */
    function drag(e) {
        // updates variables based on mouse position
        MouseX = parseInt(e.clientX - 64/2);
        MouseY = parseInt(e.clientY - 76/2);

        // if dragging...
        if(isDragging){
            // update canvas position
            overlay.style.left = MouseX + window.pageXOffset + "px";
            overlay.style.top = MouseY + window.pageYOffset + "px";
            document.body.appendChild(overlay);

            // find element directly under mouse
            MouseX = parseInt(e.clientX);
            MouseY = parseInt(e.clientY);
            overlay.hidden = true;
            let elemBelow = document.elementFromPoint(MouseX, MouseY);
            overlay.hidden = false;

            if (!elemBelow) return;

            // if there is an element underneath and it's the dropzone...
            if (elemBelow.classList.contains("droppable")) {
                let droppableBelow = elemBelow;
                
                if (currentDroppable != droppableBelow) {
                    currentDroppable = droppableBelow;
                    isIn = "true";
                }
            }
            else {
                if (currentDroppable) { // null when we were not over a droppable before this event
                    isIn = "false";
                    currentDroppable = null;
                }
            }
        } 
    }

    /* function for handling cursor leaving canvas
     * @param e     the mouse leave event
     */
    function leaveOops(e) {
        // updates variables based on mouse position
        MouseX = parseInt(e.clientX - offsetX);
        MouseY = parseInt(e.clientY - offsetY);
        
        // user has left the canvas; stop dragging
        //isDragging = false;
    }

    /* function for handling the dropping of an element
     * @param e     the mouse up event
     */
    function endDrag(e) {
        // only attempt to clear canvas and remove child if
        // dragging is occuring now
        if (isDragging) {
            //clear and remove canvas
            ctxt.clearRect(0, 0, cWidth, cHeight);
            document.body.removeChild(overlay);

            if (isIn) {
                //for testing
                var dropzone = document.getElementById("demo");
                var offsetc = dropzone.getBoundingClientRect();
                var canvx = offsetc.left;
                var canvy = offsetc.top;
                var x = MouseX - canvx;
                var y = MouseY - canvy;
                console.log("X: "+ x + " Y: " + y);

                var c = Math.round((x + Game.camera.x - 32) / 64);
                var r = Math.round((y + Game.camera.y - 32) / 64);
                console.log("Col: "+ c + " Row: " + r);

                var validMove = set.getT(drawThis.id).validMove(
                                set.getT(map.getTile(c, r - 1)),
                                set.getT(map.getTile(c, r + 1)),
                                set.getT(map.getTile(c + 1, r)),
                                set.getT(map.getTile(c - 1, r)),
                                set.getT(map.getTile(c, r)));
                if (validMove) {
                    if (r == 1) {
                        map.addRow(r++);
                    }
                    else if (r == map.rows - 2) {
                        map.addRow(r + 1);
                    }
                    if (c == 1) {
                        map.addCol(c++);
                    }
                    else if (c == map.cols - 2) {
                        map.addCol(c + 1);
                    }
                    map.setTile(c, r, drawThis.id);
                }
            }
        }

        // stop dragging
        isDragging = false;
    }

};

//
// Asset loader
//

// creates an "images" object that collects image objects
// indexed by the key
var Loader = {
    images: Array(),

    /* function for loading images into the "images" object
     * under custom indices
     * @param key       the custom index for an image
     * @param src       the source for the image
     * @return          the promise for loading an image
     */
    loadImage: function (key, src) {
        var img = new Image();
        
        var p = new Promise(function (resolve, reject) {
            img.onload = function () {
                this.images[key] = img;
                resolve(img);
            }.bind(this);
    
            img.onerror = function () {
                reject('Could not load image: ' + src);
            };
        }.bind(this));
    
        img.src = src;
        return p;
    },

    /* function for returning an image identified by its key
     * @param key       the custom index for an image
     * @return          the image
     */
    getImage: function (key) {
        return (key < this.images.length) ? this.images[key] : this.images[0];
    },

};

//
// Keyboard handler
//

// an object representation of the keyboard
var Keyboard = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    _keys: {},

    listenForEvents: function (keys) {
        window.addEventListener('keydown', this._onKeyDown.bind(this));
        window.addEventListener('keyup', this._onKeyUp.bind(this));
    
        keys.forEach(function (key) {
            this._keys[key] = false;
        }.bind(this));
    },

    _onKeyDown: function (event) {
        var keyCode = event.keyCode;
        if (keyCode in this._keys) {
            event.preventDefault();
            this._keys[keyCode] = true;
        }
    },

    _onKeyUp: function (event) {
        var keyCode = event.keyCode;
        if (keyCode in this._keys) {
            event.preventDefault();
            this._keys[keyCode] = false;
        }
    },

    isDown: function (keyCode) {
        if (!keyCode in this._keys) {
            throw new Error('Keycode ' + keyCode + ' is not being listened to');
        }
        return this._keys[keyCode];
    },

};

//
// Game object
//

// an object representation of the game
var Game = {
    /* function to run the game starting with the
     * initialization and loading of images
     */
    run: function () {
        var disp = document.getElementById("grid-display");
        while (disp.hasChildNodes()) {  
            disp.removeChild(disp.firstChild);
        }
        
        var board = document.createElement("CANVAS");
        board.setAttribute("id", "demo");
        board.setAttribute("class", "droppable");
        board.setAttribute("width", "832");
        board.setAttribute("height", "512");
        disp.appendChild(board);

        var controls = document.createElement("DIV");
        controls.setAttribute("id", "ctrls");
        /*var svBtn = document.createElement("BUTTON");
        svBtn.setAttribute("id", "saveBtn");
        svBtn.setAttribute("class", "hbtn");
        controls.appendChild(svBtn);*/
        var t = document.createTextNode("Tiles placed: " + map.tile_score);
        controls.setAttribute("id", "scorecard");
        controls.appendChild(t);
        disp.appendChild(controls);

        if (!document.getElementById("undo-button")) {
            var selectBar = document.getElementById("select-bar");
            var undoBtn = document.createElement("BUTTON");
            undoBtn.setAttribute("class", "hbtn");
            undoBtn.setAttribute("id", "undo-button");
            undoBtn.style.width = "auto";
            undoBtn.textContent = "Undo";
            undoBtn.onclick = function() { map.undoMove(); }
            selectBar.appendChild(undoBtn);
        }

        Game.ctx = board.getContext("2d");
        Game._previousElapsed = 0;
        
        var p = Game.load();
        Promise.all(p).then(function (loaded) {
            Game.init();
            window.requestAnimationFrame(Game.tick);
        }.bind(Game));
    },

    /* function for loading all the tile images
     * from their generated SVGs
     */
    load: function () {
        var array = [];

        for (var key = 0; key < set.arr.length; key++) {
        var s = new XMLSerializer().serializeToString(set.arr[key].pic);
        var encodedData = window.btoa(s);
        var str = "data:image/svg+xml;base64," + encodedData;
        array.push(Loader.loadImage(key, str));
        }

        return array;
    },

    /* initializes game by starting up keyboard
     * listening object
     */
    init: function () {
        Keyboard.listenForEvents([Keyboard.LEFT, Keyboard.RIGHT, Keyboard.UP, Keyboard.DOWN]);
        
        //Game.tileAtlas = Loader.getImage("Hset");
    
        Game.camera = new Camera(map, 832, 512);
        Game._fillMenu();
    },

    /* saves the current game into database for user
     */
    save: function() {
        console.log("saving...");
        var mode = "";
        var tGame = map.board[0];
        var JParam = JSON.stringify(tGame);

        if (document.getElementById("Hanf").checked) {
            mode = "Hanf";
        }
        else if (document.getElementById("Jockusch").checked){
            mode = "Jockusch";
        }
        else {
            mode = "Upload";
        }

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("POST", "includes/save.inc.php", true);
        xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xmlhttp.onreadystatechange = function() {
            if (this.readyState === 4 || this.status === 200){ 
                var dummy = this.responseText; // echo from php
            }       
        };
        xmlhttp.send("rows=" + map.rows + "&cols=" + map.cols + "&set=" + mode + "&state=" + JParam);
    },

    /* restores a chosen game from database for user
     * @param r      rows in map
     * @param c      cols in map
     * @param t      type of game
     * @param Jmap    JSON encoded map for game
     */
    restore: function(r, c, t, Jmap) {
        map.board[0] = Jmap;
        map.rows = r;
        map.cols = c;
        if (t == "H") {
            Hset = new Set();
            newHset(Hset);
            set = Hset;
        }
        else if (t == "J") {
            Jset = new Set();
            newJset(Jset);
            set = Jset;
        }
        else {
            set = MYset;
        }
        Game.run();
    },

    /* performs "ticks" to segment movement animation
     * across the canvas
     */
    tick: function (elapsed) {
        window.requestAnimationFrame(Game.tick);
    
        // clear previous frame
        Game.ctx.clearRect(0, 0, 832, 512);
    
        // compute delta time in seconds -- also cap it
        var delta = (elapsed - Game._previousElapsed) / 1000.0;
        delta = Math.min(delta, 0.25); // maximum delta of 250 ms
        Game._previousElapsed = elapsed;
    
        Game.update(delta);
        Game.render();
    }.bind(Game),

    /* updates the canvas based on the tick time
     */
    update: function (delta) {
        // handle camera movement with arrow keys
        var dirx = 0;
        var diry = 0;
        if (Keyboard.isDown(Keyboard.LEFT)) { dirx = -1; }
        else if (Keyboard.isDown(Keyboard.RIGHT)) { dirx = 1; }
        else if (Keyboard.isDown(Keyboard.UP)) { diry = -1; }
        else if (Keyboard.isDown(Keyboard.DOWN)) { diry = 1; }
    
        Game.camera.move(delta, dirx, diry);
    },

    /* function for drawing tile layer
     * in canvas
     */
    _drawLayer: function () {
        var startCol = Math.floor(Game.camera.x / map.tsize);
        var endCol = startCol + (Game.camera.width / map.tsize);
        var startRow = Math.floor(Game.camera.y / map.tsize);
        var endRow = startRow + (Game.camera.height / map.tsize);
        var offsetX = -Game.camera.x + startCol * map.tsize;
        var offsetY = -Game.camera.y + startRow * map.tsize;
    
        for (var c = startCol; c <= endCol; c++) {
            for (var r = startRow; r <= endRow; r++) {
                var tile = map.getTile(c, r);
                var x = (c - startCol) * map.tsize + offsetX;
                var y = (r - startRow) * map.tsize + offsetY;
                if (tile !== 0) { // 0 => empty tile
                    Game.ctx.drawImage(
                        Loader.getImage(tile), // image
                        0,//(tile - 1) * map.tsize, // source x
                        6, // source y
                        map.tsize, // source width
                        map.tsize, // source height
                        Math.round(x),  // target x
                        Math.round(y), // target y
                        map.tsize, // target width
                        map.tsize // target height
                    );
                }
            }
        }
    },

    /* function for drawing grid in canvas
     */
    _drawGrid: function () {
        var width = map.cols * map.tsize;
        var height = map.rows * map.tsize;
        var x, y;
        for (var r = 0; r < map.rows + 1; r++) {
            x = - Game.camera.x;
            y = r * map.tsize - Game.camera.y;
            Game.ctx.beginPath();
            Game.ctx.moveTo(x, y);
            Game.ctx.lineTo(width, y);
            Game.ctx.stroke();
        }
        for (var c = 0; c < map.cols + 1; c++) {
            x = c * map.tsize - this.camera.x;
            y = - this.camera.y;
            Game.ctx.beginPath();
            Game.ctx.moveTo(x, y);
            Game.ctx.lineTo(x, height);
            Game.ctx.stroke();
        }
    },

    /* fills the menu (only on load and when the set
     * is changed)
     */
    _fillMenu: function () {
        var ref = document.getElementById("menuRef");
        while (ref.hasChildNodes()) {  
            ref.removeChild(ref.firstChild);
        }
        for (var c = 1; c < set.arr.length; c++) {
            ref.appendChild(set.arr[c].pic);
            console.log(typeof(Loader.getImage(c)));
            
            // ignore
            /*var y = (map.tsize / 2) + ((c - 1) * (3 * (map.tsize + 12) / 2));
            Game.mctx.drawImage(
                Loader.getImage(c), // image
                0,//(c - 1) * map.tsize, // source x
                0, // source y
                map.tsize, // source width
                map.tsize + 12, // source height
                Math.round(32),  // target x
                Math.round(y), // target y
                map.tsize, // target width
                map.tsize + 12 // target height
            );*/
        }
    },

    /* renders the canvas for each tick
     */
    render: function () {
        // draw map background layer
        Game._drawLayer();
    
        // draw grid
        Game._drawGrid();
    },

};

//
// scroll and grid UI
//

// an object representation of the map
var map = {
    cols: 15,
    rows: 10,
    tiles_placed: 0,
    tile_score: 0,
    tsize: 64,
    board: [[
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ], [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ], [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ]],
    /* function for reading a tile
     * @param col     the column
     * @param row     the row
     * @return        the target tile ID
     */
    getTile: function (col, row) {
        return this.board[0][row * map.cols + col];
    },
    /* function for placing a tile
     * @param col     the column
     * @param row     the row
     * @param num     the target tile ID
     */
    setTile: function (col, row, num) {
        this.board[0][row * map.cols + col] = num;
        this.board[2][row * map.cols + col] = ++this.tiles_placed;
        this.tile_score++;
        var score = document.getElementById("scorecard");
        score.innerHTML = ("Tiles placed: " + map.tile_score);
    },
    /* function for undoing last move
     */
    undoMove: function () {
        if (this.tiles_placed > 0) {
            for (i = 0; i < this.rows * this.cols; i++) {
                if (this.board[2][i] == this.tiles_placed) {
                    this.board[0][i] = 0;
                    this.board[2][i] = 0;
                    this.tiles_placed--;
                    this.tile_score--;

                    var score = document.getElementById("scorecard");
                    score.innerHTML = ("Tiles placed: " + this.tile_score);
                    break;
                }
            }
        }
        else {
            alert("Nothing to undo");
        }
    },
    /* adds visible row between border of map and visible map
     * @param r        the index where the row needs to be added
     */
    addRow: function (r) {
        this.rows++;
        for (var i = 0; i < this.cols; i++) {
            this.board[0].splice(r * this.cols, 0, 0);
            this.board[2].splice(r * this.cols, 0, 0);
        }
        Game.camera.maxY = (this.rows - 1) * this.tsize - Game.camera.height;
        if (r == 1) {
            Game.camera.y += map.tsize;
        }
    },
    /* adds visible column between border of map and visible map
     * @param c      the index where the column needs to be added
     */
    addCol: function (c) {
        this.cols++;
        for (var i = 0; i < this.rows; i++) {
            this.board[0].splice(c + this.cols * i, 0, 0);
            this.board[2].splice(c + this.cols * i, 0, 0);
        }
        Game.camera.maxX = (this.cols - 1) * this.tsize - Game.camera.width;
        if (c == 1) {
            Game.camera.x += map.tsize;
        }
    },
};

// an object representation of the camera
function Camera (map, width, height) {
    this.x = 0;
    this.y = 0;
    this.width = width;
    this.height = height;
    this.maxX = (map.cols - 1) * map.tsize - width;
    this.maxY = (map.rows - 1) * map.tsize - height;
    Camera.SPEED = 256; // pixels per second

    /* function for moving camera
     * @param delta     the time elaplsed
     * @param dirx      the x direction
     * @param diry      the y direction
     */
    Camera.prototype.move = function (delta, dirx, diry) {
        // move camera
        this.x += dirx * Camera.SPEED * delta;
        this.y += diry * Camera.SPEED * delta;
    
        // update if at edge of map
        this.x = Math.max(map.tsize, Math.min(this.x, this.maxX));
        this.y = Math.max(map.tsize, Math.min(this.y, this.maxY));
    };
}

//
// Tile creation
//

// an object representation of a tile
function Tile (numID, n, s, e, w) {
    // the tile ID
    this.numID = numID;
    // the north color ID
    this.north = n;
    // the south color ID
    this.south = s;
    // the east color ID
    this.east = e;
    // the west color ID
    this.west = w;

    /* function for translating a number ID to a fill color
     * @param num     the color ID
     * @return        the fill color specified
     */
    this.translateColor = function (num) {
        var color = "white";
        
        /*switch (num) {
            case 1:
                color = "#f5f5f5";
                break;
            case 2:
                color = "#ff3b05";
                break;
            case 3:
                color = "#68ff3b";
                break;
            case 4:
                color = "#3e0be6";
                break;
            default:
                color = "#fff";
        }*/

        /*if (!document.getElementById("Hanf").checked ||
            !document.getElementById("Jockusch").checked) {*/

        if (num == 1) {
            color = "#d6d6d6";
        }
        else if (num == 0) {
            color = "black";
        }
        else {
            switch (num % 7) {
                case 0:
                    color = "red";
                    break;
                case 1:
                    color = "orange";
                    break;
                case 2:
                    color = "yellow";
                    break;
                case 3:
                    color = "green";
                    break;
                case 4:
                    color = "blue";
                    break;
                case 5:
                    color = "indigo";
                    break;
                default:
                    color = "violet";
            }
        }

        return color;
    };

    /* function for adding text to a tile group
     * based on the tile quadrant
     * @param d       a character indicating the quadrant
     * @param group   the SVG group to be modified
     */
    this.addText = function (d, group) {
        var x, y, num;
        switch (d) {
            case "n":
                x = 27;
                y = 19;
                num = this.north;
                break;
            case "s":
                x = 27;
                y = 57;
                num = this.south;
                break;
            case "e":
                x = 45;
                y = 38;
                num = this.east;
                break;
            case "w":
                x = 6;
                y = 38;
                num = this.west;
                break;
            default:
                x = 0;
                y = 0;
                num = this.numID;
        }

        var t = document.createElementNS("http://www.w3.org/2000/svg", "text");
        if (num % 7 == 2 /*&& (document.getElementById("Hanf").checked ||
                                  document.getElementById("Jockusch").checked)*/) {
            t.setAttributeNS(null, "fill", "black");
        }
        else {
            t.setAttributeNS(null, "fill", "white");
        }
        t.setAttributeNS(null, "text-align", "center");
        t.setAttributeNS(null, "x", x);
        t.setAttributeNS(null, "y", y);
        var txt = document.createTextNode(num);
        t.appendChild(txt);
        group.appendChild(t);
    };

    /* function for creating a tile SVG element
     * @return      the SVG image for a tile
     */
    this.translateImg = function () {
        // specifies fills
        var nfill, sfill, efill, wfill;
        nfill = this.translateColor(this.north);
        sfill = this.translateColor(this.south);
        efill = this.translateColor(this.east);
        wfill = this.translateColor(this.west);

        // makes the SVG
        var pic = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        pic.setAttribute("version", "1.1");
        pic.setAttributeNS(null, "width", "64px");
        pic.setAttributeNS(null, "height", "76px");
        pic.setAttributeNS(null, "viewBox", "0 0 64 64");

        var tg = document.createElementNS("http://www.w3.org/2000/svg", "g");
        tg.setAttributeNS(null, "class", "draggable-group");
        tg.setAttributeNS(null, "id", this.numID)

        var n = document.createElementNS("http://www.w3.org/2000/svg", "path");
        n.setAttributeNS(null, "d", "M 0 0 L 6 -6 L 58 -6 L 64 0 L 32 32 Z");
        n.setAttributeNS(null, "fill", nfill);
        tg.appendChild(n);

        var s = document.createElementNS("http://www.w3.org/2000/svg", "path");
        s.setAttributeNS(null, "d", "M 0 64 L 0 70 L 6 64 L 58 64 L 64 70 L 64 64 L 32 32 Z");
        s.setAttributeNS(null, "fill", sfill);
        tg.appendChild(s);

        var e = document.createElementNS("http://www.w3.org/2000/svg", "path");
        e.setAttributeNS(null, "d", "M 64 0 L 32 32 L 64 64 Z");
        e.setAttributeNS(null, "fill", efill);
        tg.appendChild(e);

        var w = document.createElementNS("http://www.w3.org/2000/svg", "path");
        w.setAttributeNS(null, "d", "M 0 0 L 32 32 L 0 64 Z");
        w.setAttributeNS(null, "fill", wfill);
        tg.appendChild(w);

        // adds the text
        this.addText("n", tg);
        this.addText("s", tg);
        this.addText("e", tg);
        this.addText("w", tg);

        pic.appendChild(tg);
        return pic;
    };

    this.pic = this.translateImg();

    /* function for determining a valid tile placement
     * @param n     the north tile
     * @param s     the south tile
     * @param e     the east tile
     * @param w     the west tile
     * @return      true if the move is valid
     */
    this.validMove = function (n, s, e, w, u) {
        var c = [n.south, s.north, e.west, w.east];
        var t = [this.north, this.south, this.east, this.west];
        var d = 0;
        for (var i = 0; i < c.length; i++) {
           if (!((c[i] == 0) || (c[i] == t[i]))) {
              return false;
           }
           d = (c[i] == 0) ? d + 1 : d;
        }
        if (d == 4) { return false; }
        if (u.north != 0 && u.south !=0 && u.east != 0 && u.west != 0) { return false; }
        return true;
    };
}

// an object representaton of a tile set
function Set() {
    // an array of tiles is a set
    this.arr = new Array();
    /* function for quickly adding tiles
     * @param tile     the tile to add
     */
    this.add = function(tile) {
        this.arr.push(tile);
    };
    /* function for getting the ID of a tile
     * @param tile     the tile
     * @return         the ID
     */
    this.getID = function(tile) {
        return this.arr.indexOf(tile);
    };
    /* function for quickly getting the tile
     * based on an ID
     * @param ID     the tile ID
     * @return       the tile
     */
    this.getT = function(n) {
        return this.arr[n];
    };
}

// an object representation of the Hanf set
function newHset(s) {
    // tiles 0
    s.add(new Tile(0, 0, 0, 0, 0));
    s.add(new Tile(1, 1, 1, 1, 1));
    s.add(new Tile(2, 2, 2, 1, 1));
    s.add(new Tile(3, 3, 3, 1, 1));
    s.add(new Tile(4, 4, 4, 1, 1));
    s.add(new Tile(5, 5, 5, 1, 1));
    s.add(new Tile(6, 6, 6, 1, 1));
    s.add(new Tile(7, 2, 2, 2, 1));
    s.add(new Tile(8, 7, 1, 3, 2));
    s.add(new Tile(9, 2, 2, 1, 3));
    // tiles 1
    s.add(new Tile(10, 8, 2, 1, 4));
    s.add(new Tile(11, 2, 8, 1, 5));
    s.add(new Tile(12, 9, 3, 1, 4));
    s.add(new Tile(13, 4, 9, 1, 6));
    s.add(new Tile(14, 10, 4, 1, 4));
    s.add(new Tile(15, 4, 10, 4, 7));
    s.add(new Tile(16, 3, 2, 1, 8));
    s.add(new Tile(17, 3, 3, 8, 8));
    s.add(new Tile(18, 4, 4, 8, 8));
    s.add(new Tile(19, 5, 5, 8, 8));
    s.add(new Tile(20, 4, 2, 1, 9));
    s.add(new Tile(21, 3, 3, 9, 9));
    s.add(new Tile(22, 4, 4, 9, 9));
    s.add(new Tile(23, 5, 5, 9, 9));
    // tiles 2
    s.add(new Tile(24, 4, 2, 7, 7));
    s.add(new Tile(25, 5, 3, 7, 1));
    s.add(new Tile(26, 4, 4, 7, 7));
    s.add(new Tile(27, 5, 5, 7, 7));
    s.add(new Tile(28, 6, 6, 7, 1));
    s.add(new Tile(29, 11, 2, 6, 1));
    s.add(new Tile(30, 4, 11, 9, 6));
    s.add(new Tile(31, 5, 3, 6, 10));
    s.add(new Tile(32, 4, 4, 6, 6));
    s.add(new Tile(33, 5, 5, 6, 6));
    s.add(new Tile(34, 6, 6, 6, 11));
    s.add(new Tile(35, 12, 2, 10, 1));
    s.add(new Tile(36, 4, 12, 8, 6));
    s.add(new Tile(37, 5, 3, 10, 12));
    s.add(new Tile(38, 6, 6, 10, 11));
    // tiles 3
    s.add(new Tile(39, 13, 2, 1, 13));
    s.add(new Tile(40, 2, 13, 1, 14));
    s.add(new Tile(41, 3, 3, 13, 13));
    s.add(new Tile(42, 14, 2, 14, 1));
    s.add(new Tile(43, 2, 14, 15, 1));
    s.add(new Tile(44, 15, 3, 14, 1));
    s.add(new Tile(45, 5, 15, 16, 14));
    s.add(new Tile(46, 6, 2, 1, 16));
    s.add(new Tile(47, 5, 5, 16, 16));
    s.add(new Tile(48, 6, 6, 16, 16));
    s.add(new Tile(49, 5, 5, 15, 15));
    s.add(new Tile(50, 16, 6, 1, 15));
    s.add(new Tile(51, 6, 16, 1, 17));
    // tiles 4
    s.add(new Tile(52, 17, 3, 17, 1));
    s.add(new Tile(53, 3, 17, 18, 1));
    s.add(new Tile(54, 18, 5, 17, 1));
    s.add(new Tile(55, 3, 18, 19, 20));
    s.add(new Tile(56, 19, 2, 20, 1));
    s.add(new Tile(57, 2, 19, 13, 1));
    s.add(new Tile(58, 20, 5, 20, 1));
    s.add(new Tile(59, 6, 20, 22, 21));
    s.add(new Tile(60, 2, 2, 4, 18));
    s.add(new Tile(61, 2, 3, 4, 18));
    s.add(new Tile(62, 2, 4, 18, 18));
    s.add(new Tile(63, 3, 5, 18, 18));
    s.add(new Tile(64, 6, 6, 18, 18));
    // tiles 5
    s.add(new Tile(65, 2, 2, 1, 19));
    s.add(new Tile(66, 2, 3, 19, 19));
    s.add(new Tile(67, 2, 4, 19, 19));
    s.add(new Tile(68, 2, 5, 19, 19));
    s.add(new Tile(69, 3, 6, 19, 19));
    s.add(new Tile(70, 21, 2, 21, 1));
    s.add(new Tile(71, 2, 21, 23, 1));
    s.add(new Tile(72, 22, 5, 21, 1));
    s.add(new Tile(73, 6, 22, 22, 21));
    s.add(new Tile(74, 3, 3, 23, 23));
    s.add(new Tile(75, 23, 4, 1, 23));
    s.add(new Tile(76, 4, 23, 25, 24));
    // tiles 6
    s.add(new Tile(77, 24, 5, 1, 23));
    s.add(new Tile(78, 5, 24, 25, 24));
    s.add(new Tile(79, 5, 6, 23, 23));
    s.add(new Tile(80, 5, 2, 1, 22));
    s.add(new Tile(81, 3, 3, 22, 22));
    s.add(new Tile(82, 5, 4, 1, 22));
    s.add(new Tile(83, 4, 5, 22, 22));
    s.add(new Tile(84, 6, 6, 22, 22));
    s.add(new Tile(85, 3, 2, 26, 25));
    s.add(new Tile(86, 4, 4, 25, 25));
    s.add(new Tile(87, 5, 5, 25, 25));
    s.add(new Tile(88, 4, 2, 27, 26));
    s.add(new Tile(89, 3, 2, 1, 27));
    // tiles 7
    s.add(new Tile(90, 4, 2, 12, 12));
    s.add(new Tile(91, 5, 3, 12, 12));
    s.add(new Tile(92, 6, 6, 12, 24));
    s.add(new Tile(93, 6, 3, 24, 17));
    s.add(new Tile(94, 6, 6, 24, 24));
    s.add(new Tile(95, 2, 2, 5, 5));
    s.add(new Tile(96, 2, 3, 5, 5));
    s.add(new Tile(97, 2, 4, 5, 5));
    s.add(new Tile(98, 2, 5, 5, 5));
    s.add(new Tile(99, 8, 8, 5, 28));
    // tiles 8
    s.add(new Tile(100, 25, 2, 28, 1));
    s.add(new Tile(101, 2, 25, 29, 1));
    s.add(new Tile(102, 6, 3, 28, 28));
    s.add(new Tile(103, 5, 5, 28, 28));
    s.add(new Tile(104, 6, 6, 28, 28));
    s.add(new Tile(105, 26, 2, 11, 1));
    s.add(new Tile(106, 6, 26, 29, 1));
    s.add(new Tile(107, 6, 3, 11, 11));
    s.add(new Tile(108, 5, 5, 11, 11));
    s.add(new Tile(109, 6, 6, 11, 11));
    s.add(new Tile(110, 27, 5, 1, 29));
    s.add(new Tile(111, 5, 27, 29, 30));
    // tiles 9
    s.add(new Tile(112, 28, 6, 1, 29));
    s.add(new Tile(113, 6, 28, 1, 31));
    s.add(new Tile(114, 4, 2, 30, 1));
    s.add(new Tile(115, 6, 3, 30, 1));
    s.add(new Tile(116, 4, 4, 30, 30));
    s.add(new Tile(117, 5, 5, 30, 30));
    s.add(new Tile(118, 6, 6, 30, 30));
    s.add(new Tile(119, 2, 4, 31, 32));
    s.add(new Tile(120, 5, 5, 31, 14));
    s.add(new Tile(121, 2, 6, 31, 33));
    s.add(new Tile(122, 29, 3, 32, 1));
    s.add(new Tile(123, 3, 29, 34, 1));
    s.add(new Tile(124, 2, 4, 32, 32));
    // tiles 10
    s.add(new Tile(125, 3, 6, 32, 32));
    s.add(new Tile(126, 30, 2, 33, 1));
    s.add(new Tile(127, 2, 30, 34, 1));
    s.add(new Tile(128, 2, 4, 33, 33));
    s.add(new Tile(129, 3, 6, 33, 33));
    s.add(new Tile(130, 2, 2, 34, 34));
    s.add(new Tile(131, 3, 3, 34, 34));
    s.add(new Tile(132, 5, 5, 15, 34));
    // tiles 0 edit
    s.add(new Tile(133, 3, 7, 13, 1));
}

// an object representation of the Jockusch set
function newJset(s) {
    // tiles 0
    s.add(new Tile(0, 0, 0, 0, 0));
    s.add(new Tile(1, 1, 1, 1, 1));
    s.add(new Tile(2, 2, 2, 1, 1));
    s.add(new Tile(3, 3, 3, 1, 1));
    s.add(new Tile(4, 4, 4, 1, 1));
    s.add(new Tile(5, 5, 5, 1, 1));
    s.add(new Tile(6, 6, 6, 1, 1));
    s.add(new Tile(7, 2, 2, 2, 1));
    s.add(new Tile(8, 7, 1, 3, 2));
    s.add(new Tile(9, 2, 2, 1, 3));
    // tiles 1
    s.add(new Tile(10, 2, 2, 5, 4));
    s.add(new Tile(11, 8, 3, 1, 4));
    s.add(new Tile(12, 4, 8, 1, 6));
    s.add(new Tile(13, 9, 4, 1, 4));
    s.add(new Tile(14, 4, 9, 4, 7));
    s.add(new Tile(15, 3, 2, 1, 8));
    s.add(new Tile(16, 3, 3, 8, 8));
    s.add(new Tile(17, 4, 4, 8, 8));
    s.add(new Tile(18, 5, 5, 8, 8));
    s.add(new Tile(19, 4, 2, 1, 9));
    s.add(new Tile(20, 3, 3, 9, 9));
    s.add(new Tile(21, 4, 4, 9, 9));
    s.add(new Tile(22, 5, 5, 9, 9));
    s.add(new Tile(23, 4, 2, 7, 7));
    s.add(new Tile(24, 5, 3, 7, 1));
    s.add(new Tile(25, 4, 4, 7, 7));
    s.add(new Tile(26, 5, 5, 7, 7));
    s.add(new Tile(27, 6, 6, 7, 1));
    // tiles 2
    s.add(new Tile(28, 10, 2, 6, 1));
    s.add(new Tile(29, 4, 10, 9, 6));
    s.add(new Tile(30, 5, 3, 6, 10));
    s.add(new Tile(31, 4, 4, 6, 6));
    s.add(new Tile(32, 5, 5, 6, 6));
    s.add(new Tile(33, 6, 6, 6, 11));
    s.add(new Tile(34, 11, 2, 10, 1));
    s.add(new Tile(35, 4, 11, 8, 6));
    s.add(new Tile(36, 5, 3, 10, 12));
    s.add(new Tile(37, 6, 6, 10, 11));
    s.add(new Tile(38, 12, 2, 1, 13));
    s.add(new Tile(39, 2, 12, 1, 14));
    s.add(new Tile(40, 3, 3, 13, 13));
    s.add(new Tile(41, 13, 2, 14, 1));
    s.add(new Tile(42, 2, 13, 15, 1));
    s.add(new Tile(43, 14, 3, 14, 1));
    s.add(new Tile(44, 5, 14, 16, 14));
    s.add(new Tile(45, 6, 2, 1, 16));
    s.add(new Tile(46, 5, 5, 16, 16));
    s.add(new Tile(47, 6, 6, 16, 16));
    // tiles 3
    s.add(new Tile(48, 5, 5, 15, 15));
    s.add(new Tile(49, 15, 6, 1, 15));
    s.add(new Tile(50, 6, 15, 1, 17));
    s.add(new Tile(51, 16, 3, 17, 1));
    s.add(new Tile(52, 3, 16, 20, 1));
    s.add(new Tile(53, 17, 5, 17, 1));
    s.add(new Tile(54, 3, 17, 18, 19));
    s.add(new Tile(55, 6, 6, 17, 17));
    s.add(new Tile(56, 2, 2, 1, 18));
    s.add(new Tile(57, 2, 3, 18, 18));
    s.add(new Tile(58, 2, 4, 18, 18));
    s.add(new Tile(59, 2, 5, 18, 18));
    s.add(new Tile(60, 3, 6, 18, 18));
    s.add(new Tile(61, 2, 2, 5, 20));
    s.add(new Tile(62, 4, 3, 21, 20));
    s.add(new Tile(63, 4, 4, 20, 20));
    s.add(new Tile(64, 5, 5, 20, 20));
    s.add(new Tile(65, 6, 6, 20, 20));
    s.add(new Tile(66, 18, 2, 19, 1));
    s.add(new Tile(67, 2, 18, 13, 22));
    s.add(new Tile(68, 19, 4, 19, 1));
    s.add(new Tile(69, 6, 19, 25, 23));
    s.add(new Tile(70, 20, 5, 19, 1));
    s.add(new Tile(71, 6, 20, 25, 23));
    // tiles 4
    s.add(new Tile(72, 21, 2, 23, 1));
    s.add(new Tile(73, 2, 21, 24, 22));
    s.add(new Tile(74, 39, 4, 23, 1));
    s.add(new Tile(75, 6, 39, 25, 23));
    s.add(new Tile(76, 22, 5, 23, 1));
    s.add(new Tile(77, 6, 22, 25, 23));
    s.add(new Tile(78, 5, 2, 1, 25));
    s.add(new Tile(79, 3, 3, 25, 25));
    s.add(new Tile(80, 5, 4, 1, 25));
    s.add(new Tile(81, 4, 5, 25, 24));
    s.add(new Tile(82, 6, 6, 25, 25));
    s.add(new Tile(83, 3, 3, 24, 24));
    s.add(new Tile(84, 23, 4, 1, 24));
    s.add(new Tile(85, 4, 23, 27, 26));
    s.add(new Tile(86, 24, 5, 1, 24));
    s.add(new Tile(87, 5, 24, 27, 26));
    s.add(new Tile(88, 5, 6, 24, 24));
    s.add(new Tile(89, 3, 2, 28, 27));
    s.add(new Tile(90, 4, 4, 27, 27));
    s.add(new Tile(91, 5, 5, 27, 27));
    s.add(new Tile(92, 4, 2, 55, 28));
    s.add(new Tile(93, 4, 2, 29, 55));
    s.add(new Tile(94, 3, 2, 1, 29));
    // tiles 5
    s.add(new Tile(95, 4, 2, 12, 12));
    s.add(new Tile(96, 5, 3, 12, 12));
    s.add(new Tile(97, 4, 4, 12, 12));
    s.add(new Tile(98, 5, 5, 12, 12));
    s.add(new Tile(99, 6, 6, 12, 26));
    s.add(new Tile(100, 6, 3, 26, 17));
    s.add(new Tile(101, 6, 6, 26, 26));
    s.add(new Tile(102, 5, 2, 22, 30));
    s.add(new Tile(103, 5, 3, 22, 30));
    s.add(new Tile(104, 5, 5, 22, 1));
    s.add(new Tile(105, 5, 2, 30, 31));
    s.add(new Tile(106, 5, 3, 30, 31));
    s.add(new Tile(107, 5, 5, 30, 1));
    s.add(new Tile(108, 2, 2, 31, 30));
    s.add(new Tile(109, 3, 3, 31, 30));
    s.add(new Tile(110, 2, 2, 5, 21));
    s.add(new Tile(111, 4, 3, 32, 21));
    s.add(new Tile(112, 25, 4, 1, 21));
    s.add(new Tile(113, 4, 25, 4, 33));
    s.add(new Tile(114, 2, 4, 33, 33));
    s.add(new Tile(115, 3, 5, 33, 33));
    s.add(new Tile(116, 6, 6, 33, 1));
    // tiles 6 v.2
    s.add(new Tile(117, 26, 2, 1, 32));
    s.add(new Tile(118, 2, 26, 1, 34));
    s.add(new Tile(119, 27, 3, 1, 32));
    s.add(new Tile(120, 4, 27, 32, 35));
    s.add(new Tile(121, 28, 4, 1, 32));
    s.add(new Tile(122, 4, 28, 1, 34));
    s.add(new Tile(123, 2, 2, 35, 36));
    s.add(new Tile(124, 3, 3, 35, 35));
    s.add(new Tile(125, 4, 4, 35, 35));
    s.add(new Tile(126, 5, 5, 35, 35));
    s.add(new Tile(127, 6, 6, 35, 35));
    s.add(new Tile(128, 2, 2, 36, 37));
    s.add(new Tile(129, 3, 3, 36, 37));
    s.add(new Tile(130, 5, 5, 36, 37));
    s.add(new Tile(131, 4, 2, 37, 38));
    s.add(new Tile(132, 6, 3, 37, 38));
    s.add(new Tile(133, 4, 4, 37, 37));
    s.add(new Tile(134, 4, 5, 37, 38));
    s.add(new Tile(135, 6, 6, 37, 37));
    s.add(new Tile(136, 4, 2, 38, 1));
    s.add(new Tile(137, 6, 3, 38, 1));
    // tiles 7
    s.add(new Tile(138, 2, 2, 34, 39));
    s.add(new Tile(139, 3, 3, 34, 34));
    s.add(new Tile(140, 4, 4, 34, 34));
    s.add(new Tile(141, 5, 5, 34, 34));
    s.add(new Tile(142, 6, 6, 34, 34));
    s.add(new Tile(143, 2, 2, 39, 40));
    s.add(new Tile(144, 3, 3, 39, 41));
    s.add(new Tile(145, 5, 5, 39, 42));
    s.add(new Tile(146, 29, 2, 42, 1));
    s.add(new Tile(147, 2, 29, 43, 1));
    s.add(new Tile(148, 30, 3, 42, 1));
    s.add(new Tile(149, 3, 30, 44, 1));
    s.add(new Tile(150, 4, 4, 42, 42));
    s.add(new Tile(151, 6, 5, 42, 42));
    s.add(new Tile(152, 6, 6, 42, 42));
    s.add(new Tile(153, 2, 4, 43, 43));
    s.add(new Tile(154, 2, 5, 45, 43));
    s.add(new Tile(155, 3, 6, 43, 43));
    s.add(new Tile(156, 2, 4, 44, 44));
    s.add(new Tile(157, 3, 5, 45, 44));
    s.add(new Tile(158, 3, 6, 44, 44));
    s.add(new Tile(159, 2, 2, 45, 45));
    s.add(new Tile(160, 4, 4, 45, 45));
    s.add(new Tile(161, 4, 5, 46, 45));
    s.add(new Tile(162, 5, 5, 47, 46));
    // tiles 8 v.2
    s.add(new Tile(163, 6, 2, 41, 49));
    s.add(new Tile(164, 31, 3, 41, 1));
    s.add(new Tile(165, 3, 31, 48, 1));
    s.add(new Tile(166, 4, 4, 41, 41));
    s.add(new Tile(167, 6, 5, 41, 49));
    s.add(new Tile(168, 6, 6, 41, 41));
    s.add(new Tile(169, 32, 2, 49, 1));
    s.add(new Tile(170, 2, 32, 52, 1));
    s.add(new Tile(171, 33, 3, 49, 1));
    s.add(new Tile(172, 3, 33, 50, 1));
    s.add(new Tile(173, 6, 2, 40, 51));
    s.add(new Tile(174, 34, 3, 40, 1));
    s.add(new Tile(175, 3, 34, 48, 1));
    s.add(new Tile(176, 4, 4, 40, 40));
    s.add(new Tile(177, 6, 5, 40, 51));
    s.add(new Tile(178, 6, 6, 40, 40));
    s.add(new Tile(179, 35, 2, 51, 1));
    s.add(new Tile(180, 2, 35, 50, 1));
    s.add(new Tile(181, 40, 3, 51, 1));
    s.add(new Tile(182, 3, 40, 52, 1));
    s.add(new Tile(183, 2, 2, 47, 48));
    s.add(new Tile(184, 2, 4, 48, 48));
    s.add(new Tile(185, 3, 6, 48, 48));
    // tiles 9
    s.add(new Tile(186, 2, 2, 47, 47));
    s.add(new Tile(187, 3, 3, 47, 47));
    s.add(new Tile(188, 4, 4, 47, 47));
    s.add(new Tile(189, 5, 5, 47, 47));
    s.add(new Tile(190, 6, 6, 20, 47));
    s.add(new Tile(191, 2, 2, 45, 50));
    s.add(new Tile(192, 3, 3, 50, 50));
    s.add(new Tile(193, 2, 4, 50, 50));
    s.add(new Tile(194, 3, 6, 50, 50));
    s.add(new Tile(195, 2, 2, 53, 52));
    s.add(new Tile(196, 3, 3, 52, 52));
    s.add(new Tile(197, 2, 4, 52, 52));
    s.add(new Tile(198, 3, 6, 52, 52));
    s.add(new Tile(199, 2, 2, 53, 53));
    s.add(new Tile(200, 36, 3, 1, 53));
    s.add(new Tile(201, 6, 36, 54, 17));
    s.add(new Tile(202, 4, 4, 53, 53));
    s.add(new Tile(203, 5, 5, 53, 53));
    s.add(new Tile(204, 6, 3, 54, 54));
    s.add(new Tile(205, 6, 6, 1, 54));
    s.add(new Tile(206, 6, 3, 11, 11));
    s.add(new Tile(207, 37, 5, 11, 1));
    s.add(new Tile(208, 3, 37, 18, 19));
    s.add(new Tile(209, 6, 6, 11, 11));
    s.add(new Tile(210, 38, 2, 1, 5));
    s.add(new Tile(211, 2, 38, 1, 12));
    // tiles 0 edit
    s.add(new Tile(212, 3, 7, 13, 1));
}

//
// start up function
//

// creates global variables for all sets
// including the current "set"
var set;
var Hset;
var Jset;
var MYset;

window.onload = function () {
    dragIt();
};

savegame = function () {
    if (map.tiles_placed == 0) {
        alert("No game in progress!");
    }
    else {
        Game.save();
        alert("Game saved!")
    }
}

/* function for changing the gamemode
 * @param t     the character representing the game
 */
chooseGame = function (t = "U") {
    map.board[0] = [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 7, 8, 9, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];
    map.rows = 10;
    map.cols = 15;
    if (t == "H") {
        Hset = new Set();
        newHset(Hset);
        set = Hset;
        map.tile_score = 3;
        map.tiles_placed = 0;
    }
    else if (t == "J") {
        Jset = new Set();
        newJset(Jset);
        set = Jset;
        map.tile_score = 3;
        map.tiles_placed = 0;
    }
    else if (t == "U") {
        set = MYset;
        map.board[0] = [
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
        ];
        map.tile_score = 1;
        map.tiles_placed = 0;
    }
    Game.run();
}