"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";

interface Track {
  name: string;
  author: string;
  img: string;
  audio: string;
  duration: string;
}

const tracks: Track[] = [
  {
    name: "THE WORLD BEGINS",
    author: "JROBERTS",
    img: "https://musicMeg.b-cdn.net/Slow_motion.gif",
    audio: "https://musicMeg.b-cdn.net/How%20the%20World%20Begins.mp3",
    duration: "4:19",
  },
  {
    name: "NEW DAYS",
    author: "JROBERTS",
    img: "https://musicMeg.b-cdn.net/Man_and_woman_by_campfire_202605131558.jpeg",
    audio: "https://musicMeg.b-cdn.net/New%20Days.mp3",
    duration: "4:45",
  },
  {
    name: "ROADS WE KNEW",
    author: "JROBERTS",
    img: "https://musicMeg.b-cdn.net/wag.jpeg",
    audio: "https://musicMeg.b-cdn.net/Wagoneer%20Roads.mp3",
    duration: "2:59",
  },
  {
    name: "ALL AT ONCE",
    author: "JROBERTS",
    img: "https://musicMeg.b-cdn.net/The_three_boys_are_in_the_garden_picking_blac.gif",
    audio: "https://musicMeg.b-cdn.net/All%20At%20Once.mp3",
    duration: "4:05",
  },
  {
    name: "WHAT ARE YOU WAITING FOR",
    author: "JROBERTS",
    img: "https://musicMeg.b-cdn.net/waitingfor.jpeg",
    audio: "https://musicMeg.b-cdn.net/What%20Are%20You%20Waiting%20For.mp3",
    duration: "4:19",
  },
  {
    name: "HOMETOWN FEELING",
    author: "JROBERTS",
    img: "https://musicMeg.b-cdn.net/fam.png",
    audio: "https://musicMeg.b-cdn.net/Hometown%20Feeling.mp3",
    duration: "3:30",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLInputElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  // Spotlight cursor effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (currentTrackIndex < tracks.length - 1) {
        setCurrentTrackIndex((prev) => prev + 1);
      } else {
        setCurrentTrackIndex(0);
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("durationchange", handleDurationChange);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("durationchange", handleDurationChange);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [currentTrackIndex]);

  // Auto-play when track changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(console.error);
    }
  }, [currentTrackIndex, isPlaying]);

  // Volume control
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const playTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev === 0 ? tracks.length - 1 : prev - 1));
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev === tracks.length - 1 ? 0 : prev + 1));
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="spotlight-container min-h-screen relative">
      {/* Floral background pattern */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://www.toptal.com/designers/subtlepatterns/uploads/ffd6f82c-60e2-4c97-bdc9-850e966f3ed7/pink-flowers.png')`,
          backgroundRepeat: "repeat",
          opacity: 0.15,
        }}
      />

      {/* Dark overlay with quilted pattern */}
      <div className="fixed inset-0 z-0 quilted-pattern bg-gradient-to-br from-background via-background/95 to-muted/50" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        {/* MLR Embossed Header */}
        <header className="mb-8 text-center">
          <h1 className="embossed-text text-6xl md:text-8xl font-serif floating">
            MLR
          </h1>
          <p className="mt-4 text-muted-foreground text-sm tracking-widest uppercase">
            Music Collection
          </p>
        </header>

        {/* Main Player Card */}
        <div className="w-full max-w-md">
          <div className="bg-card backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-border now-playing">
            {/* Album Art */}
            <div className="relative aspect-square w-full max-w-[280px] mx-auto mb-6 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src={currentTrack.img}
                alt={currentTrack.name}
                fill
                className="object-cover transition-transform duration-500"
                sizes="280px"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/280?text=♪";
                }}
              />
              {/* Vinyl record effect overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/20" />
            </div>

            {/* Track Info */}
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-foreground truncate">
                {currentTrack.name}
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                {currentTrack.author}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <input
                ref={progressRef}
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleProgressChange}
                className="w-full h-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={prevTrack}
                className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Previous track"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>

              <button
                onClick={togglePlay}
                className="relative p-5 bg-primary rounded-full text-primary-foreground hover:scale-105 transition-transform shadow-lg pulse-ring"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-8 h-8"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <button
                onClick={nextTrack}
                className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Next track"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>

            {/* Volume Control */}
            <div className="flex items-center gap-3 mt-6 px-4">
              <svg
                className="w-4 h-4 text-muted-foreground flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1"
              />
            </div>
          </div>

          {/* Playlist */}
          <div className="mt-6 bg-card/60 backdrop-blur-lg rounded-2xl overflow-hidden border border-border">
            <h3 className="px-5 py-3 text-sm font-medium text-muted-foreground border-b border-border">
              Playlist
            </h3>
            <div className="max-h-80 overflow-y-auto">
              {tracks.map((track, index) => (
                <button
                  key={index}
                  onClick={() => playTrack(index)}
                  className={`w-full flex items-center gap-4 px-5 py-3 hover:bg-muted/30 transition-colors ${
                    index === currentTrackIndex
                      ? "bg-primary/10 border-l-4 border-l-primary"
                      : ""
                  }`}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                      src={track.img}
                      alt={track.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/48?text=♪";
                      }}
                    />
                    {index === currentTrackIndex && isPlaying && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="flex gap-0.5">
                          {[1, 2, 3].map((bar) => (
                            <span
                              key={bar}
                              className="w-1 bg-primary rounded-full animate-pulse"
                              style={{
                                height: `${12 + Math.random() * 8}px`,
                                animationDelay: `${bar * 0.1}s`,
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p
                      className={`text-sm font-medium truncate ${
                        index === currentTrackIndex
                          ? "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {track.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {track.author}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {track.duration}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-muted-foreground text-xs">
          <p>Made with ♥ for Mom</p>
        </footer>
      </div>

      {/* Hidden audio element */}
      <audio ref={audioRef} src={currentTrack.audio} preload="metadata" />
    </div>
  );
}
