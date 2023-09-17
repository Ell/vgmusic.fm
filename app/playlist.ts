export type Track = {
  title: string;
  fileUrl: string;
  artists: string[];
  tags: string[];
  cover: string;
  game: string;
};

export function getRandomTrack(tracks: Track[]) {
  const track = tracks[Math.floor(Math.random() * tracks.length)];

  return track;
}

export function getTrackId(track: Track) {
  const splitUrl = track.fileUrl.split("/");

  return splitUrl[splitUrl.length - 1].replace(".mp3", "");
}

export function getTrackById(tracks: Track[], trackId: string) {
  return tracks.find((track) => getTrackId(track) === trackId);
}
