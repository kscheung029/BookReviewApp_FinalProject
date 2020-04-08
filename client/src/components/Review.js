import React from "react";

export default function Review(props) {
  const { userId, review, reviewedOn } = props.review;

  return (
    <div className="media mb-3">
      <div className="media-body p-2 shadow-sm rounded bg-light border">
        <small className="float-right text-muted">{reviewedOn}</small>
        <h6 className="mt-0 mb-1 text-muted">{userId}</h6>
        {review}
      </div>
    </div>
  );
}
