import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  CubicBezierCurve,
  CylinderGeometry,
  DirectionalLight,
  EquirectangularReflectionMapping,
  Fog,
  Group,
  LatheGeometry,
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
  SphereGeometry,
  Texture,
  TextureLoader,
  Vector2,
  WebGLRenderer,
  type WebGLRenderTarget,
} from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

// Decorative scenes: reclaimed water above a sensor field in the hero,
// a glass forest grove beside the idea, and a water field behind the contact.
export type SceneVariant = "both" | "forest" | "field";

interface SceneOptions {
  variant: SceneVariant;
  speed: number;
}

// Studio HDRI (Poly Haven, CC0) lights everything; the normal map ripples the water.
const environmentMapUrl = "/scene/studio_small_08_1k.hdr";
const waterNormalMapUrl = "/scene/water-normal-1k.png";

function clampToUnitRange(value: number): number {
  return Math.max(-1, Math.min(1, value));
}

function readColorToken(element: HTMLElement, tokenName: string): Color {
  return new Color(
    getComputedStyle(element).getPropertyValue(tokenName).trim(),
  );
}

// Revolve a rounded base and tapered tip into a smooth, closed water droplet.
function createWaterDropletGeometry(): LatheGeometry {
  const roundedBase = new CubicBezierCurve(
    new Vector2(0, -1.8),
    new Vector2(0.9, -1.8),
    new Vector2(1.5, -1.25),
    new Vector2(1.5, -0.4),
  );
  const taperedTip = new CubicBezierCurve(
    new Vector2(1.5, -0.4),
    new Vector2(1.5, 0.6),
    new Vector2(0.35, 1.55),
    new Vector2(0, 2.2),
  );
  return new LatheGeometry(
    [...roundedBase.getPoints(48), ...taperedTip.getPoints(64).slice(1)],
    96,
  );
}

// A stylized broadleaf grove, not a planting plan or a species-specific model.
function createForestGrove(
  surfaceColor: Color,
  foliageColor: Color,
  accentColor: Color,
): Group {
  const forestGrove = new Group();
  const canopyGeometry = new SphereGeometry(0.62, 32, 24);
  const trunkGeometry = new CylinderGeometry(0.07, 0.12, 1.3, 16);
  const branchGeometry = new CylinderGeometry(0.035, 0.055, 0.65, 12);
  const canopyMaterial = new MeshPhysicalMaterial({
    color: foliageColor,
    metalness: 0.35,
    roughness: 0.16,
    transmission: 0.15,
    thickness: 0.8,
    ior: 1.45,
    clearcoat: 1,
    clearcoatRoughness: 0.06,
    envMapIntensity: 1.2,
  });
  const trunkMaterial = new MeshPhysicalMaterial({
    color: surfaceColor,
    metalness: 0.5,
    roughness: 0.25,
    clearcoat: 1,
    envMapIntensity: 0.8,
  });
  const groveBase = new Mesh(
    new CylinderGeometry(2.65, 2.65, 0.16, 96),
    new MeshPhysicalMaterial({
      color: surfaceColor,
      metalness: 0.35,
      roughness: 0.18,
      clearcoat: 1,
      envMapIntensity: 0.8,
    }),
  );
  groveBase.position.y = -1.45;
  forestGrove.add(groveBase);

  const treePlacements = [
    { x: -1.35, z: -1.2, scale: 1.05 },
    { x: 0, z: -1.4, scale: 1.35 },
    { x: 1.3, z: -1.1, scale: 1.1 },
    { x: -1.45, z: 0.15, scale: 0.9 },
    { x: 0, z: 0, scale: 1.2 },
    { x: 1.45, z: 0.3, scale: 0.95 },
    { x: -0.8, z: 1.4, scale: 0.8 },
    { x: 0.75, z: 1.35, scale: 0.9 },
  ];
  const canopyClusters = [
    { x: 0, y: 1.65, z: 0, scale: 1 },
    { x: -0.35, y: 1.25, z: 0.1, scale: 0.8 },
    { x: 0.35, y: 1.3, z: 0.15, scale: 0.85 },
    { x: 0, y: 1.25, z: -0.35, scale: 0.8 },
  ];
  for (const [treeIndex, placement] of treePlacements.entries()) {
    const tree = new Group();
    const trunk = new Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 0.65;
    tree.add(trunk);
    for (const direction of [-1, 1]) {
      const branch = new Mesh(branchGeometry, trunkMaterial);
      branch.position.set(direction * 0.18, 1.05, 0);
      branch.rotation.z = -direction * 0.6;
      tree.add(branch);
    }
    for (const cluster of canopyClusters) {
      const canopy = new Mesh(canopyGeometry, canopyMaterial);
      canopy.position.set(cluster.x, cluster.y, cluster.z);
      canopy.scale.set(cluster.scale, cluster.scale * 1.2, cluster.scale);
      tree.add(canopy);
    }
    tree.position.set(placement.x, -1.37, placement.z);
    tree.scale.setScalar(placement.scale);
    tree.rotation.y = treeIndex * 0.8;
    forestGrove.add(tree);
  }

  // Fine points around the grove retain the visual link to the sensor field.
  const sensorPositions = new Float32Array(160 * 3);
  for (let index = 0; index < 160; index++) {
    const angle = (index / 160) * Math.PI * 2;
    sensorPositions[index * 3] = Math.cos(angle) * 2.5;
    sensorPositions[index * 3 + 1] = -1.34;
    sensorPositions[index * 3 + 2] = Math.sin(angle) * 2.5;
  }
  const sensorGeometry = new BufferGeometry();
  sensorGeometry.setAttribute(
    "position",
    new BufferAttribute(sensorPositions, 3),
  );
  forestGrove.add(
    new Points(
      sensorGeometry,
      new PointsMaterial({
        color: accentColor,
        size: 0.035,
        transparent: true,
        opacity: 0.6,
      }),
    ),
  );
  return forestGrove;
}

