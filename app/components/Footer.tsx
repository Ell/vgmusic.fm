import type { ReactNode } from "react";
import React from "react";

import {
  ArrowPathIcon,
  ForwardIcon,
  SpeakerWaveIcon,
} from "@heroicons/react/20/solid";

import type { Track } from "~/playlist";
import TrackCover from "~/components/TrackCover";
import { useAudioPlayer } from "~/components/AudioPlayer";
import { useNavigate } from "@remix-run/react";
import { ProgressBar } from "~/components/ProgressBar";

function ControlButton({
  children,
  onClick,
}: {
  children?: ReactNode;
  onClick?: () => void;
}) {
  return (
    <div
      className="w-8 h-8 bg-gray-900 mr-3 border border-gray-800 rounded-md p-1"
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export type FooterProps = {
  track: Track;
};

export default function Footer({ track }: FooterProps) {
  const navigate = useNavigate();
  const [volumeVisible, setVolumeVisible] = React.useState<boolean>(false);

  const {
    ready,
    loading,
    loadTrack,
    paused,
    togglePlayPause,
    currentTime,
    duration,
    loop,
    toggleLoop,
    ended,
    setPosition,
    volume,
    setCurrentVolume,
  } = useAudioPlayer();

  const navigateToNextTrack = React.useCallback(
    () => navigate("/"),
    [navigate]
  );

  React.useEffect(() => {
    loadTrack(track.fileUrl);
  }, [loadTrack, track]);

  React.useEffect(() => {
    if (ended) navigateToNextTrack();
  }, [ended, navigateToNextTrack]);

  React.useEffect(() => {
    if (!currentTime || !duration) return;

    navigator.mediaSession.setPositionState({
      duration,
      position: currentTime,
      playbackRate: 1,
    });
  }, [currentTime, duration]);

  React.useEffect(() => {
    navigator.mediaSession.setActionHandler("nexttrack", () => {
      navigateToNextTrack();
    });

    navigator.mediaSession.setActionHandler("seekto", (e) => {
      if (!e.seekTime) return;

      setPosition(e.seekTime);
    });

    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title,
      artist: track.artists.length > 0 ? track.artists[0] : "Unknown Artist",
      album: track.game,
      artwork: [
        {
          src: track.cover,
          sizes: "90x120",
        },
      ],
    });
  }, [navigateToNextTrack, setPosition, track]);

  const onForwardClick = () => navigateToNextTrack();

  const onCoverClick = () => {
    if (loading || !ready) return;

    togglePlayPause();
  };

  const onLoopClick = () => {
    toggleLoop();
  };

  const artist = track.artists.length > 0 ? track.artists[0] : "Unknown Artist";

  const toggleVolumeVisibility = () => {
    setVolumeVisible(!volumeVisible);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex flex-row-reverse w-full h-7 mb-2">
        <ControlButton onClick={onForwardClick}>
          <ForwardIcon />
        </ControlButton>
        <ControlButton onClick={onLoopClick}>
          <ArrowPathIcon className={!loop ? "text-slate-400" : ""} />
        </ControlButton>
        <ControlButton onClick={toggleVolumeVisibility}>
          <input
            className={`absolute bottom-36 right-[52px] transition duration-100 ease-in-out vertical-slider track-volume ${
              volumeVisible ? "block" : "hidden"
            }`}
            type="range"
            value={volume * 100}
            // @ts-ignore
            orient="vertical"
            min={1}
            max={100}
            step={1}
            onChange={(e) =>
              setCurrentVolume(parseInt(e.target.value, 10) * 0.01)
            }
          />
          <SpeakerWaveIcon />
        </ControlButton>
      </div>
      <div className="flex w-full h-full bg-gray-900">
        <TrackCover
          onClick={onCoverClick}
          track={track}
          loading={loading}
          paused={paused}
          className="flex-none h-full w-24 bg-fit bg-contain"
        />
        <div className="w-full h-full p-2 pl-4 overflow-hidden whitespace-nowrap">
          <div className="text-3xl truncate">{track.title}</div>
          <div className="truncate">{artist}</div>
          <div className="truncate">{track.game}</div>
        </div>
      </div>
      <div className="w-full h-1">
        <ProgressBar currentProgress={(currentTime / duration) * 100} />
      </div>
    </div>
  );
}
