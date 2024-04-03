const fetchPromise1 = fetch(
  "https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&api_key=${apiKey}"
);

const fetchPromise2 = fetch(
  "https://opentdb.com/api.php?amount=1&type=boolean"
);

Promise.all([fetchPromise1, fetchPromise2])
  .then((responses) => {
    for (const response of responses) {
      console.log(`${response.url}: ${response.status}`);
    }
  })
  .catch((error) => {
    console.error(`Failed to fetch: ${error}`);
  });

Promise.any([fetchPromise1, fetchPromise2])
  .then((response) => {
    console.log(`${response.url}: ${response.status}`);
  })
  .catch((error) => {
    console.error(`Failed to fetch: ${error}`);
  });