// Builds the scene inside `container` and returns a function that tears it down.
export function createNetLaveScene(
  container: HTMLElement,
  { variant, speed }: SceneOptions,
): () => void {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2", {
    antialias: true,
    alpha: true,
    powerPreference: "high-performance",
  });
  // No renderer is constructed when WebGL2 is unavailable. The decorative
  // background remains empty and the server-rendered content stays usable.
  if (!context) return () => {};
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, context });
  } catch (error) {
    console.warn("NetLaveScene: WebGL is unavailable", error);
    return () => {};
  }

  const accentColor = readColorToken(container, "--color-accent");
  const backgroundColor = readColorToken(container, "--color-background");
  const surfaceColor = readColorToken(container, "--color-surface");
  const foliageColor = readColorToken(container, "--color-deep-teal");
  const prefersReducedMotion = matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const showsField = variant !== "forest";
  const showsDroplet = variant === "both";
  let isDisposed = false;

  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.domElement.style.display = "block";
  container.appendChild(renderer.domElement);

  const scene = new Scene();
  if (showsField) scene.fog = new Fog(backgroundColor, 6, 22);
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  if (variant === "forest") {
    camera.position.set(5.5, 4, 7.5);
    camera.lookAt(0, 0.1, 0);
  } else {
    camera.position.set(0, variant === "field" ? 1.6 : 2.6, 10);
    camera.lookAt(0, variant === "field" ? -0.6 : 0.4, 0);
  }

  const pmremGenerator = new PMREMGenerator(renderer);
  let environmentTarget: WebGLRenderTarget | undefined;
  new HDRLoader().load(environmentMapUrl, (environmentTexture) => {
    if (isDisposed) {
      environmentTexture.dispose();
      return;
    }
    environmentTexture.mapping = EquirectangularReflectionMapping;
    environmentTarget = pmremGenerator.fromEquirectangular(environmentTexture);
    scene.environment = environmentTarget.texture;
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

  // Reclaimed water: a midnight-blue glass droplet with crisp studio reflections.
  let waterDroplet: Group | undefined;
  let dropletParticles: Points | undefined;
  const dropletBaseHeight = 1.1;
  if (showsDroplet) {
    waterDroplet = new Group();
    waterDroplet.add(
      new Mesh(
        createWaterDropletGeometry(),
        new MeshPhysicalMaterial({
          color: surfaceColor,
          metalness: 0.65,
          roughness: 0.12,
          transmission: 0.12,
          thickness: 2.4,
          ior: 1.333,
          clearcoat: 1,
          clearcoatRoughness: 0.04,
          envMapIntensity: 1.5,
        }),
      ),
    );
    const dropletCount = 400;
    const dropletPositions = new Float32Array(dropletCount * 3);
    for (let dropletIndex = 0; dropletIndex < dropletCount; dropletIndex++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2.1 + Math.random() * 0.7;
      const height = -0.9 + (Math.random() - 0.5) * 0.8;
      dropletPositions[dropletIndex * 3] = Math.cos(angle) * radius;
      dropletPositions[dropletIndex * 3 + 1] = height;
      dropletPositions[dropletIndex * 3 + 2] = Math.sin(angle) * radius;
    }
    const dropletGeometry = new BufferGeometry();
    dropletGeometry.setAttribute(
      "position",
      new BufferAttribute(dropletPositions, 3),
    );
    dropletParticles = new Points(
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
    waterDroplet.add(dropletParticles);
    waterDroplet.position.set(3.2, dropletBaseHeight, 0);
    sceneGroup.add(waterDroplet);
  }

  const forestGrove =
    variant === "forest"
      ? createForestGrove(surfaceColor, foliageColor, accentColor)
      : undefined;
  if (forestGrove) sceneGroup.add(forestGrove);

  // Parallax follows the pointer over the whole window, so text laid on top
  // of the scene doesn't block it. Positions outside the scene are clamped to
  // its edges so the tilt never exceeds the designed range.
  const pointerTarget = { x: 0, y: 0 };
  const handlePointerMove = (event: PointerEvent) => {
    const bounds = container.getBoundingClientRect();
    pointerTarget.x = clampToUnitRange(
      ((event.clientX - bounds.left) / bounds.width - 0.5) * 2,
    );
    pointerTarget.y = clampToUnitRange(
      ((event.clientY - bounds.top) / bounds.height - 0.5) * 2,
    );
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
    if (waterDroplet && dropletParticles) {
      waterDroplet.position.y =
        dropletBaseHeight + Math.sin(elapsedSeconds * 0.65) * 0.12;
      waterDroplet.rotation.x = 0.1 + Math.sin(elapsedSeconds * 0.3) * 0.08;
      waterDroplet.rotation.z = -0.13 + Math.sin(elapsedSeconds * 0.4) * 0.06;
      dropletParticles.rotation.y = -elapsedSeconds * 0.12;
    }
    if (forestGrove) {
      forestGrove.rotation.y = Math.sin(elapsedSeconds * 0.15) * 0.12;
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
    // Trees share geometry and materials; dispose each resource only once.
    const geometries = new Set<BufferGeometry>();
    const materials = new Set<Material>();
    scene.traverse((sceneObject) => {
      if (sceneObject instanceof Mesh || sceneObject instanceof Points) {
        geometries.add(sceneObject.geometry);
        materials.add(sceneObject.material as Material);
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    waterNormalMap?.dispose();
    environmentTarget?.dispose();
    pmremGenerator.dispose();
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement.remove();
  };
}
