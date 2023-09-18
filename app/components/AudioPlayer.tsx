import React from "react";

export type AudioPlayerEndedEventCallback = () => void;
export type AudioPlayerLoadedEventCallback = () => void;
export type AudioPlayerVolumeChangeEventCallback = () => void;

export const useAudioPlayer = () => {
  const audioRef = React.useRef<HTMLAudioElement>();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [ready, setReady] = React.useState<boolean>(false);
  const [paused, setPaused] = React.useState<boolean>(true);
  const [loop, setLoop] = React.useState<boolean>(false);
  const [volume, setVolume] = React.useState<number>(0.2);
  const [duration, setDuration] = React.useState<number>(0);
  const [timeLeft, setTimeLeft] = React.useState<number>(0);
  const [currentTime, setCurrentTime] = React.useState<number>(0);
  const [ended, setEnded] = React.useState<boolean>(false);

  const handlePause = React.useCallback(() => {
    setPaused(true);
  }, []);

  const handlePlay = React.useCallback(() => {
    setPaused(false);
  }, []);

  const handleLoadStart = React.useCallback(() => {
    setLoading(true);
  }, []);

  const handleTimeUpdate = React.useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const { duration, currentTime } = audio;

    const timeLeft = Math.floor(duration - currentTime);

    setDuration(duration);
    setCurrentTime(currentTime);
    setTimeLeft(timeLeft);
  }, []);

  const handleCanPlay = React.useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    setDuration(audio.duration);

    setLoading(false);
    setReady(true);
  }, []);

  const handleEnded = React.useCallback(() => {
    setEnded(true);
  }, [setEnded]);

  React.useEffect(() => {
    const audio = (audioRef.current = new Audio());

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("play", handlePlay);

    audio.volume = volume;
    audio.autoplay = true;

    audio.loop = false;
    setLoop(false);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("play", handlePlay);

      audio.remove();
    };
  }, []);

  const play = React.useCallback(() => audioRef.current?.play(), []);

  const pause = React.useCallback(() => audioRef.current?.pause(), []);

  const setCurrentVolume = React.useCallback((volume: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    setVolume(volume);
    audio.volume = volume;
  }, []);

  const loadTrack = React.useCallback((url: string) => {
    if (!audioRef.current) return;

    audioRef.current.src = url;
    setEnded(false);
  }, []);

  const togglePlayPause = React.useCallback(() => {
    const audio = audioRef.current;

    const audioPaused = audio?.paused === undefined ? true : audio.paused;

    if (audioPaused) {
      play();
    } else {
      pause();
    }
  }, [pause, play]);

  const toggleLoop = React.useCallback(() => {
    const audio = audioRef.current;

    if (!audio) return;

    if (loop) {
      audio.loop = false;
      setLoop(false);
    } else {
      audio.loop = true;
      setLoop(true);
    }
  }, [loop]);

  const setPosition = React.useCallback((position: number) => {
    const audio = audioRef.current;

    if (!audio) return;

    audio.currentTime = position;
  }, []);

  return {
    loadTrack,
    play,
    pause,
    paused,
    toggleLoop,
    togglePlayPause,
    loading,
    ready,
    loop,
    volume,
    setCurrentVolume,
    duration,
    timeLeft,
    currentTime,
    ended,
    setPosition,
  };
};
