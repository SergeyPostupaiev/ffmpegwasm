import { createFFmpeg, FFmpeg } from '@ffmpeg/ffmpeg';

export class FFmpegHandler {
  ffmpeg: FFmpeg;
  constructor() {
    this.ffmpeg = createFFmpeg({
      log: true,
      logger: (d) => console.log(d),
      progress: (p) => console.log(p),
    });
  }
}
