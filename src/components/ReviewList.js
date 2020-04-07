import React from "react";
import Review from "./Review";

export default function ReviewList(props) {
  return (
    <div className="reviewList">
      <h5 className="text-muted mb-4">
        <span className="badge badge-success">{props.reviews.length}</span>{" "}
        Review{props.reviews.length > 0 ? "s" : ""}
      </h5>

      {props.reviews.length === 0 && !props.loading ? (
        <div className="alert text-center alert-info">
          Be the first to review
        </div>
      ) : null}

      {props.reviews.map((review, index) => (
        <Review key={index} review={review} />
      ))}
    </div>
  );
}
