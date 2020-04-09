import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";

class BookReview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: "",
      title: "",
      reviews: [],
      loading: false
    };

    this.addReview = this.addReview.bind(this);
  }

  async componentDidMount() {
    // loading
    this.setState({
      loading: true,
      id: this.props.match.params.id,
      title: this.props.location.state.title
    });
    // get all the reviews
    await fetch("https://bookreviewapi.azurewebsites.net/api/review/" + this.props.match.params.id, {
      method: "GET",  
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          reviews: res,
          loading: false
        });
      })
      .catch(err => {
        this.setState({ loading: false });
      });
  }

  /**
   * Add new review
   * @param {Object} review
   */
  addReview(review) {
    this.setState({
      loading: false,
      reviews: [review, ...this.state.reviews],
    });
  }

  render() {
    return (
      <div className="App container bg-light shadow">
        <header className="App-header">
          <h1 className="App-title">
            <span className="px-2" role="img" aria-label="Chat">💬</span>
            {this.state.title}
          </h1>
          <p>
          </p>
        </header>

        <div className="row">
          <div className="col-4  pt-3 border-right">
            <h6>Say something about the Book!</h6>
            <ReviewForm id={this.state.id} addReview={this.addReview} />
          </div>
          <div className="col-8  pt-3 bg-white">
            <ReviewList
              loading={this.state.loading}
              reviews={this.state.reviews}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BookReview;
