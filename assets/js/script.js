document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("backgroundMusic");
  const muteButton = document.getElementById("muteButton");
  audio.volume = 0.2;

  muteButton.addEventListener("click", () => {
    audio.muted = !audio.muted;

    muteButton.textContent = audio.muted ? "Unmute Music" : "Mute Music";
  });
});
