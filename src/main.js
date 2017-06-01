require(['THREE', 'ROT'], function (THREE, ROT) {

    'use strict';

    //https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_minecraft.html
    var gameloop = (function () {

        var reqAnimFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

        return function (callback) {
            var lastUpdate = +new Date();
            (function loop() {
                callback(((+new Date()) - lastUpdate) / 1000);
                reqAnimFrame(loop);
                lastUpdate = +new Date();
            }());
        };
    }());

    // ----
    function rtod(r) {
        return r * (180 / Math.PI);
    }

    function dtor(d) {
        return d * (Math.PI / 180);
    }

    // ----
    // Scene size
    const WIDTH = 512;
    const HEIGHT = 512;

    // Set camera attribs
    const VIEW_ANGLE = 75;
    const ASPECT = WIDTH / HEIGHT;
    const NEAR = 0.1;
    const FAR = 10000;

    // Dom el to attach to
    const container = document.querySelector("#gameDiv");

    // Create web gl rendered, camera and scene (all required)
    const renderer = new THREE.WebGLRenderer();
    const camera =
        new THREE.PerspectiveCamera(
            VIEW_ANGLE,
            ASPECT,
            NEAR,
            FAR
        );

    const scene = new THREE.Scene();

    // Add the camera
    scene.add(camera);

    // var raycaster = new THREE.Raycaster(new THREE.Vector3(), new THREE.Vector3(0, -1, 0), 0, 10);

    // Start the renderer
    renderer.setSize(WIDTH, HEIGHT);

    // Attach
    container.appendChild(renderer.domElement);

    // ----
    // let map = [];

    // let mapData = [];

    // // Game Map
    // ROT.RNG.setSeed(1234);
    // var m = new ROT.Map.Digger();
    // var display = new ROT.Display({fontSize:8});
    // m.create(display.DEBUG);

    // var rooms = m.getRooms();
    // var corridors = m.getCorridors();

    // var thing = rooms.concat(corridors);

    // var drawDoor = function(x, y) {
    //     display.draw(x, y, "", "", "red");
    // };

    // for (let col = 0; col < m._width; col++) {

    //     map.push([]);

    //     for (let row = 0; row < m._height; row++) {

    //         map[col][row] = 0;

    //     }

    // }

    // thing.forEach(function(t){

    //     if(typeof t.getTop === 'function') {

    //         let x = t.getLeft();
    //         let y = t.getTop();

    //         let right = t.getRight();
    //         let bottom = t.getBottom();

    //         map[x][y] = 1;

    //         for(var i = 0; i < right; i++) {
    //             map[i][y] = 1;
    //         }

    //         for(var j = 0; j < bottom; j++) {
    //             map[x][j] = 1;
    //         }

    //     }

    // });

    // console.log(map);

    // for (var i=0; i<rooms.length; i++) {
    //     var room = rooms[i];

    //     // SHOW("Room #%s: [%s, %s] => [%s, %s]".format(
    //     //     (i+1),
    //     //     room.getLeft(), room.getTop(),
    //     //     room.getRight(), room.getBottom()
    //     // ));

    //     //room.getDoors(drawDoor);
    // }

    function calculateTileIndex(above, below, left, right) {
        var sum = 0;
        if (above) sum += 1;
        if (left) sum += 2;
        if (below) sum += 4;
        if (right) sum += 8;
        return sum;
    };

    let mapData = [];

    let map = [
        [1, 1, 1, 1, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 0, 0, 0, 1],
        [1, 1, 1, 1, 1]
    ];

    let map2 = [];

    for (let i = 0; i < map.length; i++) {

        map2.push([]);

        for (let j = 0; j < map[i].length; j++) {

            let n = calculateTileIndex(
                j > 0 ? map[i][j - 1] : 1,
                j < map.length - 1 ? map[i][j + 1] : 1,
                i > 0 ? map[i - 1][j] : 1,
                i < map[i].length - 1 ? map[i + 1][j] : 1
            );

            map2[i][j] = n;

        }

    }

    console.log(JSON.stringify(map2));

    function generateMapSets() {

        for (let col = 0; col < map2.length; col++) {

            for (let row = 0; row < map2[col].length; row++) {

                let current = map2[col][row];

                switch (current) {
                    case 14:
                        mapData.push({
                            col: col,
                            x: -48,
                            z: -96,
                            rotation: 90
                        });
                        break;
                    case 11:
                        mapData.push({
                            col: col,
                            x: 48,
                            z: -96,
                            rotation: -90
                        });
                        break;
                    case 13:
                        mapData.push({
                            col: col,
                            x: 0,
                            z: -96,
                            rotation: 0
                        });
                        break;
                    case 7:
                        mapData.push({
                            col: col,
                            x: 0,
                            z: -96,
                            rotation: 180
                        });
                        break;
                }

            }

        }

    }

    generateMapSets();

    // ----
    // Textures (obviously would have more than one normally :P)
    // https://stackoverflow.com/questions/7919516/using-textures-in-three-js
    var loader = new THREE.TextureLoader();
    loader.load('resources/Pixel_BrickWall2x4.png', onLoad);

    function onLoad(texture) {

        let objects = [];

        // ----
        const wallMaterial =
            new THREE.MeshPhongMaterial(
                {
                    map: texture,
                    shading: THREE.FlatShading
                });

        // Create a new wall
        mapData.forEach(function (item, i) {

            let wall = new THREE.Mesh(

                new THREE.PlaneGeometry(
                    96,
                    96
                ),

                wallMaterial);

            // Position it a bit
            wall.position.x = item.x; // Why '96' ?

            // Move the sphere back in z so we can see it
            wall.position.z = item.z * item.col;

            // Rotate it a bit
            wall.rotation.y = dtor(item.rotation);

            // Add it to the scene
            scene.add(wall);

            // Cache objects
            objects.push(wall);

        });

        // Lighting
        const pointLight =
            new THREE.PointLight(0xFFFFFF);

        // Set pos
        pointLight.position.x = 10;
        pointLight.position.y = 50;
        pointLight.position.z = 130;

        // Add it to the scene
        scene.add(pointLight);

        // ----
        let game = {

            update: function () {
                // Render (can call once but wont simulate movement)
                renderer.render(scene, camera);
            }

        };

        // ----
        gameloop(function (dt) {

            // globalFSM.Update();
            game.update();

        });

    }

});