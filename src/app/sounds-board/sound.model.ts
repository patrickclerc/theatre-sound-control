export class SoundModel {
  id: number;
  rank: number;
  displayName: string;
  localSoundPath: string;
  remoteSoundPath: string;
  duration: number;
  volume: number;
  remote: boolean;
  active: boolean = false;
  loop: boolean = false;
}
