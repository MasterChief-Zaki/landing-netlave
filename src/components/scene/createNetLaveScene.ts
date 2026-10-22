import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Fog,
  Group,
  Material,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PMREMGenerator,
  Points,
  PointsMaterial,
  RepeatWrapping,
  Scene,
  Texture,
  TextureLoader,
  TorusKnotGeometry,
  Vector2,
  WebGLRenderer,
} from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

// The three.js visual behind the hero, the idea figure and the contact band:
// a rippling water surface with a sensor grid above it ("field"), a polished
// torus knot for the closed cycle ("knot"), or both together.
export type SceneVariant = "both" | "knot" | "field";

interface SceneOptions {
  variant: SceneVariant;
  speed: number;
}

// Studio HDRI (Poly Haven, CC0) lights everything; the normal map ripples the water.
const environmentMapUrl = "/scene/studio_small_08_1k.hdr";
const waterNormalMapUrl = "/scene/water-normal-1k.png";

function readColorToken(element: HTMLElement, tokenName: string): Color {
  return new Color(
    getComputedStyle(element).getPropertyValue(tokenName).trim(),
  );
}

// Builds the scene inside `container` and returns a function that tears it down.
export function createNetLaveScene(
  container: HTMLElement,
  { variant, speed }: SceneOptions,
): () => void {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
  } catch (error) {
    console.warn("NetLaveScene: WebGL is unavailable", error);
    return () => {};
  }

  const accentColor = readColorToken(container, "--color-accent");
  const backgroundColor = readColorToken(container, "--color-background");
  const surfaceColor = readColorToken(container, "--color-surface");
  const prefersReducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const showsField = variant !== "knot";
  const showsKnot = variant !== "field";
  let isDisposed = false;

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  if (showsField) scene.fog = new Fog(backgroundColor, 6, 22);
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, variant === "field" ? 1.6 : 2.6, 10);
  camera.lookAt(0, variant === "field" ? -0.6 : 0.4, 0);

  const pmremGenerator = new PMREMGenerator(renderer);
  new HDRLoader().load(environmentMapUrl, (environmentTexture) => {
    if (isDisposed) {
      environmentTexture.dispose();
      return;
    }
    environmentTexture.mapping = EquirectangularReflectionMapping;
    scene.environment =
      pmremGenerator.fromEquirectangular(environmentTexture).texture;
    environmentTexture.dispose();
    renderFrame();
  });

  const rimLight = new DirectionalLight(accentColor, 2.2);
  rimLight.position.set(-6, 4, -4);
  const keyLight = new DirectionalLight(0xffffff, 0.6);
  keyLight.position.set(5, 6, 6);
  scene.add(rimLight, keyLight);

  const sceneGroup = new Group();
  scene.add(sceneGroup);

  // Water surface plus a sparse grid of sensor points floating above it.
  let waterNormalMap: Texture | undefined;
  let sensorField: Points | undefined;
  let sensorBasePositions: Float32Array | undefined;
  if (showsField) {
    waterNormalMap = new TextureLoader().load(waterNormalMapUrl, () =>
      renderFrame(),
    );
    waterNormalMap.wrapS = waterNormalMap.wrapT = RepeatWrapping;
    waterNormalMap.repeat.set(5, 2.5);
    const waterSurface = new Mesh(
      new PlaneGeometry(44, 22),
      new MeshPhysicalMaterial({
        color: surfaceColor,
        metalness: 0.1,
        roughness: 0.32,
        normalMap: waterNormalMap,
        normalScale: new Vector2(0.7, 0.7),
        envMapIntensity: 0.3,
        clearcoat: 0.15,
        clearcoatRoughness: 0.4,
        transparent: true,
        opacity: 0.96,
      }),
    );
    waterSurface.rotation.x = -Math.PI / 2;
    waterSurface.position.y = -1.4;
    sceneGroup.add(waterSurface);

    const columnCount = 70;
    const rowCount = 34;
    const fieldWidth = 26;
    const fieldDepth = 13;
    const sensorPositions = new Float32Array(columnCount * rowCount * 3);
    let positionIndex = 0;
    for (let row = 0; row < rowCount; row++) {
      for (let column = 0; column < columnCount; column++) {
        sensorPositions[positionIndex++] =
          (column / (columnCount - 1) - 0.5) * fieldWidth;
        sensorPositions[positionIndex++] = 0;
        sensorPositions[positionIndex++] =
          (row / (rowCount - 1) - 0.5) * fieldDepth;
      }
    }
    sensorBasePositions = sensorPositions.slice();
    const sensorGeometry = new BufferGeometry();
    sensorGeometry.setAttribute(
      "position",
      new BufferAttribute(sensorPositions, 3),
    );
    sensorField = new Points(
      sensorGeometry,
      new PointsMaterial({
        color: accentColor,
        size: 0.04,
        transparent: true,
        opacity: 0.6,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    sensorField.position.y = -1.1;
    sceneGroup.add(sensorField);
  }

  // The closed cycle: a polished torus knot circled by a ring of droplets.
  let cycleKnot: Group | undefined;
  let knotDroplets: Points | undefined;
  if (showsKnot) {
    cycleKnot = new Group();
    cycleKnot.add(
      new Mesh(
        new TorusKnotGeometry(1.5, 0.42, 260, 36, 2, 3),
        new MeshPhysicalMaterial({
          color: surfaceColor,
          metalness: 0.9,
          roughness: 0.28,
          clearcoat: 1,
          clearcoatRoughness: 0.08,
          envMapIntensity: 1.3,
        }),
      ),
    );
    const dropletCount = 400;
    const dropletPositions = new Float32Array(dropletCount * 3);
    for (let dropletIndex = 0; dropletIndex < dropletCount; dropletIndex++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.6 + Math.random() * 1.2;
      const height = (Math.random() - 0.5) * 1.6;
      dropletPositions[dropletIndex * 3] = Math.cos(angle) * radius;
      dropletPositions[dropletIndex * 3 + 1] = height;
      dropletPositions[dropletIndex * 3 + 2] = Math.sin(angle) * radius;
    }
    const dropletGeometry = new BufferGeometry();
    dropletGeometry.setAttribute(
      "position",
      new BufferAttribute(dropletPositions, 3),
    );
    knotDroplets = new Points(
      dropletGeometry,
      new PointsMaterial({
        color: accentColor,
        size: 0.05,
        transparent: true,
        opacity: 0.9,
        blending: AdditiveBlending,
        depthWrite: false,
      }),
    );
    cycleKnot.add(knotDroplets);
    cycleKnot.position.set(
      variant === "both" ? 3.2 : 0,
      variant === "both" ? 0.6 : 0.2,
      0,
    );
    sceneGroup.add(cycleKnot);
  }

  // Parallax follows the pointer over the whole window, so text laid on top
  // of the scene doesn't block it.
  const pointerTarget = { x: 0, y: 0 };
  const handlePointerMove = (event: PointerEvent) => {
    const bounds = container.getBoundingClientRect();
    pointerTarget.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    pointerTarget.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
  };
  window.addEventListener("pointermove", handlePointerMove);

  const startTime = performance.now();
  function renderFrame() {
    if (isDisposed) return;
    const elapsedSeconds = prefersReducedMotion
      ? 0
      : ((performance.now() - startTime) / 1000) * speed;
    if (waterNormalMap) {
      waterNormalMap.offset.set(elapsedSeconds * 0.012, elapsedSeconds * 0.006);
    }
    if (sensorField && sensorBasePositions) {
      const positions = sensorField.geometry.attributes.position
        .array as Float32Array;
      for (let index = 0; index < positions.length; index += 3) {
        const baseX = sensorBasePositions[index];
        const baseZ = sensorBasePositions[index + 2];
        positions[index + 1] =
          Math.sin(baseX * 0.55 + elapsedSeconds * 0.9) * 0.14 +
          Math.cos(baseZ * 0.9 - elapsedSeconds * 0.6) * 0.1;
      }
      sensorField.geometry.attributes.position.needsUpdate = true;
    }
    if (cycleKnot && knotDroplets) {
      cycleKnot.rotation.y = elapsedSeconds * 0.22;
      cycleKnot.rotation.x = Math.sin(elapsedSeconds * 0.15) * 0.25;
      knotDroplets.rotation.y = -elapsedSeconds * 0.12;
    }
    if (!prefersReducedMotion) {
      sceneGroup.rotation.y +=
        (pointerTarget.x * 0.08 - sceneGroup.rotation.y) * 0.04;
      sceneGroup.rotation.x +=
        (pointerTarget.y * 0.05 - sceneGroup.rotation.x) * 0.04;
    }
    renderer.render(scene, camera);
  }

  // Animate only while the scene is on screen, and never with reduced motion.
  let frameRequest = 0;
  const animate = () => {
    renderFrame();
    frameRequest = requestAnimationFrame(animate);
  };
  const startAnimation = () => {
    if (!prefersReducedMotion && !frameRequest) {
      frameRequest = requestAnimationFrame(animate);
    }
  };
  const stopAnimation = () => {
    cancelAnimationFrame(frameRequest);
    frameRequest = 0;
  };
  const visibilityObserver = new IntersectionObserver((entries) => {
    if (entries.some((entry) => entry.isIntersecting)) startAnimation();
    else stopAnimation();
  });
  visibilityObserver.observe(container);

  const resize = () => {
    const width = container.clientWidth || 1;
    const height = container.clientHeight || 1;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderFrame();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  return () => {
    isDisposed = true;
    stopAnimation();
    visibilityObserver.disconnect();
    resizeObserver.disconnect();
    window.removeEventListener("pointermove", handlePointerMove);
    scene.traverse((sceneObject) => {
      if (sceneObject instanceof Mesh || sceneObject instanceof Points) {
        sceneObject.geometry.dispose();
        (sceneObject.material as Material).dispose();
      }
    });
    waterNormalMap?.dispose();
    scene.environment?.dispose();
    pmremGenerator.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  };
}
