import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";
import vertex from "./shader/vertexShader.glsl";
import fragment from "./shader/fragmentShader.glsl";

class Model {
  constructor(obj) {
    this.name = obj.name;
    this.file = obj.file;
    this.scene = obj.scene;

    this.isActive = false;

    this.color1 = obj.color1;
    this.color2 = obj.color2;

    this.loader = new GLTFLoader();
    this.dracoLoader = new DRACOLoader();
    this.dracoLoader.setDecoderPath("./draco/");
    this.loader.setDRACOLoader(this.dracoLoader);

    this.init();
  }
  init() {
    console.log("yeet");
    this.loader.load(this.file, (response) => {
      //MESH
      this.mesh = response.scene.children[0];

      //MESH material
      this.material = new THREE.MeshBasicMaterial({
        color: "white",
        wireframe: true,
      });
      this.mesh.material = this.material;

      //MESH material
      this.geometry = this.mesh.geometry;

      //PARTICLES material
      this.particlesMaterial = new THREE.ShaderMaterial({
        uniforms: {
          uColor1: { value: new THREE.Color(this.color1) },
          uColor2: { value: new THREE.Color(this.color2) },
          uTime: { value: 0 },
        },
        vertexShader: vertex,
        fragmentShader: fragment,
        //    transparent: true,
        depthTest: false,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      //PARTICLES geometry
      const sampler = new MeshSurfaceSampler(this.mesh).build();
      const numParticles = 10000;
      this.particlesGeometry = new THREE.BufferGeometry();
      const particlesPosition = new Float32Array(numParticles * 3);
      const particlesRandomness = new Float32Array(numParticles * 3);

      for (let i = 0; i < numParticles; i++) {
        const newPosition = new THREE.Vector3();
        sampler.sample(newPosition);
        particlesPosition.set([newPosition.x, newPosition.y, newPosition.z], i * 3);

        particlesRandomness.set([Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1], i * 3);
      }
      this.particlesGeometry.setAttribute("position", new THREE.BufferAttribute(particlesPosition, 3));
      this.particlesGeometry.setAttribute("aRandom", new THREE.BufferAttribute(particlesRandomness, 3));

      //PARTICLES
      this.particles = new THREE.Points(this.particlesGeometry, this.particlesMaterial);

      this.scene.add(this.particles);
      this.isActive = true;
    });
  }
}
export default Model;
