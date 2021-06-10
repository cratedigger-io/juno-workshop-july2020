import React from "react";
import ReactModal from "react-modal";

import HomePage from "../../pageComponents/HomePage";

import { MOVIE_BASE_URL } from "../../utils/constants";

export default class HomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      movies: [],
      showMovieDetailsModal: false,
      currentMovieDetails: {}
    };
  }

  async componentDidMount() {
    try {
      const movieTrendingUrl = `${MOVIE_BASE_URL}/trending/movie/day?page=1`;
      const responsePromise = await fetch(movieTrendingUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const response = await responsePromise.json();
      console.log(response);
      this.setState({
        isLoaded: true,
        movies: response.results,
      });
    } catch (e) {
      this.setState({
        error: e,
        isLoaded: true,
      });
    }
  }

  async getMovieDetails(movie) {
    try {
      const movieDetailsUrl = `${MOVIE_BASE_URL}/movie/${movie}`;
      const responsePromise = await fetch(movieDetailsUrl, {
        headers: {
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
          "Content-Type": "application/json;charset=utf-8",
        },
      });
      const response = await responsePromise.json();
      this.setState({
        currentMovieDetails: response
      })
    } catch (e) {
      this.setState({
        error: e,
        isLoaded: true,
      });
    }
  }

  handleOpenMovieModal = (movie) => {
    this.setState({ showMovieDetailsModal: true });
    this.getMovieDetails(movie);
  };

  handleCloseMovieModal = () => {
    this.setState({ showMovieDetailsModal: false });
  };

  render() {
    const { error, isLoaded, movies } = this.state;
    const hasMovies = movies && movies.length > 0;
    return (
      <>
        {error && <div>Error: {error.message}</div>}
        {!isLoaded && <div>Loading...</div>}
        {isLoaded && !error && hasMovies && (
          <>
            <HomePage movies={movies} onCardClick={this.handleOpenMovieModal} />
            <ReactModal
              isOpen={this.state.showMovieDetailsModal}
              // gets called for closing the modal via esc / other keys
              onRequestClose={this.handleCloseMovieModal}
            >
              <button onClick={this.handleCloseMovieModal}>X</button>

              {
                this.state.currentMovieDetails
                ?
                  <>
                <img src={`https://image.tmdb.org/t/p/original${this.state.currentMovieDetails.poster_path}`} alt="" />
                  </>
                :
                  <>
                  </>
                }
            </ReactModal>
          </>
        )}
      </>
    );
  }
}
