import 'reset-css';
import React, { Component } from 'react';
import { render } from 'react-dom';

import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import model from './models/room.glb';

class App extends Component {
  loadRoom(scene) {
    var loader = new GLTFLoader();

    var dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath(
      'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/js/libs/draco/'
    );
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      model,
      function (gltf) {
        scene.add(gltf.scene);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
      },
      function (error) {
        console.log('An error occured');
      }
    );
  }

  loadLights(scene) {
    var light1 = new THREE.AmbientLight('white', 3); // soft white light
    scene.add(light1);
  }

  loadSphere(scene) {
    var geometry = new THREE.SphereGeometry(0.1, 16, 16);
    var material = new THREE.MeshBasicMaterial({ color: 'black' });
    var sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);
  }

  componentDidMount() {
    var scene = new THREE.Scene();
    scene.background = new THREE.Color('white');
    var camera = new THREE.PerspectiveCamera(
      10,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;

    this.mount.appendChild(renderer.domElement);

    this.loadSphere(scene);
    this.loadRoom(scene);
    this.loadLights(scene);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.enableZoom = true;
    controls.autoRotate = true;

    camera.position.z = 150;
    camera.up = new THREE.Vector3(0, -1, 0);
    controls.update();

    var animate = function () {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();
  }
  render() {
    return <div ref={(ref) => (this.mount = ref)} />;
  }
}

render(<App />, document.getElementById('root'));
