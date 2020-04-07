import React, { Component } from "react";

export default class ReviewForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      error: "",

      review: {
        name: "",
        message: ""
      }
    };

    // bind context to methods
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  /**
   * Handle form input field changes & update the state
   */
  handleFieldChange = event => {
    const { value, name } = event.target;

    this.setState({
      ...this.state,
      review: {
        ...this.state.review,
        [name]: value
      }
    });
  };

  /**
   * Form submit handler
   */
  onSubmit(e) {
    e.preventDefault();

    if (!this.isFormValid()) {
      this.setState({ error: "All fields are required." });
      return;
    }

    // loading status and clear error
    this.setState({ error: "", loading: true });

    // persist the reviews on server
    let { review } = this.state;
    fetch("https://BookReviewAPI.azurewebsites.net", {
      method: "post",
      body: JSON.stringify(review)
    })
      .then(res => res.json())
      .then(res => {
        if (res.error) {
          this.setState({ loading: false, error: res.error });
        } else {
          // add time return and push review to parent state
          review.time = res.time;
          this.props.addReview(review);

          // clear the message box
          this.setState({
            loading: false,
            review: { ...review, message: "" }
          });
        }
      })
      .catch(err => {
        this.setState({
          error: "Error while submitting this form.",
          loading: false
        });
      });
  }

  /**
   * Simple validation
   */
  isFormValid() {
    return this.state.review.name !== "" && this.state.review.message !== "";
  }

  renderError() {
    return this.state.error ? (
      <div className="alert alert-danger">{this.state.error}</div>
    ) : null;
  }

  render() {
    return (
      <React.Fragment>
        <form method="post" onSubmit={this.onSubmit}>
          <div className="form-group">
            <input
              onChange={this.handleFieldChange}
              value={this.state.review.name}
              className="form-control"
              placeholder="Your Name 😎 "
              name="name"
              type="text"
            />
          </div>

          <div className="form-group">
            <textarea
              onChange={this.handleFieldChange}
              value={this.state.review.message}
              className="form-control"
              placeholder="Your Review 🤬 "
              name="message"
              rows="5"
            />
          </div>

          {this.renderError()}

          <div className="form-group">
            <button disabled={this.state.loading} className="btn btn-primary">
              Review &#10148;
            </button>
          </div>
        </form>
      </React.Fragment>
    );
  }
}
