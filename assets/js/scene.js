import * as THREE from '../vendor/three.module.js';

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const mouse = { x: 0, y: 0 };
window.addEventListener('pointermove', (event) => {
  mouse.x = (event.clientX / window.innerWidth - .5) * 2;
  mouse.y = (event.clientY / window.innerHeight - .5) * 2;
}, { passive: true });

const materials = {
  lime: new THREE.MeshPhysicalMaterial({ color: 0xc8f06a, metalness: .68, roughness: .23, clearcoat: .9, clearcoatRoughness: .12 }),
  limeDark: new THREE.MeshStandardMaterial({ color: 0x547944, metalness: .55, roughness: .37 }),
  blue: new THREE.MeshPhysicalMaterial({ color: 0x83dce1, metalness: .68, roughness: .22, clearcoat: 1 }),
  orange: new THREE.MeshPhysicalMaterial({ color: 0xff956e, metalness: .63, roughness: .26, clearcoat: 1 }),
  dark: new THREE.MeshStandardMaterial({ color: 0x183124, metalness: .8, roughness: .3 }),
  darkBlue: new THREE.MeshStandardMaterial({ color: 0x24454d, metalness: .8, roughness: .3 }),
  darkOrange: new THREE.MeshStandardMaterial({ color: 0x533b2b, metalness: .8, roughness: .3 })
};

