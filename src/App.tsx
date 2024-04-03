import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { catBreeds } from "./catBreeds";
import { Photo, NameToIdMap } from "./types";
import "./App.css"

const apiKey = import.meta.env.VITE_API_KEY;

function App() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [formData, setFormData] = useState({ breed: "" });

  const [answer, setAnswer] = useState({
    question: "",
    correctAnswer: ""
  });
  const [userAnswer, setUserAnswer] = useState<string | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    // Create instance of worker (Vite specific)
    const worker = new Worker(new URL('./triviaWorker.js', import.meta.url))

    worker.onmessage = (event) => {
      const fetchedData = event.data;
      setAnswer(prevState => ({
        ...prevState,
        question: fetchedData.results[0].question,
        correctAnswer: fetchedData.results[0].correct_answer
      }));
    }

    setWorker(worker);

    return () => {
      worker.terminate();
    }
  }, [])

  const fetchQuestion = () => {
    setIsButtonDisabled(true);

    if (worker) {
      worker.postMessage({ command: "generate" });
    }
    setUserAnswer(null);
    setTimeout(() => {
      setIsButtonDisabled(false);
    },10000)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  }

  const nameToId: NameToIdMap = catBreeds.reduce<NameToIdMap>((acc, breed) => {
    acc[breed.name] = breed.id;
    return acc;
  }, {});

  function fetchPhoto(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const breedId = nameToId[formData.breed];
    console.log(breedId);

    if (!breedId) {
      alert("Breed not recognized. Please try something else.");
    }

    fetch(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&api_key=${apiKey}`,
    )
      .then((response) => response.json())
      .then((json) => setPhoto(json[0]))
      .catch((error) => console.log("There was an error: ", error));
  }

  console.log(photo);

  return (
    <main className="main">
      {photo && (
        <>
          <img src={photo.url} width={500} />{" "}
          <ul className="shortenText">
            <li><b>Breed</b>: {photo.breeds[0].name}</li>
            <li><b>Origin</b>: {photo.breeds[0].origin}</li>
            <li><b>Rare</b>: {photo.breeds[0].rare === 0 ? "No" : "Yes"}</li>
            <li><b>Life Span</b>: {photo.breeds[0].life_span} years</li>
            <li><b>Hypoallergenic</b>: {photo.breeds[0].hypoallergenic === 0 ? "No" : "Yes"}</li>
            <li><b>Description</b>: {photo.breeds[0].description}</li>
          </ul>
        </>
      )}
      <form onSubmit={fetchPhoto}>
        <label style={{ display: "block" }}>Search cat by breed</label>
        <input
          id="breed"
          name="breed"
          list="breeds"
          onChange={handleChange}
          value={formData.breed}
          placeholder="Bengal"
        />
        <datalist id="breeds">
          {catBreeds.map((breed) => (
            <option key={breed.id} value={breed.name}></option>
          ))}
        </datalist>
        <button>Search</button>

      </form>

      <button onClick={fetchQuestion} disabled={isButtonDisabled}>Generate Trivia Question</button>
      <div dangerouslySetInnerHTML={{ __html: answer.question }}></div>
      {answer.question && (
        <div>
          <button onClick={() => setUserAnswer("True")}>True</button>
          <button onClick={() => setUserAnswer("False")}>False</button>
        </div>)
      }
      {userAnswer && <div>{userAnswer === answer.correctAnswer ? "Correct" : "Incorrect"}</div>}

    </main>
  );
}

export default App;
