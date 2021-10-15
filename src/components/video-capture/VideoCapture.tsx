import { useEffect, useRef, useCallback, useState } from 'react';
import { Recorder } from '../services';
import './VideoCapture.css';

interface ConstaintsObjs {
  audio: boolean;
  video: boolean;
}

export const VideoCapture = () => {
  const [stream, setStream] = useState<MediaStream>();
  const [recorder, setRecorder] = useState<Recorder>();
  const getMedia = useCallback(async (constraints: ConstaintsObjs) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setStream(stream);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const constraints = {
      video: true,
      audio: true,
    };
    getMedia(constraints);
  }, [getMedia]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [disableStartBtn, setDisableStartBtn] = useState<boolean>(false);

  const handleCanPlay = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  const handleRecordingStart = useCallback(() => {
    console.log('start');

    if (stream) {
      const recorder = new Recorder(stream, 'video/webm;codecs=h264,pcm');
      setRecorder(recorder);
      setDisableStartBtn(true);
    }
  }, [stream]);

  const handleRecordingStop = useCallback(() => {
    console.log('stop');

    recorder?.stopRecording();
    setRecorder(undefined);
    setDisableStartBtn(false);
  }, [recorder]);

  return (
    <div>
      <div className='video__wrapper'>
        <video
          ref={videoRef}
          className='video'
          muted
          playsInline
          autoPlay
          onCanPlay={handleCanPlay}
        ></video>
      </div>
      <div className='button'>
        <button
          className='button__item'
          onClick={handleRecordingStart}
          disabled={disableStartBtn}
        >
          Start Recording
        </button>
        <button className='button__item' onClick={handleRecordingStop}>
          Stop Recording
        </button>
      </div>
    </div>
  );
};
