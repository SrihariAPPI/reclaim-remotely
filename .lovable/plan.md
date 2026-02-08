

# Add Beep Sound to Device Ring Action

## Overview
Add an audible beep sound that plays on the current device when the "Ring" action is triggered, giving immediate audio feedback.

## Approach
Use the Web Audio API to generate a beep sound programmatically -- no external files or APIs needed. This keeps it lightweight and works offline.

## Technical Details

### 1. Create a sound utility (`src/lib/sounds.ts`)
- Create a `playBeep()` function using the Web Audio API (`AudioContext` + `OscillatorNode`)
- Generate a repeating beep pattern (3 short beeps) at ~800Hz frequency
- No external dependencies or audio files required

### 2. Integrate into DeviceActions (`src/components/DeviceActions.tsx`)
- Import `playBeep` in the `handleRing` function
- Call `playBeep()` when the user taps "Ring" so the sound plays immediately alongside the toast notification

## Files
- **Create**: `src/lib/sounds.ts` (beep sound utility)
- **Edit**: `src/components/DeviceActions.tsx` (call `playBeep()` in `handleRing`)

