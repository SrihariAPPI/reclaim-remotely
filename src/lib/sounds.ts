export function playBeep() {
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  const beep = (time: number) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = 800;
    osc.type = 'sine';
    gain.gain.value = 0.3;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(time);
    osc.stop(time + 0.15);
  };
  const now = ctx.currentTime;
  beep(now);
  beep(now + 0.25);
  beep(now + 0.5);
}