function mesh(geometry, material, parent, x=0, y=0, z=0) {
  const object = new THREE.Mesh(geometry, material);
  object.position.set(x,y,z);
  parent.add(object);
  return object;
}
function lineRing(radius, color, parent, rotation=[0,0,0], opacity=.45) {
  const curve = new THREE.EllipseCurve(0,0,radius,radius,0,Math.PI*2,false,0);
  const points = curve.getPoints(160).map(p => new THREE.Vector3(p.x,p.y,0));
  const line = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({color,transparent:true,opacity}));
  line.rotation.set(...rotation);
  parent.add(line);
  return line;
}
function addLights(scene, color) {
  scene.add(new THREE.AmbientLight(0xb8cdb6, 1.5));
  const key = new THREE.PointLight(0xffffff, 85); key.position.set(-3,5,6); scene.add(key);
  const rim = new THREE.PointLight(color, 110); rim.position.set(4,-2,-1); scene.add(rim);
  const fill = new THREE.PointLight(0x6cb5e3, 55); fill.position.set(-5,-3,2); scene.add(fill);
}
function heroObject(root) {
  const knot = mesh(new THREE.TorusKnotGeometry(1.48,.43,240,32,2,3), materials.lime, root);
  knot.rotation.set(.4,.2,-.3);
  const inner = mesh(new THREE.IcosahedronGeometry(.62,4), materials.dark, root);
  inner.scale.set(1,.8,1);
  const wire = mesh(new THREE.IcosahedronGeometry(.72,2), new THREE.MeshBasicMaterial({color:0xe5ffc3,wireframe:true,transparent:true,opacity:.3}),root);
  lineRing(2.63,0xb2ef86,root,[1.12,.26,.28],.4);
  lineRing(2.28,0x95b0a4,root,[.28,.76,-.34],.25);
  const orbit = new THREE.Group(); root.add(orbit);
  for(let i=0;i<9;i++) {
    const angle = i / 9 * Math.PI*2;
    const radius = 2.48 + (i%3)*.12;
    const dot = mesh(new THREE.OctahedronGeometry(i%3===0?.085:.04,0),i%3===0?materials.lime:materials.limeDark,orbit,Math.cos(angle)*radius,Math.sin(angle)*radius*.55,Math.sin(angle)*.8);
    dot.rotation.z=angle;
  }
  return { spin: root, accents:[orbit,inner,wire], speed:.0015 };
}
function cerberusObject(root) {
  const core = mesh(new THREE.IcosahedronGeometry(1.08,2),materials.lime,root);
  core.rotation.set(.25,.15,.3);
  const frame = mesh(new THREE.IcosahedronGeometry(1.54,1),new THREE.MeshBasicMaterial({color:0xb9e990,wireframe:true,transparent:true,opacity:.55}),root);
  frame.rotation.set(.3,.45,0);
  for(let i=0;i<3;i++) lineRing(1.83+i*.27,i===1?0xd1f894:0x76ac75,root,[.6+i*.65,.3+i*.4,i*.3],.28);
  for(let i=0;i<14;i++) { const a=i*2.399;const r=1.8+(i%4)*.18; mesh(new THREE.OctahedronGeometry(i%4===0?.075:.035),materials.lime,root,Math.cos(a)*r,Math.sin(a*1.3)*1.1,Math.sin(a)*.7); }
  return {spin:root,accents:[frame,core],speed:.0019};
}
function acerObject(root) {
  const group = new THREE.Group();root.add(group);
  mesh(new THREE.TorusGeometry(1.35,.23,20,100),materials.blue,group).rotation.x=.3;
  mesh(new THREE.TorusGeometry(.83,.16,20,100),materials.darkBlue,group).rotation.x=-.3;
  const central = mesh(new THREE.OctahedronGeometry(.69,1),materials.blue,group);central.rotation.y=.5;
  for(let i=0;i<6;i++){
    const a=i*Math.PI/3;
    const node=mesh(new THREE.BoxGeometry(.26,.26,.26),i%2?materials.darkBlue:materials.blue,root,Math.cos(a)*2,Math.sin(a)*1.7,Math.sin(a)*.5);
    node.rotation.set(a,.5,a);
  }
  lineRing(2.32,0x79d9df,root,[1.2,.1,.3],.4);
  lineRing(2.05,0x79d9df,root,[.25,.6,0],.25);
  return {spin:root,accents:[group,central],speed:.0014};
}
function atlasObject(root) {
  const cube = mesh(new THREE.BoxGeometry(1.7,1.7,1.7),materials.orange,root);
  cube.rotation.set(.32,.5,.25);
  const frame = mesh(new THREE.BoxGeometry(2.18,2.18,2.18),new THREE.MeshBasicMaterial({color:0xffb38b,wireframe:true,transparent:true,opacity:.45}),root);
  frame.rotation.copy(cube.rotation);
  for(let i=0;i<3;i++){
    const block=mesh(new THREE.BoxGeometry(.42,.42,.42),i===1?materials.orange:materials.darkOrange,root,-1.65+i*1.64,1.55-i*.36,.5-i*.4);
    block.rotation.set(.25,.4,.25);
  }
  lineRing(2.42,0xf4a47d,root,[1.25,.24,.7],.3);
  return {spin:root,accents:[cube,frame],speed:.0013};
}
const builders = {hero:heroObject,cerberus:cerberusObject,acer:acerObject,atlas:atlasObject};
const accentColors={hero:0xc8f06a,cerberus:0xc8f06a,acer:0x82d9df,atlas:0xff8a63};
const scenes=[];
for(const element of (reducedMotion ? [] : document.querySelectorAll('[data-scene]'))) {
  try {
    const name=element.dataset.scene;
    const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.75));
    renderer.setClearColor(0x000000,0);
    renderer.outputColorSpace=THREE.SRGBColorSpace;
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.8;
    element.appendChild(renderer.domElement);
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(40,1,.1,100);
    camera.position.z=name==='hero'?9:8.2;
    addLights(scene,accentColors[name]);
    const root=new THREE.Group();scene.add(root);
    const model=builders[name](root);
    const resize=()=>{const w=element.clientWidth,h=element.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();const scale=name==='hero'?Math.min(1,Math.max(.69,w/640)):Math.min(.87,Math.max(.52,w/470));root.scale.setScalar(scale);};
    new ResizeObserver(resize).observe(element);resize();
    scenes.push({element,renderer,scene,camera,model,visible:true,name});
  } catch(error) { console.warn('3D scene unavailable:',error); }
}
const observer=new IntersectionObserver(entries=>{for(const entry of entries){const item=scenes.find(s=>s.element===entry.target);if(item)item.visible=entry.isIntersecting;}},{rootMargin:'100px'});
scenes.forEach(s=>observer.observe(s.element));
let last=0;
function animate(now){
  requestAnimationFrame(animate);
  const delta=Math.min(now-last,50);last=now;
  for(const item of scenes){
    if(!item.visible)continue;
    const {model,renderer,scene,camera,name}=item;
    if(!reducedMotion){model.spin.rotation.y+=model.speed*delta;model.spin.rotation.x+=(mouse.y*.09-model.spin.rotation.x)*.02;model.spin.rotation.z+=(mouse.x*.07-model.spin.rotation.z)*.02;if(name==='hero')model.accents[0].rotation.z-=.00045*delta;}
    renderer.render(scene,camera);
    if (!renderer.getContext().isContextLost()) item.element.classList.add('webgl-ready');
  }
}
if(scenes.length)requestAnimationFrame(animate);
