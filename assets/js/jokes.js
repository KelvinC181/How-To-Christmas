let jokeSetup = document.querySelector("#jokeSetup");
let jokeContent = document.querySelector("#jokeContent");
let jokeCard = document.querySelector("#jokeCard");
let jokeButton = document.querySelector("#jokeButton");

/**
 * Fetches joke API
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
