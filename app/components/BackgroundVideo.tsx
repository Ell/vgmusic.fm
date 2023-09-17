import React from "react";

type BackgroundVideoProps = {
  videoURL: string;
};

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ videoURL }) => {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    }
  }, [videoURL])

  return (
    <video
      className={`z-0 fixed right-0 left-0 transition-opacity w-full h-full object-cover ${loading ? 'opacity-0' : 'opacity-100'}`}
      autoPlay
      loop
      muted
      src={videoURL}
    />
  )
}

