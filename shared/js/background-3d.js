/* =========================================================
   background-3d.js — Three.js: objetos flutuantes reativos
   Three.js carregado via CDN (ESM)
   ========================================================= */
(function () {
  let renderer, scene, camera, raf, container, objs = [];
  const mouse = { x: 0, y: 0 };

  async function attach() {
    if (LV.isMobile()) return;
    if (!window.THREE) {
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r152/three.min.js";
        s.onload = res; s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    const THREE = window.THREE;
    container = document.createElement("div");
    container.id = "bg-canvas-3d";
    document.body.appendChild(container);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 14;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const colors = [0x54D930, 0x04B2D9, 0x05AFF2, 0xF2A03D, 0xF25430];
    const geos = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.TorusGeometry(0.9, 0.25, 8, 24),
      new THREE.BoxGeometry(1.2, 1.2, 1.2),
      new THREE.ConeGeometry(0.9, 1.6, 5)
    ];
    objs = [];
    for (let i = 0; i < 14; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        wireframe: false,
        transparent: true,
        opacity: 0.8
      });
      const m = new THREE.Mesh(geos[i % geos.length], mat);
      m.position.set((Math.random() - 0.5) * 22, (Math.random() - 0.5) * 14, (Math.random() - 0.5) * 10);
      m.userData = {
        rs: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 }
      };
      scene.add(m);
      objs.push(m);
    }

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouse);
    animate();
  }
  function onResize() {
    if (!renderer) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  function onMouse(e) {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }
  function animate() {
    raf = requestAnimationFrame(animate);
    for (const o of objs) {
      o.rotation.x += o.userData.rs.x;
      o.rotation.y += o.userData.rs.y;
      o.position.x += (mouse.x * 0.05 - o.position.x * 0.001);
      o.position.y += (mouse.y * 0.05 - o.position.y * 0.001);
    }
    camera.position.x += (mouse.x * 1.5 - camera.position.x) * 0.04;
    camera.position.y += (mouse.y * 1.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  function detach() {
    if (raf) cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
    window.removeEventListener("mousemove", onMouse);
    if (renderer) { renderer.dispose(); }
    if (container) container.remove();
    renderer = null; scene = null; objs = [];
  }
  window.LVBg3D = { attach, detach };
})();
