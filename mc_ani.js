class MC_ani {
    constructor() {
        this.scene;
        this.player = {};
        this.renderer;
        this.camera;
        this.orbCtrl; 
        this.clock = new THREE.Clock();
        this.container;
        this.container = document.createElement('div');
        document.body.appendChild(this.container);
        const game = this;
        this.aniInit();

    }

    aniInit() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color("#c7d3ef");
        this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const light = new THREE.DirectionalLight("#FFFFFF", 1 );
        light.position.set(0, 20, 10); // 조명
        light.castShadow = true; // 그림자 생성
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        light.shadow.camera.left = -100;
        light.shadow.camera.right = 100;
        this.shadow = light; //나중에 쓰기위해
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight); //지금 윈도우 사이즈에 맞춰라
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);

        const ambient = new THREE.AmbientLight("#FFFFFF", 0.8 );

        const bw_bottoms = -1 ; // 바닥높이를 일괄처리하기위해
        // 큐브 생성
        // const material = new THREE.MeshPhongMaterial({ color: "#ffffff" });
        // this.cube = new THREE.Mesh(geometry, material);

        // 바닥연출
        // var mesh = new THREE.Mesh(
        //     new THREE.PlaneBufferGeometry(5000, 5000),
        //     new THREE.MeshPhongMaterial({ color: "000000", depthWrite: false }));
        // mesh.rotation.x = - Math.PI / 2;
        // mesh.position.y = bw_bottoms; //ex -30
        // mesh.receiveShadow = true;
        // this.scene.add(mesh);

        var grid = new THREE.GridHelper(100, 50, 0x000000, 0x000000);
        grid.position.y = bw_bottoms; // ex -30
        grid.material.transparent = true;
        grid.material.opacity = 0.3;
        this.scene.add(grid);

        this.camera.position.set(5, 5, 10);
        // this.camera.position.x = 5; // 좌우
        // this.camera.position.y = 5; // 높이
        // this.camera.position.z = 10; // 원근
        // this.camera.lookAt(-100,100,0); //효과가 없음. 
        
        const fbxloader = new THREE.FBXLoader();
        fbxloader.load(`./assets/machine_a013.fbx`, function (object) {
            object.mixer = new THREE.AnimationMixer(object);
            object.name = "MC"
            game.player.mixer = object.mixer;
            game.player.root = object.mixer.getRoot;
            console.log(object.mixer.getRoot());

            game.scene.add(object);
            object.position.y = bw_bottoms; //땅 높이랑 맞춘거
            object.position.z = 0;
            object.scale.x = 0.01;
            object.scale.y = 0.01;
            object.scale.z = 0.01;

            object.traverse(function (child) {
                if (child.isMesh) {
                    child.castShadow = true;
                }
            });

            game.player.object = object;

            game.nextAni(fbxloader)
        });

        //예제에서 오브젝트 하나 더 만들었지만 난 생략. 줄 어딘지 찾도록 공백. 







        this.scene.add(this.cube);
        this.scene.add(light);
        this.scene.add(ambient);

        //마우스로 시점 전환 가능해짐.
        this.orbCtrl
            = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.orbCtrl.target.set(0, 0, 0);
        this.orbCtrl.update();

        // this.animate();

    }

    nextAni(fbxloader) {

        const game = this;
        fbxloader.load(`./assets/machine_a013.fbx`,
            function (object) {
                game.selAction = 0 // ex 0, 내 경우 idle이 2번이라 바꿈.
                game.GamePad = new GamePad({
                    game: game // game.js 파일을 사용함
                });

                game.animate();
            });

    }

    set selAction(num) {
        const action = this.player.mixer.clipAction(game.player.object.animations[num]);
        this.player.mixer.stopAllAction();  // 기존의 동작은 정지한다.
        action.fadeIn(0.5);
        action.play();
    }

    changeAction() {
        game.selAction =
            document.getElementById("changeAction").value;
    }


    animate() {
        const game = this;
        const dt = this.clock.getDelta();
        requestAnimationFrame(function () { game.animate(); });
        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.01;
        // this.cube.rotation.z += 0.01;
        // this.cube.position.x += -0.01;
        // this.cube.position.y += -0.01;
        // this.cube.position.z += -0.01;
        // if (this.player.mixer !== undefined) {
            this.player.mixer.update(dt);
        // }


        this.renderer.render(this.scene, this.camera);

    }




}



