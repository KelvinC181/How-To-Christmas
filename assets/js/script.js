document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("backgroundMusic");
  const muteButton = document.getElementById("muteButton");
  const MUTE_STATE_KEY = 'audioMuted';
  audio.volume = 0.2;

  // Check localStorage for saved mute state
  const savedMuteState = localStorage.getItem(MUTE_STATE_KEY) === 'true';
  audio.muted = savedMuteState;
  muteButton.textContent = savedMuteState ? "Unmute Music" : "Mute Music";

  muteButton.addEventListener("click", (event) => {
    event.stopPropagation();
    if (audio.muted) {
      audio.muted = false;
      audio.currentTime = 0;
    } else {
      audio.muted = true;
    }

    // Save mute state to localStorage
    localStorage.setItem(MUTE_STATE_KEY, audio.muted);
    muteButton.textContent = audio.muted ? "Unmute Music" : "Mute Music";
  });
});