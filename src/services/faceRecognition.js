/**
 * Facial Recognition Service
 * Uses the face-api.js CDN global (window.faceapi) loaded in index.html.
 * This avoids ALL Vite/TensorFlow bundling conflicts.
 */

let modelsLoaded = false;
let modelLoadPromise = null;

// ─── Wait for faceapi global to be available ─────────────────
const getFaceApi = () => {
  if (typeof window !== 'undefined' && window.faceapi) return window.faceapi;
  return null;
};

// ─── Model Loaders ──────────────────────────────────────────
export const loadModels = async (modelPath = '/models') => {
  if (modelsLoaded) return true;

  // If already loading, return the same promise (don't double-load)
  if (modelLoadPromise) return modelLoadPromise;

  modelLoadPromise = (async () => {
    const faceapi = getFaceApi();
    if (!faceapi) {
      throw new Error('face-api.js CDN script has not loaded yet. Please refresh the page.');
    }

    console.log('[FaceRecognition] Loading models from:', modelPath);
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
    ]);

    modelsLoaded = true;
    console.log('[FaceRecognition] All models loaded successfully.');
    return true;
  })();

  return modelLoadPromise;
};

// ─── Status Check ────────────────────────────────────────────
export const areModelsLoaded = () => modelsLoaded;

// ─── Face Detection ──────────────────────────────────────────
export const detectFace = async (videoElement) => {
  if (!modelsLoaded) return null;
  const faceapi = getFaceApi();
  if (!faceapi) return null;

  try {
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 320,
      scoreThreshold: 0.3,
    });
    return await faceapi
      .detectSingleFace(videoElement, options)
      .withFaceLandmarks()
      .withFaceDescriptor();
  } catch (err) {
    console.error('[FaceRecognition] detectFace error:', err);
    return null;
  }
};

export const detectAllFaces = async (videoElement) => {
  if (!modelsLoaded) return [];
  const faceapi = getFaceApi();
  if (!faceapi) return [];

  try {
    const options = new faceapi.TinyFaceDetectorOptions({
      inputSize: 320,
      scoreThreshold: 0.3,
    });
    return await faceapi
      .detectAllFaces(videoElement, options)
      .withFaceLandmarks()
      .withFaceDescriptors();
  } catch (err) {
    console.error('[FaceRecognition] detectAllFaces error:', err);
    return [];
  }
};

// ─── Face Matcher ────────────────────────────────────────────
export const createMatcher = (labeledDescriptors, threshold = 0.55) => {
  const faceapi = getFaceApi();
  if (!faceapi) return null;

  const matchers = labeledDescriptors.map(
    (item) =>
      new faceapi.LabeledFaceDescriptors(
        item.label,
        item.descriptors.map((d) => (d instanceof Float32Array ? d : new Float32Array(d)))
      )
  );
  return new faceapi.FaceMatcher(matchers, threshold);
};

export const matchFace = (descriptor, matcher) => {
  if (!matcher) return null;
  try {
    const match = matcher.findBestMatch(descriptor);
    return {
      label: match.label,
      distance: match.distance,
      confidence: parseFloat((1 - match.distance).toFixed(2)),
    };
  } catch (err) {
    console.error('[FaceRecognition] matchFace error:', err);
    return null;
  }
};

export default {
  loadModels,
  areModelsLoaded,
  detectFace,
  detectAllFaces,
  createMatcher,
  matchFace,
};
