import { MusicBrainzApi } from "musicbrainz-api";

export const mbApi = new MusicBrainzApi({
  appName: "keytrack",
  appVersion: "0.1.0",
  appContactInfo: "keytrack@npham.de",
});
