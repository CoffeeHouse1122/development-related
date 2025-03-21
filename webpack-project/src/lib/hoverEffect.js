import * as THREE from "three";
import { TweenMax } from "../lib/TweenMax.js";
import $ from "jquery";

export function hoverEffect() {
  function i() {
    for (var e = arguments, t = 0; t < arguments.length; t++)
      if (void 0 !== e[t]) return e[t];
  }

  let parent = document.querySelector(".my-div");
  let displacementImage = require("../images/20230818-113500.jpg");
  let image1 = require("../images/img1.jpg");
  let image2 = require("../images/img2.jpg");
  let intensity = 0.1;
  let angle = Math.PI;

  // 创建场景
  const scene = new THREE.Scene();
  // 正视摄像机
  const camera = new THREE.OrthographicCamera(
    parent.offsetWidth / -2,
    parent.offsetWidth / 2,
    parent.offsetHeight / 2,
    parent.offsetHeight / -2,
    1,
    1000
  );
  // 摄像机放在z轴
  camera.position.z = 1;
  // 创建渲染器对象
  let renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true });
  // 设置设备像素比
  renderer.setPixelRatio(window.devicePixelRatio);
  // 设置背景颜色
  renderer.setClearColor(16777215, 0);
  renderer.setSize(parent.offsetWidth, parent.offsetHeight);
  parent.appendChild(renderer.domElement);

  var w = function () {
    renderer.render(scene, camera);
  };

  //纹理贴图加载器TextureLoader
  const texLoader = new THREE.TextureLoader();
  texLoader.crossOrigin = "";
  let dispTexture = texLoader.load(displacementImage, w);

  let img1Texture = texLoader.load(image1, w);
  let img2Texture = texLoader.load(image2, w);

  img1Texture.magFilter = img2Texture.magFilter = THREE.LinearFilter;
  img1Texture.minFilter = img2Texture.minFilter = THREE.LinearFilter;

  var rippleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      intensity1: { type: "f", value: intensity },
      intensity2: { type: "f", value: intensity },
      dispFactor: { type: "f", value: 0 },
      angle1: { type: "f", value: angle },
      angle2: { type: "f", value: angle },
      texture1: { type: "t", value: img1Texture },
      texture2: { type: "t", value: img2Texture },
      disp: { type: "t", value: dispTexture },
    },
    vertexShader: `varying vec2 vUv;
       void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1 );
       }`,
    fragmentShader: `varying vec2 vUv;
      
       uniform float dispFactor;
       uniform sampler2D disp;
       
       uniform sampler2D texture1;
       uniform sampler2D texture2;
       uniform float angle1;
       uniform float angle2;
       uniform float intensity1;
       uniform float intensity2;
       
       mat2 getRotM(float angle) {
          float s = sin(angle);
          float c = cos(angle);  
          return mat2(c, -s, s, c);
        }
        
      void main() {
          vec4 disp = texture2D(disp, vUv);
          vec2 dispVec = vec2(disp.r, disp.g);
          vec2 distortedPosition1 = vUv + getRotM(angle1) * dispVec * intensity1 * dispFactor;
          vec2 distortedPosition2 = vUv + getRotM(angle2) * dispVec * intensity2 * (1.0 - dispFactor);
          vec4 _texture1 = texture2D(texture1, distortedPosition1);
          vec4 _texture2 = texture2D(texture2, distortedPosition2);
          gl_FragColor = mix(_texture1, _texture2, dispFactor);
        }`,
    transparent: !0,
    opacity: 1,
  });

  // ???
  let _ = new THREE.PlaneGeometry(parent.offsetWidth, parent.offsetHeight, 1);

  let R = new THREE.Mesh(_, rippleMaterial);

  scene.add(R);

  parent.addEventListener("mouseenter", S);
  parent.addEventListener("touchstart", S);
  parent.addEventListener("mouseleave", T);
  parent.addEventListener("touchend", T);

  function S() {
    TweenMax.to(rippleMaterial.uniforms.dispFactor, 1, {
      value: 1,
      ease: Expo.easeOut,
      onUpdate: w,
      onComplete: w,
    });
  }

  function T() {
    TweenMax.to(rippleMaterial.uniforms.dispFactor, 1, {
      value: 0,
      ease: Expo.easeOut,
      onUpdate: w,
      onComplete: w,
    });
  }
}
