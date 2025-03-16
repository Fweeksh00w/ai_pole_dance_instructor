'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Webcam from 'react-webcam';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { moves, type Move } from '../moves/page';
import Avatar from '../components/Avatar';
import VoiceGuidance from '../components/VoiceGuidance';

type Feedback = {
  message: string;
  type: 'success' | 'warning' | 'error' | 'info';
};

type Point = {
  x: number;
  y: number;
  score?: number;
  name?: string;
};

type ProgressData = {
  timestamp: number;
  moveId: string;
  score: number;
  feedback: string[];
};

export default function PracticePage() {
  const searchParams = useSearchParams();
  const moveId = searchParams.get('move');
  const currentMove = moves.find((m: Move) => m.id === moveId);

  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detector, setDetector] = useState<poseDetection.PoseDetector | null>(null);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [score, setScore] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [showingDemo, setShowingDemo] = useState(false);
  const [isDemoPlaying, setIsDemoPlaying] = useState(false);
  const [splitScreen, setSplitScreen] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [currentProgress, setCurrentProgress] = useState<ProgressData[]>([]);
  const [bestScore, setBestScore] = useState<number>(0);
  const [currentVoiceGuide, setCurrentVoiceGuide] = useState<string>('');

  useEffect(() => {
    const initializePoseDetector = async () => {
      const model = poseDetection.SupportedModels.BlazePose;
      const detectorConfig = {
        runtime: 'tfjs',
        modelType: 'full',
        enableSegmentation: true,
        smoothSegmentation: true
      };
      
      const detector = await poseDetection.createDetector(model, detectorConfig);
      setDetector(detector);
      setIsLoading(false);
    };

    initializePoseDetector();
  }, []);

  const analyzePose = (pose: poseDetection.Pose) => {
    if (!currentMove) return [];

    const newFeedback: Feedback[] = [];
    const keypoints = pose.keypoints;
    
    // Get specific keypoints
    const leftHip = keypoints.find(kp => kp.name === 'left_hip') as Point;
    const rightHip = keypoints.find(kp => kp.name === 'right_hip') as Point;
    const leftKnee = keypoints.find(kp => kp.name === 'left_knee') as Point;
    const rightKnee = keypoints.find(kp => kp.name === 'right_knee') as Point;
    const leftAnkle = keypoints.find(kp => kp.name === 'left_ankle') as Point;
    const rightAnkle = keypoints.find(kp => kp.name === 'right_ankle') as Point;
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder') as Point;
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder') as Point;

    // Move-specific analysis
    switch (currentMove.id) {
      case 'jade-split':
        if (leftHip && rightHip && leftKnee && rightKnee) {
          // Check split angle
          const splitAngle = calculateAngle(leftHip, rightHip, leftKnee);
          if (splitAngle < 160) {
            newFeedback.push({
              message: 'Try to extend your split further',
              type: 'warning'
            });
          } else {
            newFeedback.push({
              message: 'Great split position!',
              type: 'success'
            });
          }
        }
        break;

      case 'allegra':
        if (leftShoulder && rightShoulder && leftHip && rightHip) {
          // Check body alignment
          const alignment = calculateAlignment(leftShoulder, rightShoulder, leftHip, rightHip);
          if (alignment > 20) {
            newFeedback.push({
              message: 'Keep your hips square to the pole',
              type: 'warning'
            });
          }
        }
        break;

      case 'spatchcock':
        if (leftAnkle && rightAnkle && leftHip && rightHip) {
          // Check leg position relative to head
          const legPosition = checkLegsBehindHead(leftAnkle, rightAnkle, leftHip);
          if (!legPosition) {
            newFeedback.push({
              message: 'Work on getting your legs behind your head',
              type: 'warning'
            });
          }
        }
        break;

      case 'twerk':
        if (leftHip && rightHip) {
          // Check hip movement
          const hipMovement = calculateHipMovement(leftHip, rightHip);
          if (hipMovement < 0.3) {
            newFeedback.push({
              message: 'Increase hip movement range',
              type: 'warning'
            });
          }
        }
        break;
    }

    // Calculate and update score
    const newScore = calculateScore(pose);
    setScore(newScore);

    // Update best score
    if (newScore > bestScore) {
      setBestScore(newScore);
    }

    // Save progress data
    const progressEntry: ProgressData = {
      timestamp: Date.now(),
      moveId: currentMove.id,
      score: newScore,
      feedback: newFeedback.map(f => f.message)
    };
    setCurrentProgress(prev => [...prev, progressEntry]);

    // Generate voice guidance
    if (voiceEnabled && newFeedback.length > 0) {
      setCurrentVoiceGuide(generateVoiceGuidance(newFeedback));
    }

    return newFeedback;
  };

  const calculateAngle = (point1: Point, point2: Point, point3: Point) => {
    const radians = Math.atan2(point3.y - point2.y, point3.x - point2.x) -
                   Math.atan2(point1.y - point2.y, point1.x - point2.x);
    return Math.abs(radians * 180.0 / Math.PI);
  };

  const calculateAlignment = (ls: Point, rs: Point, lh: Point, rh: Point) => {
    const shoulderAngle = Math.atan2(rs.y - ls.y, rs.x - ls.x);
    const hipAngle = Math.atan2(rh.y - lh.y, rh.x - lh.x);
    return Math.abs(shoulderAngle - hipAngle) * 180.0 / Math.PI;
  };

  const checkLegsBehindHead = (la: Point, ra: Point, h: Point) => {
    return (la.y < h.y - 100) && (ra.y < h.y - 100);
  };

  const calculateHipMovement = (lh: Point, rh: Point) => {
    return Math.abs(lh.y - rh.y) / 100;
  };

  const calculateScore = (pose: poseDetection.Pose): number => {
    if (!currentMove) return 0;

    let score = 0;
    const keypoints = pose.keypoints;

    switch (currentMove.id) {
      case 'jade-split':
        const leftHip = keypoints.find(kp => kp.name === 'left_hip') as Point;
        const rightHip = keypoints.find(kp => kp.name === 'right_hip') as Point;
        const leftKnee = keypoints.find(kp => kp.name === 'left_knee') as Point;
        
        if (leftHip && rightHip && leftKnee) {
          const splitAngle = calculateAngle(leftHip, rightHip, leftKnee);
          score = Math.min(100, (splitAngle / 180) * 100);
        }
        break;
      // Add scoring for other moves...
    }

    return Math.round(score);
  };

  const generateVoiceGuidance = (feedback: Feedback[]) => {
    if (feedback.length === 0) return '';
    
    const messages = feedback.map(f => f.message);
    return messages.join('. ');
  };

  const detectPose = async () => {
    if (!detector || !webcamRef.current || !canvasRef.current) return;

    const video = webcamRef.current.video;
    if (!video || video.readyState !== 4) return;

    // Get video properties
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // Set canvas dimensions
    canvasRef.current.width = videoWidth;
    canvasRef.current.height = videoHeight;

    // Make pose detection
    const poses = await detector.estimatePoses(video);

    // Get canvas context for drawing
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Clear previous drawings
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    if (poses.length > 0) {
      const pose = poses[0];
      
      // Analyze pose and get feedback
      if (isRecording) {
        const newFeedback = analyzePose(pose);
        setFeedback(newFeedback);
      }

      // Draw skeleton
      drawSkeleton(ctx, pose);
    }

    // Call detectPose again
    requestAnimationFrame(detectPose);
  };

  const drawSkeleton = (ctx: CanvasRenderingContext2D, pose: poseDetection.Pose) => {
    // Draw points
    pose.keypoints.forEach((keypoint) => {
      if (keypoint.score && keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 4, 0, 2 * Math.PI);
        ctx.fillStyle = 'aqua';
        ctx.fill();
      }
    });

    // Draw connections
    const connections = poseDetection.util.getAdjacentPairs(poseDetection.SupportedModels.BlazePose);
    connections.forEach(([i, j]) => {
      const kp1 = pose.keypoints[i];
      const kp2 = pose.keypoints[j];

      if (kp1.score && kp2.score && kp1.score > 0.3 && kp2.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(kp1.x, kp1.y);
        ctx.lineTo(kp2.x, kp2.y);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'aqua';
        ctx.stroke();
      }
    });
  };

  useEffect(() => {
    if (!isLoading) {
      detectPose();
    }
  }, [isLoading]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-white">Practice Mode</h1>
        {currentMove ? (
          <>
            <h2 className="text-2xl text-purple-400">{currentMove.name}</h2>
            <p className="text-gray-300">{currentMove.description}</p>
          </>
        ) : (
          <p className="text-gray-300">Select a move from the moves page to begin practice</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className={`grid gap-4 ${splitScreen ? 'grid-cols-2' : 'grid-cols-1'}`}>
            <div className="relative aspect-video">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <div className="text-white">Loading pose detection model...</div>
                </div>
              )}
              <Webcam
                ref={webcamRef}
                className="absolute inset-0 w-full h-full rounded-lg"
                mirrored
              />
              <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute top-2 right-2 bg-gray-900/80 px-3 py-1 rounded-full">
                <span className="text-white font-medium">Score: {score}</span>
              </div>
            </div>

            {splitScreen && (
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <Avatar moveId={currentMove?.id || ''} isPlaying={isDemoPlaying} />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {currentMove && (
            <>
              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Controls</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setSplitScreen(!splitScreen)}
                    className="w-full px-4 py-2 rounded-lg font-medium bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    {splitScreen ? 'Hide Demo' : 'Show Side-by-Side Demo'}
                  </button>

                  <button
                    onClick={() => setIsDemoPlaying(!isDemoPlaying)}
                    className={`w-full px-4 py-2 rounded-lg font-medium ${
                      isDemoPlaying
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isDemoPlaying ? 'Pause Demo' : 'Play Demo'}
                  </button>

                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`w-full px-4 py-2 rounded-lg font-medium ${
                      isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isRecording ? 'Stop Analysis' : 'Start Analysis'}
                  </button>

                  <button
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                    className={`w-full px-4 py-2 rounded-lg font-medium ${
                      voiceEnabled
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-gray-600 hover:bg-gray-700 text-white'
                    }`}
                  >
                    {voiceEnabled ? 'Disable Voice' : 'Enable Voice'}
                  </button>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Progress</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Current Score:</span>
                    <span className="text-2xl font-bold text-purple-400">{score}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Best Score:</span>
                    <span className="text-2xl font-bold text-green-400">{bestScore}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-purple-600 rounded-full h-2 transition-all duration-300"
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Real-time Feedback</h3>
                <div className="space-y-2">
                  {feedback.map((item, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        item.type === 'success' ? 'bg-green-900/50 border-green-800' :
                        item.type === 'warning' ? 'bg-yellow-900/50 border-yellow-800' :
                        item.type === 'error' ? 'bg-red-900/50 border-red-800' :
                        'bg-blue-900/50 border-blue-800'
                      } border`}
                    >
                      <p className="text-sm text-white">{item.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="bg-gray-800/50 rounded-lg p-6 backdrop-blur-sm border border-gray-700">
            <h3 className="text-lg font-semibold text-white mb-4">Tips</h3>
            <ul className="list-disc list-inside text-gray-300 space-y-2 text-sm">
              <li>Position yourself so your full body is visible</li>
              <li>Ensure good lighting for better detection</li>
              <li>Start with the basic form before adding variations</li>
              <li>Take breaks when needed</li>
              <li>Watch the AI demo for proper form guidance</li>
            </ul>
          </div>
        </div>
      </div>

      {voiceEnabled && (
        <VoiceGuidance
          text={currentVoiceGuide}
          isPlaying={isRecording && currentVoiceGuide !== ''}
          onComplete={() => setCurrentVoiceGuide('')}
        />
      )}
    </div>
  );
} 