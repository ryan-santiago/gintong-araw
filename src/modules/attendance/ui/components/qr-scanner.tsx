"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";

interface QrCodeScannerProps {
  active: boolean;
  onDecode: (payload: string) => void;
}

export const QrCodeScanner = ({ active, onDecode }: QrCodeScannerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const onDecodeRef = useRef(onDecode);
  const [hasCamera, setHasCamera] = useState<boolean | null>(null);

  onDecodeRef.current = onDecode;

  useEffect(() => {
    QrScanner.hasCamera().then(setHasCamera);
  }, []);

  useEffect(() => {
    if (!active || !videoRef.current) {
      return;
    }

    const scanner = new QrScanner(
      videoRef.current,
      (result) => onDecodeRef.current(result.data),
      {
        maxScansPerSecond: 5,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        returnDetailedScanResult: true,
      },
    );

    scannerRef.current = scanner;
    scanner.start();

    return () => {
      scanner.stop();
      scanner.destroy();
      scannerRef.current = null;
    };
  }, [active]);

  if (hasCamera === false) {
    return (
      <p className="text-sm text-muted-foreground text-center py-8">
        No camera was found on this device.
      </p>
    );
  }

  return (
    <video ref={videoRef} className="w-full rounded-md aspect-square object-cover" />
  );
};
