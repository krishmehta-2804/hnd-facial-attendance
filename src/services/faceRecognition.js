/**
 * Facial Recognition Service - Integration with face-api.js
 */
import * as faceapi from '@vladmandic/face-api';

let modelsLoaded = false;

// ─── Model Loaders ──────────────────────────────────────────
export const loadModels = async (modelPath = '/models') => {
  if (modelsLoaded) return true;
  try {
    console.log('Loading face-api.js models from:', modelPath);
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelPath),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
    ]);
    modelsLoaded = true;
    console.log('face-api.js models loaded successfully.');
    return true;
  } catch (err) {
    console.error('Failed to load face-api.js models:', err);
    throw err;
  }
};

// Check if models are loaded
export const areModelsLoaded = () => modelsLoaded;

// ─── Detection & Descriptor Extraction ──────────────────────
export const detectFace = async (videoElement) => {
  if (!modelsLoaded) return null;
  try {
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 });
    return await faceapi
      .detectSingleFace(videoElement, options)
      .withFaceLandmarks()
      .withFaceDescriptor();
  } catch (err) {
    console.error('Error detecting single face:', err);
    return null;
  }
};

export const detectAllFaces = async (videoElement) => {
  if (!modelsLoaded) return [];
  try {
    const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 320, scoreThreshold: 0.3 });
    return await faceapi
      .detectAllFaces(videoElement, options)
      .withFaceLandmarks()
      .withFaceDescriptors();
  } catch (err) {
    console.error('Error detecting multiple faces:', err);
    return [];
  }
};

// Create Face Matcher for comparison matching
export const createMatcher = (labeledDescriptors, threshold = 0.6) => {
  // labeledDescriptors: Array of { label: string, descriptors: Float32Array[] }
  const matchers = labeledDescriptors.map(
    (item) =>
      new faceapi.LabeledFaceDescriptors(
        item.label,
        item.descriptors.map((d) => (d instanceof Float32Array ? d : new Float32Array(d)))
      )
  );
  return new faceapi.FaceMatcher(matchers, threshold);
};

// Match Face Descriptor against matcher
export const matchFace = (descriptor, matcher) => {
  if (!matcher) return null;
  try {
    const match = matcher.findBestMatch(descriptor);
    return {
      label: match.label,
      distance: match.distance,
      confidence: (1 - match.distance).toFixed(2),
    };
  } catch (err) {
    console.error('Error matching face descriptor:', err);
    return null;
  }
};

// ─── Simulation Mode Fallbacks ──────────────────────────────
export const simulateDetection = (studentList, callback) => {
  // Simulates scanning and identifying a random student for demo purposes
  let count = 0;
  const interval = setInterval(() => {
    count++;
    if (count > 3) {
      clearInterval(interval);
      // Pick a random unregistered or registered student
      const randomStudent = studentList[Math.floor(Math.random() * studentList.length)];
      callback({
        status: 'matched',
        student: randomStudent,
        confidence: (0.85 + Math.random() * 0.14).toFixed(2),
      });
    } else {
      callback({ status: 'scanning', progress: count * 33 });
    }
  }, 1000);

  return () => clearInterval(interval);
};

export default {
  loadModels,
  areModelsLoaded,
  detectFace,
  detectAllFaces,
  createMatcher,
  matchFace,
  simulateDetection,
};
