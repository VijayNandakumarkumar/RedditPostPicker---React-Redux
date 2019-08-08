import React, { Component } from "react";
import "../App.css";
import Wallpapers from "./wallpaper";
import _ from "lodash";
import SearchBar from "./search_bar";

class App extends Component {
  state = {
    subReddit: "wallpapers", //wallpapers_by_default
    files: [],
    after: null,
    before: null,
    page: 1
  };

  constructor(props) {
    super(props);
    this.url = "https://www.reddit.com/r/";
    this.wallpaperSubreddits = "wallpapers";
    this.catsSubreddits = "cats";
    this.subredditsArray = [
      "wallpaper",
      "wallpapers",
      "widescreenwallpaper",
      "wqhd_wallpaper",
      "memes",
      "dankmemes",
      "memeeconomy",
      "animemes",
      "mobilewallpapers",
      "amoledbackgrounds",
      "verticalwallpapers"
    ];
    this.portraitSubreddits =
      "mobilewallpapers+amoledbackgrounds+verticalwallpapers";
    this.memesSubreddits = "memes+dankmemes+memeeconomy+animemes";
  }

  componentDidMount() {
    this.updatePage(this.state.subReddit);
  }

  updatePage(sub) {
    // Resetting the State
    this.setState({
      files: [],
      subReddit: sub,
      page: 1
    });

    fetch(this.url + sub + ".json?limit=100")
      .then(response => response.json())
      .then(data => {
        this.setState({
          files: data.data.children,
          after: data.data.after, //to get the next set of post
          before: data.data.before //to load previous post if any
        });
        window.scrollTo(0, 0);
      })
      .catch(console.log);
  }

  loadNextPage = () => {
    fetch(
      this.url +
        this.state.subReddit +
        ".json?limit=100" +
        "&after=" +
        this.state.after
    )
      .then(response => response.json)
      .then(data => {
        this.setState({
          files: data.data.children,
          after: data.data.after,
          before: data.data.before,
          page: this.state.page + 1
        });
        window.scrollTo(0, 0);
      })
      .catch(console.log);
  };

  loadPrevPage = () => {
    fetch(
      this.url +
        this.state.subReddit +
        ".json?limit=100" +
        "&before=" +
        this.state.before
    )
      .then(response => response.json)
      .then(data => {
        let newState = {
          files: data.data.children,
          after: data.data.after,
          before: data.data.before
        };

        if (this.state.page > 1) newState.page = this.state.page - 1;
        this.setState(newState);
      })
      .catch(console.log);
  };

  searchSubreddit(subreddit) {
    if (subreddit.length !== 0) {
      this.updatePage(subreddit);
    } else {
      this.updatePage(this.state.subReddit);
    }
  }

  render() {
    const searchSubreddit = _.debounce(term => {
      this.searchSubreddit(term);
    }, 600);
    let contentJSX;
    if (this.state.files.length > 0) {
      let pageJSX;
      const nextBtn = (
        <button
          className="btn btn-primary"
          type="submit"
          onClick={this.loadNextPage}
        >
          next
        </button>
      );
      const prevBtn = (
        <button
          className="btn btn-primary"
          type="submit"
          onClick={this.state.loadPrevPage}
        >
          prev
        </button>
      );

      if (this.state.after === null && this.state.before !== null) {
        pageJSX = <div>{prevBtn}</div>;
      } else if (this.state.after !== null && this.state.before === null) {
        pageJSX = <div>{nextBtn}</div>;
      } else if (this.state.after !== null && this.state.before !== null) {
        pageJSX = (
          <div>
            {prevBtn}
            <span className="p-3 text-black-50">Page {this.state.page}</span>
            {nextBtn}
          </div>
        );
      } else {
        pageJSX = <div>No Posts Found.</div>;
      }
      contentJSX = (
        <div className="m-2">
          <Wallpapers files={this.state.files} />
          <br />
          <div className="center-block m-2">{pageJSX}</div>
        </div>
      );
    } else {
      contentJSX = <div className="p-2">Loading...</div>;
    }

    let currentSubreddit = "r/" + this.state.subReddit;

    return (
      <div className="container">
        <br />
        <div>
          <div className="dropdown m-2" style={{ display: "inline" }}>
            <button
              className="btn btn-outline-success dropdown-toggle"
              type="button"
              id="dropdownMenuButton"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              {currentSubreddit} &nbsp;
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <a
                className="dropdown-item"
                href="#subChange"
                onClick={() => this.updatePage(this.wallpaperSubreddits)}
              >
                Landscape Wallpapers
              </a>
              <a
                className="dropdown-item"
                href="#subChange"
                onClick={() => this.updatePage(this.portraitSubreddits)}
              >
                Portrait Wallpapers
              </a>
              <a
                className="dropdown-item"
                href="#subChange"
                onClick={() => this.updatePage(this.memesSubreddits)}
              >
                Memes Subreddits
              </a>
              {this.subredditsArray.map((subreddit, index) => (
                <a
                  className="dropdown-item"
                  key={index}
                  href="#subChange"
                  onClick={() => this.updatePage(subreddit)}
                >
                  r/{subreddit}
                </a>
              ))}
            </div>
          </div>
          <div className="m-3" />
          <SearchBar onSearchTermChange={term => searchSubreddit(term)} />
        </div>
        <br />
        {contentJSX}
        <br />
      </div>
    );
  }
}

export default App;
