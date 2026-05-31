"use client";

import { useState } from "react";

export function ListeningControls({ text }: { text: string }) {
  const [rate, setRate] = useState("0.85");

  function speak() {
    if (!("speechSynthesis" in window)) {
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = Number(rate);
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="row">
      <select value={rate} onChange={(event) => setRate(event.target.value)} style={{ maxWidth: 180 }}>
        <option value="0.75">慢速</option>
        <option value="0.9">学习速度</option>
        <option value="1">正常速度</option>
      </select>
      <button type="button" onClick={speak}>播放音频</button>
      <button className="secondary" type="button" onClick={() => window.speechSynthesis?.cancel()}>停止</button>
    </div>
  );
}
