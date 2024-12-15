document.querySelectorAll('.team-card').forEach((card) => {
  const audio = card.querySelector('.jingle-sound');

  card.addEventListener('mouseenter', () => {
    audio.volume = 0.3;
    audio.currentTime = 0;
    audio.play();
  });

  card.addEventListener('mouseleave', () => {
    audio.pause();
    audio.currentTime = 0;
  });
});
