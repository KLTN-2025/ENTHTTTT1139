'use client';

import { useRef } from 'react';

export default function VideoPlayer({ videoUrl }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <div className="relative aspect-video bg-black">
      <video
        ref={videoRef}
        src={videoUrl || 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'}
        className="w-full h-full"
      />
    </div>
  );
}
