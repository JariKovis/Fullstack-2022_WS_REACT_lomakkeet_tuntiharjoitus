import React, { useState, useEffect } from "react";
import './index.css'


const App = () => {

  const [query, setQuery] = useState('')

  // Määritellään käsittelija napille 1 
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Tapahtuman aiheutti: ", event.target);
    console.log("Hakusana: ", query);

    GetOneMovie();
  };

  // Määritellään käsittelija napille 2 
  const handleClick = (event) => {
    event.preventDefault();
    console.log("Tapahtuman aiheutti: ", event.target);

    GetMovieData();
  };

  const [results, setResults] = useState([])

  const GetMovieData = () => {
    fetch("http://localhost:8081/api/leffat")
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        console.log(data);
        const items = data;

        setResults(items)
      });
  };

  const GetOneMovie = () => {
    fetch("http://localhost:8081/api/hae/" + query)
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        console.log("Haun tulokset", data);
        const items = data;
        console.log("One movie: ", data);

        setResults(items)
      });
  };

  // Leffatietojen esittäminen taulukossa
  const MovieArray = (props) => {
    const { data } = props;
    // Leffan kuvake
    let posterImg;

    // Funktio tyhjien kuvien tsekkaamiseen
    const CheckPoster = (props) => {
      let poster = props.src;
      // Jos kuvaa ei ole määritelty, korvataan se ikonilla
      if (poster === "" || poster === null) {
        posterImg = "https://openvirtualworlds.org/omeka/files/fullsize/1/30/movie-big.jpg";
      } else {
        posterImg = poster;
      }
      // Palautetaan kuvatägi. onError suoritetaan jos kuvan lataus ei onnistu
      return (
        <img
          src={posterImg}
          alt="Poster"
          className="img-thumbnail"
          /* onError={addDefaultSrc} */
          onError={(e) => { e.target.onerror = null; e.target.src = "https://openvirtualworlds.org/omeka/files/fullsize/1/30/movie-big.jpg" }}
          width="50%"
        />
      );
    };

    //Yritetään asettaa rikkinäiseen kuvaan tyhjä ikoni tai edes poistaa src-tägistä kokonaan
    const addDefaultSrc = (ev) => {
      console.log(ev.target);
      ev.target.src = "https://openvirtualworlds.org/omeka/files/fullsize/1/30/movie-big.jpg";
      ev.onError = null;
    };

    return (
      <div>
        <table className="table table-striped table-bordered">
          <thead>
            <tr key={props.id}>
              <th scope="col">Title</th>
              <th scope="col">Year</th>
              <th scope="col">Directors</th>
              <th scope="col">Rating</th>
              <th scope="col">Poster</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr>
                <td key={i}> {item.title}</td>
                <td> {item.year} </td>
                <td> {item.directors} </td>
                <td> {item.imdb.rating}</td>
                {/*  Luodaan kuvatägi komponentin sisältämässä funktiossa */}
                <td id="pic">
                  <CheckPoster src={item.poster} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };


  // Komponentin palauttama JSX muotoinen esitys
  return (
    <div>
      <h1>Hakusivu</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Hae: </label>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="form-control"
              placeholder="Syötä hakutermi"
              name="query"
            />
          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>

            <button
              type="button"
              className="btn"
              onClick={handleClick}
            >
              Hae kaikki
            </button>
          </div>
        </form>
      </div>
      <MovieArray data={results} />
    </div>
  );
};

export default App;
