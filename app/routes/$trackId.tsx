import React from "react";

import type { LoaderArgs, V2_MetaFunction } from "@remix-run/cloudflare";
import { json, redirect } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";

import { getTrackById } from "~/playlist";
import { getRandomVideo } from "~/videos";
import { BackgroundVideo } from "~/components/BackgroundVideo";
import Header from "~/components/Header";
import Footer from "~/components/Footer";

const VIDEO_INTERVAL = 1000 * 60 * 2;

export async function loader({ params, context }: LoaderArgs) {
  const trackId = params.trackId;

  if (!trackId) {
    return redirect("/");
  }

  const kv = context.VGMUSIC;

  const tracks = JSON.parse((await kv.get("tracks")) ?? "[]");
  const track = getTrackById(tracks, trackId);

  if (!track) {
    return redirect("/");
  }

  return json({ track });
}

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `vgmusic.fm - ${data?.track.title}` },
    { name: "description", content: "vgmusic.fm" },
  ];
};

export default function TrackRoute() {
  const { track } = useLoaderData<typeof loader>();
  const [video, setVideo] = React.useState<string>(getRandomVideo());

  React.useEffect(() => {
    const interval = setInterval(() => {
      const randomVideo = getRandomVideo();

      setVideo(randomVideo);
    }, VIDEO_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <>
      <BackgroundVideo videoURL={video} />
      <div className="flex flex-col w-full h-full justify-between z-10 fixed bottom-0">
        <div className="flex flex-row w-full h-9 bg-gray-900">
          <Header />
        </div>
        <div className="w-full h-36">
          <Footer track={track} />
        </div>
      </div>
    </>
  );
}
