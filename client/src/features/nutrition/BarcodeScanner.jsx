import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { BrowserMultiFormatReader } from '@zxing/browser';

const BarcodeScanner = ({ onDetected }) => {
  const videoRef = useRef(null);
  const scannedRef = useRef(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let currentStream;

    const startScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        currentStream = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          codeReader.decodeFromVideoDevice(null, videoRef.current, (result, err) => {
            if (result && !scannedRef.current) {
              scannedRef.current = true;
              onDetected(result.getText());
              codeReader.reset();
              currentStream.getTracks().forEach((track) => track.stop());
            }
            if (err && err.name !== 'NotFoundException') {
              setError(err.message);
            }
          });
        }
      } catch (err) {
        setError(err.message);
      }
    };

    if (navigator.mediaDevices?.getUserMedia) {
      startScanner();
    } else {
      setError('Camera access is not supported on this device.');
    }

    return () => {
      codeReader.reset();
      scannedRef.current = false;
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [onDetected]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold text-slate-700">Scan barcode</p>
      <video ref={videoRef} className="h-48 w-full rounded-xl bg-slate-900/5 object-cover" muted />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

BarcodeScanner.propTypes = {
  onDetected: PropTypes.func.isRequired,
};

export default BarcodeScanner;
