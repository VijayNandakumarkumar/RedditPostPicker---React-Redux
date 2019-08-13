import React from "react";

const WallpaperItem = ({ file }) => {
  if (file.data.preview) {
    if (file.data.preview.enabled) {
      let previewImage =
        file.data.preview.images[0].resolutions[
          file.data.preview.images[0].resolutions.length - 1
        ].url;
      previewImage = previewImage.replace(/&amp;/g, "&");
      let subreddit = "https://reddit.com/r/" + file.data.subreddit;
      let post_link = "https://reddit.com" + file.data.permalink;
      return (
        <div className="col-sm-12 col-md-6 col-lg-4">
          <div className=" card-link">
            <div className="card shadow">
              <div className="card-img-top">
                <a href={post_link} target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-secondary btn-sm top-right-float">
                    View Post
                  </button>
                </a>
                <a
                  href={file.data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="inner">
                    <img
                      src={previewImage}
                      className="card-img-top"
                      width="100%"
                      alt={file.data.title}
                    />
                  </div>
                </a>
              </div>
              <div className="card-body">
                <a className="activator mr-4">
                  <i className="fa fa-share-alt" style={{ float: "left" }} />
                </a>
                <div className="card-title">
                  <a
                    href={file.data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.data.title}
                  </a>
                </div>
                <p className="card-text">
                  <i className="fa fa-arrow-up" aria-hidden="true" />{" "}
                  {file.data.ups}
                  <i
                    className="fa fa-comments"
                    aria-hidden="true"
                    style={{ marginLeft: "10px" }}
                  />{" "}
                  {file.data.num_comments}
                  <br /> Posted on:
                  <a href={subreddit} target="_blank" rel="noopener noreferrer">
                    r / {file.data.subreddit}
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  return <div> </div>;
};

export default WallpaperItem;
