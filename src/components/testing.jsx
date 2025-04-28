import React from 'react'
import { VideoPlayer } from './VideoPage'


function testing() {
  return (
    <div className="relative bg-muted rounded-lg overflow-hidden shadow-lg flex items-center justify-center w-full max-w-4xl mx-auto">
    {/* Aspect ratio container for responsive sizing */}
    <div className="aspect-video w-full h-full bg-cover bg-center flex items-center justify-center">
        <VideoPlayer  />
    </div>

</div>

  )
}

export default testing