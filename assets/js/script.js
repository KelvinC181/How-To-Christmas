document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("backgroundMusic");
  const muteButton = document.getElementById("muteButton");

  muteButton.addEventListener("click", () => {
    audio.muted = !audio.muted;

    muteButton.textContent = audio.muted ? "Unmute Music" : "Mute Music";
  });
});
