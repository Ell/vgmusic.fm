import PlayIcon from "@heroicons/react/24/solid/PlayIcon";
import PauseIcon from "@heroicons/react/24/solid/PauseIcon";

import type { Track } from "~/playlist";
import Spinner from "~/components/Spinner";

type TrackCoverProps = {
  onClick: () => void;
  track: Track;
  loading: boolean;
  paused: boolean;
  className?: string;
};

export default function TrackCover({
  onClick,
  track,
  loading,
  paused,
  className,
}: TrackCoverProps) {
  return (
    <div style={{ background: `url("${track.cover}")` }} className={className}>
      <div className="w-full h-full justify-center items-center backdrop-brightness-100 text-center hover:backdrop-brightness-50 group">
        <>
          {loading && (
            <div className="w-full h-full p-2">
              <Spinner />
            </div>
          )}
          {!loading && (
            <div className="opacity-0 group-hover:opacity-100 pt-2">
              {!paused && <PauseIcon onClick={onClick} />}
              {paused && <PlayIcon onClick={onClick} />}
            </div>
          )}
        </>
      </div>
    </div>
  );
}
