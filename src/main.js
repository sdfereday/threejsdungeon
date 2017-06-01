require(['THREE'], function (THREE) {

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
    // Game Map
    let map = [
        [1, 0, 2],
        [1, 0, 2],
        [1, 3, 2]
    ];

    let mapData = [];

    function generateMapSets() {

        for (let col = 0; col < map.length; col++) {

            for (let row = 0; row < map[col].length; row++) {

                let current = map[col][row];

                switch (current) {
                    case 1:
                        mapData.push({
                            col: col,
                            x: -48,
                            z: -96,
                            rotation: 90
                        });
                        break;
                    case 2:
                        mapData.push({
                            col: col,
                            x: 48,
                            z: -96,
                            rotation: -90
                        });
                        break;
                    case 3:
                        mapData.push({
                            col: col,
                            x: 0,
                            z: -96,
                            rotation: 0
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