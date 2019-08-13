import React, { Component } from "react";
import "../App.css";
import Wallpapers from "./wallpaper";
import _ from "lodash";
import SearchBar from "./search_bar";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import {
  loadPage,
  loadPageWithAfterBefore,
  setFilesEmpty
} from "../actions/index";
import InitialState from "../reducers/reducers_initial_state";

class App extends Component {
  constructor(props) {
    super(props);
    this.url = "https://www.reddit.com/r/";
    this.wallpaperSubreddits = "wallpapers";
    this.catsSubreddits = "cats";

    this.subredditsArray = [
      "images",
      "photoshopbattles",
      "hmmm",
      "all",
      "aww",
      "alternative",
      "pics",
      "gifs",
      "adviceanimals",
      "cats"
    ];
    this.portraitSubreddits =
      "mobilewallpapers+amoledbackgrounds+verticalwallpapers";
    this.memesSubreddits = "memes+dankmemes+memeeconomy+animemes";
  }

  componentDidMount() {
    if (this.props.reduced_state === null) {
      this.updatePage(this.props.state.subReddit);
    } else {
      this.updatePage(this.props.reduced_state.subReddit);
    }
  }

  updatePage(sub) {
    // Resetting the State

    const new_state = {
      files: [],
      subReddit: sub,
      page: 1
    };

    this.props.loadPage(new_state);

    if (!this.props.reduced_state) {
      fetch(
        this.url + sub + ".json?limit=100&count=" + this.props.state.page * 100
      )
        .then(response => response.json())
        .then(data => {
          this.props.loadPageWithAfterBefore({
            files: data.data.children,
            after: data.data.after, //to get the next set of post
            before: data.data.before, //to load previous post if any
            page: this.props.state.page
          });
          window.scrollTo(0, 0);
        })
        .catch(console.log);
    } else {
      fetch(
        this.url +
          sub +
          ".json?limit=100&count=" +
          this.props.reduced_state.page * 100
      )
        .then(response => response.json())
        .then(data => {
          this.props.loadPageWithAfterBefore({
            files: data.data.children,
            after: data.data.after, //to get the next set of post
            before: data.data.before, //to load previous post if any
            page: this.props.reduced_state.page
          });
          window.scrollTo(0, 0);
        })
        .catch(console.log);
    }
  }

  loadNextPage = () => {
    let new_state;
    new_state = {
      files: []
    };

    this.props.setFilesEmpty(new_state);

    fetch(
      this.url +
        this.props.reduced_state.subReddit +
        ".json?limit=100" +
        "&after=" +
        this.props.reduced_state.after +
        "&count=" +
        this.props.reduced_state.page * 100
    )
      .then(response => response.json())
      .then(data => {
        this.props.loadPageWithAfterBefore({
          files: data.data.children,
          after: data.data.after,
          before: data.data.before,
          page: this.props.reduced_state.page + 1
        });
        window.scrollTo(0, 0);
        console.log("Reduced state", this.props.reduced_state);
      })
      .catch(console.log);
  };

  loadPrevPage = () => {
    let new_state;
    new_state = {
      files: []
    };

    this.props.setFilesEmpty(new_state);

    fetch(
      this.url +
        this.props.reduced_state.subReddit +
        ".json?limit=100" +
        "&before=" +
        this.props.reduced_state.subReddit +
        "&count=" +
        ((this.props.reduced_state.page - 1) * 100 - 1)
    )
      .then(response => response.json())
      .then(data => {
        new_state = {
          files: data.data.children,
          after: data.data.after,
          before: data.data.before
        };
        if (this.props.reduced_state.page > 1)
          new_state.page = this.props.reduced_state.page - 1;
        this.props.loadPageWithAfterBefore(new_state);
      })
      .catch(console.log);
  };

  searchSubreddit(subreddit) {
    if (subreddit.length !== 0) {
      this.updatePage(subreddit);
    } else {
      this.updatePage(this.props.reduced_state.subReddit);
    }
  }

  render() {
    const searchSubreddit = _.debounce(term => {
      this.searchSubreddit(term);
    }, 600);
    let contentJSX;

    if (
      this.props.reduced_state === null ||
      this.props.reduced_state.files.length === 0
    ) {
      contentJSX = (
        <div
          className="p-2"
          style={{ textAlign: "center", margin: "20% auto 50%" }}
        >
          <h1>Loading...</h1>
        </div>
      );
    } else {
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
          onClick={this.loadPrevPage}
        >
          prev
        </button>
      );
      if (
        this.props.reduced_state.after === null &&
        this.props.reduced_state.before !== null
      ) {
        pageJSX = <div>{prevBtn}</div>;
      } else if (
        this.props.reduced_state.after !== null &&
        this.props.reduced_state.before === null
      ) {
        pageJSX = <div>{nextBtn}</div>;
      } else if (
        this.props.reduced_state.after !== null &&
        this.props.reduced_state.before !== null
      ) {
        pageJSX = (
          <div>
            {prevBtn}
            <span className="p-3 text-black-50">
              Page {this.props.reduced_state.page}
            </span>
            {nextBtn}
          </div>
        );
      } else {
        pageJSX = <div>No Posts Found.</div>;
      }
      contentJSX = (
        <div className="m-2">
          <Wallpapers files={this.props.reduced_state.files} />
          <br />
          <div className="center-block m-2">{pageJSX}</div>;
        </div>
      );
    }
    let currentSubreddit;

    if (this.props.reduced_state !== null) {
      currentSubreddit = "r/" + this.props.reduced_state.subReddit;
    } else {
      currentSubreddit = "r/aww";
    }

    return (
      <div className="container">
        <br />
        <div>
          <div
            className="dropdown m-2"
            style={{ display: "inline", width: "20%" }}
          >
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
          <SearchBar onSearchTermChange={term => searchSubreddit(term)} />
        </div>
        <br />
        <hr />
        {contentJSX}
        <br />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { state: state.initial_state, reduced_state: state.reduced_state };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      loadPage: loadPage,
      loadPageWithAfterBefore: loadPageWithAfterBefore,
      setFilesEmpty: setFilesEmpty
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
