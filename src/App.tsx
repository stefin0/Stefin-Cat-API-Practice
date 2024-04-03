import { ChangeEvent, FormEvent, useState } from "react";
import { catBreeds } from "./catBreeds";
import "./App.css"

const apiKey = "live_ejuCYRfwWmzGOtiEqKDbU1W4bWgIufefclKq5wq9jY7g0gpSmbOhXv1KttM2ak94"

type Breed = {
  name: string;
  origin: string;
  rare: number;
  life_span: string;
  hypoallergenic: number;
  description: string;
}

type Photo  = {
  url: string;
  breeds: Breed[];
}

type NameToIdMap = {
  [key: string]: string;
};

function App() {
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [formData, setFormData] = useState({ breed: "" });

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
        <label style={{display: "block"}}>Search cat by breed</label>
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
    </main>
  );
}

export default App;
