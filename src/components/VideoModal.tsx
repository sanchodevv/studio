import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, X, Volume2, VolumeX, Maximize, Settings, RotateCcw } from 'lucide-react';
import type { Project } from './Portfolio';
import './VideoModal.css';

interface VideoModalProps {
  project: Project | null;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ project, onClose }) => {
  if (!project) return null;

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [isCinemaMode, setIsCinemaMode] = useState(false);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
      if (e.key === 'ArrowRight') seek(5);
      if (e.key === 'ArrowLeft') seek(-5);
      if (e.key === 'ArrowUp') adjustVolume(0.1);
      if (e.key === 'ArrowDown') adjustVolume(-0.1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, volume, isMuted]);

  // Audio wave canvas visualizer simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const centerY = height / 2;

      // Draw futuristic visualizer bars
      const barCount = 45;
      const barWidth = 3;
      const gap = 4;
      const startX = (width - (barCount * (barWidth + gap))) / 2;

      ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
      
      for (let i = 0; i < barCount; i++) {
        // Calculate height based on sine waves + noise if playing, static if paused
        let amplitude = 0;
        if (isPlaying) {
          amplitude = Math.sin(i * 0.15 + phase) * Math.cos(i * 0.05 + phase * 0.5) * 15 + 18;
          // Add some micro jitter
          amplitude += Math.random() * 4;
        } else {
          amplitude = Math.sin(i * 0.15) * 3 + 4; // micro static bars
        }

        const x = startX + i * (barWidth + gap);
        const y = centerY - amplitude / 2;

        // Gradient for bars
        const grad = ctx.createLinearGradient(x, y, x, y + amplitude);
        grad.addColorStop(0, '#b927fc'); // purple
        grad.addColorStop(0.5, '#00f2fe'); // cyan
        grad.addColorStop(1, '#ff007f'); // pink

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, amplitude, 2);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.08;
      }
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationId);
  }, [isPlaying]);

  // Monitor Video State
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTimeUpdate = () => setCurrentTime(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('timeupdate', onTimeUpdate);
    video.addEventListener('loadedmetadata', onLoadedMetadata);

    // Auto play when modal opens
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('timeupdate', onTimeUpdate);
      video.removeEventListener('loadedmetadata', onLoadedMetadata);
    };
  }, [project]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(() => {});
    }
  };

  const seek = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = parseFloat(e.target.value);
    video.volume = newVol;
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const adjustVolume = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;
    const newVol = Math.max(0, Math.min(1, video.volume + delta));
    video.volume = newVol;
    setVolume(newVol);
    setIsMuted(newVol === 0);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setPlaybackRate(rate);
    setShowSpeedMenu(false);
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Helper to format time
  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`modal-overlay ${isCinemaMode ? 'cinema' : ''}`}>
      {/* Background click to close */}
      <div className="modal-backdrop" onClick={onClose} />

      <div 
        className="modal-content glass-panel" 
        ref={containerRef}
      >
        {/* Top Control Bar */}
        <div className="modal-top-bar">
          <div className="modal-project-title">
            <span className="live-pill">PLAYING</span>
            <h4>{project.title}</h4>
          </div>
          <div className="top-action-buttons">
            <button 
              className={`cinema-toggle-btn ${isCinemaMode ? 'active' : ''}`}
              onClick={() => setIsCinemaMode(!isCinemaMode)}
              title="Kino rejimi"
            >
              <Settings size={18} />
            </button>
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Video viewport area */}
        <div className="modal-viewport" onClick={togglePlay}>
          <video 
            ref={videoRef}
            src={project.videoUrl}
            className="modal-video-element"
            playsInline
            loop
          />

          {/* Big Play Overlay (appears momentarily when paused) */}
          {!isPlaying && (
            <div className="play-overlay-circle">
              <Play size={32} fill="currentColor" className="overlay-play-icon" />
            </div>
          )}
        </div>

        {/* Custom Controls Container */}
        <div className="modal-controls-area">
          
          {/* Audio wave simulation canvas */}
          <div className="visualizer-wrapper">
            <canvas ref={canvasRef} width="350" height="40" className="wave-canvas" />
          </div>

          {/* Scrubber slider bar */}
          <div className="scrubber-container">
            <input 
              type="range" 
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleScrubberChange}
              className="video-scrubber"
            />
            <div 
              className="scrubber-progress" 
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>

          {/* Buttons Row */}
          <div className="controls-row">
            <div className="controls-group left">
              {/* Play Pause */}
              <button className="ctrl-btn play-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>

              {/* Rewind */}
              <button className="ctrl-btn" onClick={() => seek(-10)} title="10s orqaga">
                <RotateCcw size={16} />
              </button>

              {/* Time Display */}
              <div className="time-display">
                <span className="text-cyan">{formatTime(currentTime)}</span>
                <span className="text-muted"> / {formatTime(duration)}</span>
              </div>
            </div>

            <div className="controls-group right">
              {/* Speed Selector */}
              <div className="speed-selector-wrapper">
                <button 
                  className="ctrl-btn text-btn" 
                  onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                >
                  {playbackRate}x
                </button>
                {showSpeedMenu && (
                  <div className="speed-dropdown glass-panel">
                    {[0.5, 1, 1.25, 1.5, 2].map(rate => (
                      <button 
                        key={rate} 
                        className={`speed-option ${playbackRate === rate ? 'active' : ''}`}
                        onClick={() => handleSpeedChange(rate)}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Volume Slider */}
              <div className="volume-container">
                <button className="ctrl-btn" onClick={toggleMute}>
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="volume-slider"
                />
              </div>

              {/* Fullscreen */}
              <button className="ctrl-btn" onClick={toggleFullscreen}>
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default VideoModal;
