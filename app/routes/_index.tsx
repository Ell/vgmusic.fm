import type { LoaderArgs, V2_MetaFunction } from "@remix-run/cloudflare";
import { redirect } from "@remix-run/cloudflare";
import { getRandomTrack, getTrackId } from "~/playlist";

export const meta: V2_MetaFunction = () => {
  return [
    { title: "vgmusic.fm" },
    { name: "description", content: "vgmusic.fm" },
  ];
};

export async function loader({ request, context }: LoaderArgs) {
  const kv = context.VGMUSIC;

  const tracks = JSON.parse((await kv.get("tracks")) ?? "[]");
  const track = getRandomTrack(tracks);
  const trackId = getTrackId(track);

  return redirect(`/${trackId}`);
}
