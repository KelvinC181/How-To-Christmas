let jokeSetup = document.querySelector("#jokeSetup");
let jokeContent = document.querySelector("#jokeContent");
let jokeCard = document.querySelector("#jokeCard");
let jokeButton = document.querySelector("#jokeButton");
let jokeImage = document.querySelector("#randomImage"); // Select the image element

// Array of image paths
const images = [
  "assets/img/elf.png",
  "assets/img/reindeer.png",
  "assets/img/santa.png"
];

/**
 * Fetches joke API and updates the image
 */
let fetchJoke = async () => {
  // Hide the joke card while loading a new joke
  jokeCard.style.display = "none";

  try {
    // Fetch joke from the API
    const response = await fetch(`https://v2.jokeapi.dev/joke/Christmas?type=twopart`);
    const data = await response.json();

    // Populate the joke card with fetched data
    jokeSetup.textContent = data.setup;
    jokeContent.textContent = data.delivery;

    // Show the joke card
    jokeCard.style.display = "block";

    // Select a random image and update the src
    const randomImage = images[Math.floor(Math.random() * images.length)];
    jokeImage.src = randomImage;

  } catch (error) {
    // Handle errors gracefully
    console.log(error);
    jokeSetup.textContent = "Oops!";
    jokeContent.textContent = "There was an error, elf couldn't think of a joke in time";

    // Show the joke card even if there's an error
    jokeCard.style.display = "block";
  }
};

// Attach event listener to the button
jokeButton.addEventListener("click", fetchJoke);
