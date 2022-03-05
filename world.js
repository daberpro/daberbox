import * as THREE from "three";
import { PointLight, Mesh, BoxBufferGeometry, PerspectiveCamera, Scene, WebGLRenderer, Vector3, MeshBasicMaterial, CircleBufferGeometry, ConeBufferGeometry, CylinderBufferGeometry, DodecahedronBufferGeometry, IcosahedronBufferGeometry, OctahedronBufferGeometry, PlaneBufferGeometry, RingBufferGeometry, SphereBufferGeometry, TetrahedronBufferGeometry, TorusBufferGeometry, TorusKnotBufferGeometry } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import WebGL  from "three/examples/jsm/capabilities/WebGL.js";
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import CannonDebugger from 'cannon-es-debugger';

export class World {

  #_Material = {};

  constructor({ width, height }) {

    this._Scene = new Scene();
    this._Scene.background = new THREE.Color("silver");
    this._Camera = new PerspectiveCamera(45, width / height, 1, 2000);
    this._Render = new WebGLRenderer({ antialias: true });
    this._Render.setSize(width, height);
    this._Render.setPixelRatio(window.devicePixelRatio);
    this._Control = null;
    this._Render.shadowMap.enabled = true;
    this._CannonDebug = null;
    this._Render.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap


  }

  // ============== Functional ===================

  DebugCannon(cannonWorld){

    this._CannonDebug = new CannonDebugger(this._Scene,cannonWorld);

  }

  Color(c) {

    return new THREE.Color(c);

  }

  Vector2({x,y}){

    return new THREE.Vector2(x,y);

  }

  Vector3({x,y,z,r,g,b}){

    return new THREE.Vector3(x || r,y || g,z || b);

  }

  Vector4({x,y,z,r,g,b,a}){

    return new THREE.Vector4(x || r,y || g,z || b,a);

  }

  get resolution(){

    const width = this._Render.domElement.width;
    const height = this._Render.domElement.height;

    return {
      width,
      height
    }

  }

  Material({ name, kind, config }) {

    this.#_Material[name] = new THREE[`Mesh${kind}Material`](config);

  }

  ShaderMaterial({sourceVertexShader, sourceFragmentShader, uniforms, shaderName}){

    const materialShader = new THREE.ShaderMaterial({

      uniforms,
      vertexShader: sourceVertexShader,
      fragmentShader: sourceFragmentShader

    });

    this.#_Material[shaderName] = materialShader;

  }

  Camera({ x = 0, y = 0, z = 0, lookAt }) {

    if (lookAt === void 0) lookAt = { x: 0, y: 0, z: 0 };

    this._Camera.position.set(x, y, z);
    this._Camera.lookAt(new Vector3(lookAt.x, lookAt.y, lookAt.z));

    return this._Camera;

  }

  Init({ target }) {

    if ( WebGL.isWebGLAvailable() ) {

      target.appendChild(this._Render.domElement);
      this.resizeRendererToDisplaySize();
    
    } else {
    
      const warning = WebGL.getWebGLErrorMessage();
      document.body.appendChild( warning );
    
    }

  }

  Run() {

    if(this._CannonDebug !== null) this._CannonDebug.update();
    this._Render.render(this._Scene, this._Camera);
    this._Control.update();

  }

  resizeRendererToDisplaySize() {

    const _Render = this._Render;
    const _Camera = this._Camera;

    window.onresize = () => {

      const canvas = _Render.domElement;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      _Render.setSize(window.innerWidth, window.innerHeight, false);
      _Camera.aspect = window.innerWidth / window.innerHeight;
      _Camera.updateProjectionMatrix();

    }

  }

  OrbitControl() {

    const control = new OrbitControls(this._Camera, this._Render.domElement);
    control.update();
    control.enableDamping = true;
    control.target.y = 0.5
    this._Control = control;

  }

  // ================ Loader ====================

  FileLoader({file}){

    return new Promise((res)=>{

      new THREE.FileLoader().load(file,(data)=>{

        res(data);
  
      });

    });
    
  }

  FontLoader({file}){

    return new Promise((res)=>{

      new FontLoader().load(file,(data)=>{

        res(data);
  
      });

    });
    
  }

  ImageLoader({file}){

    return new Promise((res)=>{

      new THREE.ImageLoader().load(file,(data)=>{

        res(data);
  
      });

    });
    
  }

  MaterialLoader({file}){

    return new Promise((res)=>{

      new THREE.MaterialLoader().load(file,(data)=>{

        res(data);
  
      });

    });

  }

  PointsMaterial({materialName, color}){

    this.#_Material[materialName] = new THREE.PointsMaterial({color});

  }

  // ================ helper ====================

  GridHelper({ size, divisions }) {

    const gridHelper = new THREE.GridHelper(size, divisions);
    this._Scene.add(gridHelper);

  }

  ArrowHelper({from,to,length,color}) {

    const dir = new THREE.Vector3(to.x, to.y, to.z);
    //normalize the direction vector (convert to vector of length 1)
    dir.normalize();

    const origin = new THREE.Vector3(from.x, from.y, from.z);

    const arrowHelper = new THREE.ArrowHelper(dir, origin, length, color);
    this._Scene.add(arrowHelper);

  }

  AxesHelper({size = 5}){

    const axesHelper = new THREE.AxesHelper( size );
    this._Scene.add( axesHelper );

  }

  BoxHelper({object,color = 0xffff00}){

    const box = new THREE.BoxHelper( object, color ); 
    this._Scene.add( box );

  }

  CameraHelper({camera}){

    const helper = new THREE.CameraHelper( camera );
    this._Scene.add( helper );

  }

