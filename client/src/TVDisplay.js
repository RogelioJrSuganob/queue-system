import React, { useEffect, useRef } from "react";

export default function TVDisplay({ queue }) {
  const prevNumber = useRef(queue.number);

  useEffect(() => {
    // Only play sound if number actually changed
    if (queue.number !== prevNumber.current) {
      playSound();
      speak(queue.number, queue.window);
      prevNumber.current = queue.number;
    }
  }, [queue]);

  useEffect(() => {
  console.log("Press F11 for fullscreen TV mode");
  }, []);

  const playSound = () => {
    const audio = new Audio("/ding.mp3");
    audio.play();
  };

  const speak = (number, window) => {
    const msg = new SpeechSynthesisUtterance(
      `Now serving number ${number}, please proceed to window ${window}`
    );
    speechSynthesis.speak(msg);
  };

  return (
    <div className="tv">
      <h1 className="tv-title">NOW SERVING</h1>

      <div className="tv-number">{queue.number}</div>

      <div className="tv-window">
        WINDOW {queue.window}
      </div>
    </div>
  );

}