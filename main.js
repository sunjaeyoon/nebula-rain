//STARTING VARIABLES
let scene, camera, renderer;
let controls;

//ANIMATION VARIBLES
let starGeo, stars;
let cloudGeo, cloudMaterial;
let cloudParticles = [];

// RUN CODE
init();

function init() {
    //SCENE, CAMERA, RENDERER
    SCR();

    //Orbit Controls
    //controls = new THREE.OrbitControls( camera, renderer.domElement );

    //Ambient Lighting
    let ambient = new THREE.AmbientLight(0x555555);
    scene.add(ambient);

    let directionalLight = new THREE.DirectionalLight(0xff8c19);
    directionalLight.position.set(0, 0, 1);
    scene.add(directionalLight);

    let orangeLight = new THREE.PointLight(0xcc6600, 50, 450, 1.7);
    orangeLight.position.set(200, 300, 100);
    scene.add(orangeLight);
    let redLight = new THREE.PointLight(0xd8547e, 50, 450, 1.7);
    redLight.position.set(100, 300, 100);
    scene.add(redLight);
    let blueLight = new THREE.PointLight(0x3677ac, 50, 450, 1.7);
    blueLight.position.set(300, 300, 200);
    scene.add(blueLight);

    //FOG 
    scene.fog = new THREE.FogExp2(0x03544e, 0.001);
    renderer.setClearColor(scene.fog.color);

    //Objects
    starGeo = new THREE.Geometry();
    for (var i = 0; i < 10000; i++) {
        var star = new THREE.Vector3(
            Math.random() * 600 - 300,
            Math.random() * 600 - 300,
            Math.random() * 600 - 300
        )
        star.velocity = 0;
        star.acceleration = 0.0001;
        starGeo.vertices.push(star);
    }

    let sprite = new THREE.TextureLoader().load("image.png", function(texture){
        let starMaterial = new THREE.PointsMaterial({
            color: 0xaaaaaa,
            size: 0.7,
            map: texture
        });

        stars = new THREE.Points(starGeo, starMaterial);
        scene.add(stars);
        }
    );

    //Making the Clouds
    let loader = new THREE.TextureLoader();
    loader.load("smoke.png", function (texture) {
        cloudGeo = new THREE.PlaneBufferGeometry(500, 500);
        cloudMaterial = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        });

        for (let p = 0; p < 100; p++) {
            let cloud = new THREE.Mesh(cloudGeo, cloudMaterial);
            cloud.position.set(
                Math.random() * 800 - 400,
                500,
                Math.random() * 500 - 500
            );
            cloud.rotation.x = 1.16;
            cloud.rotation.y = -0.12;
            cloud.rotation.z = Math.random() * 2 * Math.PI;
            cloud.material.opacity = 0.55;
            cloudParticles.push(cloud);
            scene.add(cloud);
        }
    
    });

    window.addEventListener('resize', onWindowResize, false);
    animate();
}

//EVENTS----------------------------------------------------
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

//INIT SETUPs-----------------------------------------------
function SCR(){
    //Scene (1)
    scene = new THREE.Scene();

    //Camera (2)
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    //camera.position.set(0, 0, 0);
    camera.position.z = 1;
    camera.rotation.x = 1.16;
    camera.rotation.y = -0.12;
    camera.rotation.z = 0.27;

    //Renderer (3)
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}


//ANIMATION-------------------------------------------------
function animate() {
    //Animate Clouds 
    movement();
    //controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

function movement(){
    //Star Animation
    starGeo.vertices.forEach(p => {
        p.velocity += p.acceleration;
        p.y -= p.velocity;
        if (p.y < -200) {
            p.y = 200;
            p.velocity = 0;
        }
    });
    starGeo.verticesNeedUpdate = true;
    //stars.rotation.y -=0.001;

    //Cloud Animation
    cloudParticles.forEach(p => {
        p.rotation.z -=0.01;
    });
}



