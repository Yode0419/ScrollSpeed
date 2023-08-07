const speedElement = document.getElementById('speed');
const highestSpeedElement = document.getElementById('highestSpeed');
const resetButton = document.getElementById('resetButton');
const speedText = document.getElementById('speedText'); //修改文字顏色大小
const speedTextExtra = document.getElementById('speedTextExtra'); //額外增加文字

let scrollSpeed = 0;
let highestSpeed = 0;
let animationFrameId = null;

function SpeedDown() {
    speedElement.textContent = Math.round(scrollSpeed);

    // 更新speedText的樣式
    if (scrollSpeed >= 0 && scrollSpeed < 1000) {
        speedText.style.color = 'black';
        speedText.style.fontSize = '1rem';
        speedTextExtra.style.display = 'none';
    } else if (scrollSpeed >= 1000 && scrollSpeed < 5000) {
        speedText.style.color = 'blue';
        speedText.style.fontSize = '1.25rem';
        speedTextExtra.style.display = 'none';
    } else if (scrollSpeed >= 5000 && scrollSpeed < 10000) {
        speedText.style.color = 'red';
        speedText.style.fontSize = '1.5rem';
        speedTextExtra.style.display = 'none';
    } else if (scrollSpeed >= 10000) {
        speedText.style.color = 'orange';
        speedText.style.fontSize = '3rem';
        // 顯示額外的文字
        speedTextExtra.style.display = 'block';
        speedTextExtra.style.color = 'orange';
        speedTextExtra.style.fontSize = '3rem';
        speedTextExtra.textContent = '乾 燒起來辣!';
    }

    if (scrollSpeed > 1) {
        // 逐漸減少滾動速度
        scrollSpeed *= 0.99;
        animationFrameId = requestAnimationFrame(SpeedDown);
    } else {
        // 清除定時器，滾動速度接近0
        cancelAnimationFrame(animationFrameId);
    }
}

let prevY=0;
let currentY=0;

function handleScroll(event) {
    let delta = 0;
    if (event.type === 'touchmove') {
        // 在手機上使用手指觸控滑動，可以使用 event.touches[0] 來獲取觸控信息
        currentY=event.touches[0].clientY;
        delta = (currentY-prevY)*3;
        prevY=currentY;
    } else {
        // 在電腦上使用滑鼠滾輪滾動操作，可以使用 event.deltaY 獲取滾動方向和滾動速度
        delta = event.deltaY || event.detail || event.wheelDelta;
    }

    // 累加滾動的速度
    scrollSpeed += Math.abs(delta);

    // 更新最高滾動像素量
    if (scrollSpeed > highestSpeed) {
        highestSpeed = scrollSpeed;
        highestSpeedElement.textContent = Math.round(highestSpeed);
    }

    // 防止滾動時觸發預設行為，例如頁面滾動
    event.preventDefault();

    // 重置定時器
    cancelAnimationFrame(animationFrameId);
    // 啟動定時器來逐漸減少滾動速度
    animationFrameId = requestAnimationFrame(SpeedDown);


}

function resetSpeed() {
    scrollSpeed = 0;
    highestSpeed = 0;
    speedElement.innerText = scrollSpeed;
    highestSpeedElement.innerText = highestSpeed;
}

// 為 touchmove 事件添加監聽器，這樣在手機上可以支持手指觸控滑動
document.addEventListener('touchmove', handleScroll, {
    passive: false
});

// 為滾動事件添加監聽器，這樣在電腦上可以繼續使用滑鼠滾輪滾動操作
if ('onwheel' in document) {
    // 支持現代瀏覽器
    document.addEventListener('wheel', handleScroll, {
        passive: false
    });
} else if ('onmousewheel' in document) {
    // 支持舊版IE
    document.addEventListener('mousewheel', handleScroll, {
        passive: false
    });
} else {
    // Firefox
    document.addEventListener('DOMMouseScroll', handleScroll, {
        passive: false
    });
}

// 歸零按鈕點事件擊監聽器
resetButton.addEventListener('click', resetSpeed);









//THREE.js
import * as THREE from 'three';
import {
    OrbitControls
} from 'three/addons/controls/OrbitControls.js';
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';

let container = document.querySelector('.container3D');
let emu, mixer, emuRun, clock = new THREE.Clock();
// 產生一個場景
const scene = new THREE.Scene();

// 產生一個相機
const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
);

// 設定相機的位置
camera.position.set(0, 5, 5);
camera.lookAt(0, 2, 0);

// 選定渲染器
const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});

// enabling shadows
renderer.shadowMap.enabled = true;

//{antialias: true, alpha: true}
// 初始渲染畫面尺寸
renderer.setSize(container.clientWidth, container.clientHeight);

// 加入 canvas 元素供渲染畫面
container.appendChild(renderer.domElement);

// 產生平面物體
const planeGeometry = new THREE.PlaneGeometry(6, 6);
const planeMaterial = new THREE.MeshPhongMaterial({
    color: '#6D6D6D',
    // 雙面著色
    side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2;
plane.castShadow = false;
plane.receiveShadow = true;

// 設定平面物體在場景的位置
plane.position.set(0, 0, 0);
scene.add(plane);

//// 產生一個藍色正方形物體
//const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
//const cubeMaterial = new THREE.MeshLambertMaterial({
//    color: '#429ef5'
//});
//
//const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
//
//// 設定正方形物體的位置
//cube.position.set(0, 0.5, 0);
//scene.add(cube);



// Load Modal
let loader = new GLTFLoader();
loader.load('./public/EmuJr.gltf',
    function (gltf) {
        //If the file is loaded, add it to the scene
        emu = gltf.scene;
        emu.traverse(function (node) {
            if (node.isMesh) {
                node.castShadow = true;
            }
        })

        scene.add(emu);


        let fileAnimations = gltf.animations;
        mixer = new THREE.AnimationMixer(emu);
        let animationName = THREE.AnimationClip.findByName(fileAnimations, 'ArmatureAction')
        emuRun = mixer.clipAction(animationName);
        emuRun.play();

    },
    function (xhr) {
        //While it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        //If there is an error, log it
        console.error(error);
    }
);





// 建立光源
let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x333333, 3);
scene.add(ambientLight);

// 設定動畫
function animate() {
    // 循環觸發渲染以產生動畫
    requestAnimationFrame(animate);

    // 設定EMU跑步動畫
    if (mixer) {
        mixer.update(clock.getDelta());
    }

    // 設定EMU轉動效果
    if (emu) {
        emu.position.set(2, 2, 1);
        emu.rotation.z = Math.PI / 2;
        emu.rotation.x = (emu.rotation.x += scrollSpeed / 10000) % (Math.PI * 2);
//        console.log(scrollSpeed);
        }

        // 設定正方形轉動效果
        //    cube.rotation.x += scrollSpeed / 10000;
        renderer.render(scene, camera);
    }

    // 開始執行動畫
    animate();

    // 配合視窗大小自動更新
    function onWindowResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(container.clientWidth, container.clientHeight);
    }

    window.addEventListener('resize', onWindowResize);
