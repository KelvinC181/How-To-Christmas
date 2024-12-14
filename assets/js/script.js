document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("backgroundMusic");
  const muteButton = document.getElementById("muteButton");
  audio.volume = 0.2;

  muteButton.addEventListener("click", (event) => {
    event.stopPropagation()
    if (audio.muted) {
      audio.muted = false;
      audio.currentTime = 0;
    } else {
      audio.muted = true;
    }

    muteButton.textContent = audio.muted ? "Unmute Music" : "Mute Music";
  });
});
