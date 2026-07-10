import { useRef, useEffect, useCallback, useState } from 'react';
import { PoseLandmarker, FilesetResolver, type PoseLandmarkerResult } from '@mediapipe/tasks-vision';

export interface PoseData {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  rotation: number;
  isDetected: boolean;
}

export function usePoseDetection(isActive: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null);
  const animFrameRef = useRef<number>(0);
  const streamRef = useRef<MediaStream | null>(null);
  const [poseData, setPoseData] = useState<PoseData>({
    centerX: 0,
    centerY: 0,
    width: 0,
    height: 0,
    rotation: 0,
    isDetected: false,
  });
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Smoothed pose data for jitter reduction
  const smoothedRef = useRef<PoseData>({
    centerX: 0,
    centerY: 0,
    width: 0,
    height: 0,
    rotation: 0,
    isDetected: false,
  });

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const startSimulationLoop = useCallback(() => {
    let angle = 0;
    const simulate = () => {
      angle += 0.035;
      const wave = Math.sin(angle);
      const cosWave = Math.cos(angle * 0.5);

      setPoseData({
        centerX: 320 + wave * 45,
        centerY: 240 + cosWave * 20,
        width: 170 + Math.sin(angle * 1.3) * 12,
        height: 230 + Math.cos(angle * 1.3) * 12,
        rotation: Math.sin(angle * 0.4) * 0.08,
        isDetected: true,
      });

      animFrameRef.current = requestAnimationFrame(simulate);
    };
    simulate();
  }, []);

  const processResults = useCallback((result: PoseLandmarkerResult) => {
    if (!result.landmarks || result.landmarks.length === 0) {
      setPoseData((prev) => ({ ...prev, isDetected: false }));
      return;
    }

    const landmarks = result.landmarks[0];
    const video = videoRef.current;
    if (!video) return;

    const w = video.videoWidth;
    const h = video.videoHeight;

    // MediaPipe landmark indices
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) return;

    // Calculate raw pose metrics
    const shoulderMidX = ((leftShoulder.x + rightShoulder.x) / 2) * w;
    const shoulderMidY = ((leftShoulder.y + rightShoulder.y) / 2) * h;
    const hipMidY = ((leftHip.y + rightHip.y) / 2) * h;

    const shoulderDist = Math.sqrt(
      Math.pow((rightShoulder.x - leftShoulder.x) * w, 2) +
        Math.pow((rightShoulder.y - leftShoulder.y) * h, 2),
    );

    const torsoHeight = hipMidY - shoulderMidY;
    const rotation = Math.atan2(
      (rightShoulder.y - leftShoulder.y) * h,
      (rightShoulder.x - leftShoulder.x) * w,
    );

    const raw: PoseData = {
      centerX: shoulderMidX,
      centerY: shoulderMidY,
      width: shoulderDist * 2.4,
      height: torsoHeight * 1.4,
      rotation,
      isDetected: true,
    };

    // Apply smoothing (lerp)
    const lerpFactor = 0.35;
    const smoothed = smoothedRef.current;

    if (!smoothed.isDetected) {
      // First detection — snap to position
      smoothedRef.current = { ...raw };
    } else {
      smoothedRef.current = {
        centerX: lerp(smoothed.centerX, raw.centerX, lerpFactor),
        centerY: lerp(smoothed.centerY, raw.centerY, lerpFactor),
        width: lerp(smoothed.width, raw.width, lerpFactor),
        height: lerp(smoothed.height, raw.height, lerpFactor),
        rotation: lerp(smoothed.rotation, raw.rotation, lerpFactor),
        isDetected: true,
      };
    }

    setPoseData({ ...smoothedRef.current });
  }, []);

  const startDetection = useCallback(async () => {
    const video = videoRef.current;
    const landmarker = poseLandmarkerRef.current;
    if (!video || !landmarker) return;

    let lastTime = -1;
    const detect = () => {
      if (video.readyState >= 2 && video.currentTime !== lastTime) {
        lastTime = video.currentTime;
        const result = landmarker.detectForVideo(video, performance.now());
        processResults(result);
      }
      animFrameRef.current = requestAnimationFrame(detect);
    };

    detect();
  }, [processResults]);

  // Initialize everything when activated
  useEffect(() => {
    if (!isActive) return;

    let cancelled = false;

    const init = async () => {
      try {
        setIsModelLoading(true);
        setError(null);
        setIsSimulating(false);

        // Request webcam
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: 640, height: 480 },
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        streamRef.current = stream;
        const video = videoRef.current;
        if (video) {
          video.srcObject = stream;
          await video.play();
        }

        // Initialize MediaPipe
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm',
        );

        if (cancelled) return;

        const landmarker = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        });

        if (cancelled) {
          landmarker.close();
          return;
        }

        poseLandmarkerRef.current = landmarker;
        setIsModelLoading(false);
        startDetection();
      } catch (err) {
        if (!cancelled) {
          console.warn('Webcam failed, starting simulated tracking mode:', err);
          setIsSimulating(true);
          setIsModelLoading(false);
          setError(null);
          startSimulationLoop();
        }
      }
    };

    init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(animFrameRef.current);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }

      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
        poseLandmarkerRef.current = null;
      }

      // Reset smoothing
      smoothedRef.current = {
        centerX: 0,
        centerY: 0,
        width: 0,
        height: 0,
        rotation: 0,
        isDetected: false,
      };
    };
  }, [isActive, startDetection, startSimulationLoop]);

  return { videoRef, poseData, isModelLoading, error, isSimulating };
}