  DirectionalLightHelper({light,size = 5,color = 0xffffff}){

    const helper = new THREE.DirectionalLightHelper( light, size, color );
    this._Scene.add( helper );

  }

  HemisphereLightHelper({light,size = 5,color = 0xffffff}){

    const helper = new THREE.HemisphereLightHelper( light, size, color );
    this._Scene.add( helper );

  }

  PlaneHelper({plane,color,size}){

    const helper = new THREE.PlaneHelper( plane, size, color );
    this._Scene.add( helper );

  }

  PointLightHelper({pointLight,size}){

    const pointLightHelper = new THREE.PointLightHelper( pointLight, size );
    this._Scene.add( pointLightHelper );

  }

  SkeletonHelper({ object3D }){

    const helper = new THREE.SkeletonHelper( object3D );
    this._Scene.add( helper );

  }

  spotLightHelper({spotLight}){

    const spotLightHelper = new THREE.SpotLightHelper( spotLight );
    this._Scene.add( spotLightHelper );

  }

  // ================ Attribute =================

  // fog

  Fog({color, near, far}){

   this._Scene.fog =  new THREE.Fog(color,near,far);

  }

  // light
  PointLight({ color, intensity, distance, decay, position: { x, y, z }, shadow }) {

    const light = new PointLight(color, intensity, distance, decay);
    light.position.set(x, y, z);
    light.castShadow = shadow;
    light.shadow.radius = 1;
    this._Scene.add(light);

    return light;

  }

  SpotLight({ color, intensity, distance, angle, penumbra, decay, position: { x, y, z }, shadow }) {

    const spotLight = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
    spotLight.position.set(x, y, z);

    spotLight.castShadow = shadow;

    spotLight.shadow.mapSize.width = 2024;
    spotLight.shadow.mapSize.height = 2024;

    spotLight.shadow.camera.near = 500;
    spotLight.shadow.camera.far = 4000;
    spotLight.shadow.camera.fov = 30;

    this._Scene.add(spotLight);

    return spotLight;

  }

  AmbientLight({ color = 0x404040 }) {

    const light = new THREE.AmbientLight(color, 0.5); // soft white light
    this._Scene.add(light);

  }

  DirectionalLight({ color, intensity }) {
    const directionalLight = new THREE.DirectionalLight(color, intensity);
    this._Scene.add(directionalLight);
  }

  HemisphereLight({ skyColor = 0xffffbb, groundColor = 0x080820, intensity = 1 }) {

    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    this._Scene.add(light);

  }

  RectAreaLight({ color = 0xffffff, width = 100, height = 100, intensity = 1, position, lookAt }) {

    const rectLight = new THREE.RectAreaLight(color, intensity, width, height);
    rectLight.position.set(position.x, position.y, position.z);
    rectLight.lookAt(lookAt.x, lookAt.y, lookAt.z);
    this._Scene.add(rectLight);

  }

  // ================ Geometry ==================

  Line({points = [],color = 0xffffff}){

    let point = [];
    const material = new THREE.LineBasicMaterial( { color } );
    const geometry = new THREE.BufferGeometry().setFromPoints( point );
    for(let x of points){

      point.push(new THREE.Vector3(x.x,x.y,x.z));

    }

    this._Scene.add(geometry);

  }

  async Text({text,config,materialName,fontPath}){

    const Scene = this._Scene;
    const Material = this.#_Material;
    const loader = new FontLoader();

    const textGeo = new Promise((res)=>{

      loader.load(fontPath,(data)=>{

        config.font = data;
        const geometry = new TextGeometry(text,config);
        const mesh = new THREE.Mesh(geometry,Material[materialName]);
        Scene.add(mesh);

        res(mesh);

      });

    });

    return await textGeo;

  }

  Box({ width, height, depth, materialName }) {

    const mesh = new Mesh(new BoxBufferGeometry(width, height, depth), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Circle({ radius, segments, materialName }) {

    const mesh = new Mesh(new CircleBufferGeometry(radius, segments), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Cone({ radius, height, radialSegments, materialName }) {

    const mesh = new Mesh(new ConeBufferGeometry(radius, height, radialSegments), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Cylinder({ radiusTop, radiusBottom, height, radialSegments, heightSegments, materialName, openEnded, thetaStart, thetaLength }) {

    const mesh = new Mesh(new CylinderBufferGeometry(radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Dodecahedron({ radius, detail, materialName }) {

    const mesh = new Mesh(new DodecahedronBufferGeometry(radius, detail), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Icosahedron({ radius, detail, materialName }) {

    const mesh = new Mesh(new IcosahedronBufferGeometry(radius, detail), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Octahedron({ radius, detail, materialName }) {

    const mesh = new Mesh(new OctahedronBufferGeometry(radius, detail), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Plane({ width, height, materialName }) {

    const mesh = new Mesh(new PlaneBufferGeometry(width, height), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Ring({ innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength, materialName }) {

    const mesh = new Mesh(new RingBufferGeometry(innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Sphere({ radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength, materialName }) {

    const mesh = new Mesh(new SphereBufferGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Tetahedron({ radius, detail, materialName }) {

    const mesh = new Mesh(new TetrahedronBufferGeometry(radius, detail), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  Torus({ radius, tube, radialSegments, tubularSegments, arc, materialName }) {

    const mesh = new Mesh(new TorusBufferGeometry(radius, tube, radialSegments, tubularSegments, arc), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

  TorusKnot({ radius, tube, tubularSegments, radialSegments, p, q, materialName }) {

    const mesh = new Mesh(new TorusKnotBufferGeometry(radius, tube, tubularSegments, radialSegments, p, q), this.#_Material[materialName]);
    this._Scene.add(mesh);
    return mesh;

  }

}


