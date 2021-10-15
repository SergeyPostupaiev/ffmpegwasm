export class Recorder {
  mediaRecorder: MediaRecorder;
  blob_reader: FileReader;
  blobs: Blob[] = [];

  constructor(stream: MediaStream, mimeType: string) {
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 10000000,
    });

    this.blob_reader = new FileReader();
    this.blob_reader.addEventListener('load', async (e) => {
      if (e && e.currentTarget) {
        const currentTarget: FileReader = e.currentTarget as FileReader;
        // send currentTarget.result to ffmpeg

        if (this.blobs.length) {
          const blob = this.blobs.shift();
          if (blob) {
            currentTarget.readAsArrayBuffer(blob);
          }
        }
      }
    });

    this.mediaRecorder.ondataavailable = async ({ data }) => {
      if (this.blob_reader.readyState !== 1) {
        this.blob_reader.readAsArrayBuffer(data);
      } else {
        this.blobs.push(data);
      }
    };
  }

  startRecording() {
    setTimeout(() => {
      this.mediaRecorder.start(1000);
    }, 5000);
  }

  stopRecording() {
    this.mediaRecorder.stop();
    this.blob_reader.abort();
  }
}
