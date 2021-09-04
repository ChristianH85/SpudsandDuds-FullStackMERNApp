import React, { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import { useMutation } from "@apollo/client";
import { REMOVE_REVIEW } from "../../utils/mutations";
import { EDIT_REVIEW } from "../../utils/mutations";

import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_USER, QUERY_ME } from '../../utils/queries';


const ReviewList = ({
  reviews,
  title,
  showTitle = true,
  showUsername = true,
}) => {

  const { username: userParam } = useParams();

  // If there is no `username` in the URL as a parameter, execute the `QUERY_ME` query instead for the logged in user's information
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};

  console.log(user.username);

  const [post, setPost] = useState("");
  useEffect(() => {
    setPost(reviews);
  }, [reviews]);

  const [removeReview, { error }] = useMutation(REMOVE_REVIEW);

  const removeReviewHandler = async (event, _id) => {
    event.preventDefault();

    try {
      const { data } = await removeReview({
        variables: {
          reviewId: _id,
        },
      });
      console.log(data);
      const newReviews = await post.filter(
        (r) => r._id !== data.removeReview._id
      );

      setPost(newReviews);
    } catch (err) {
      console.error(err);
    }
  };

  const [editReview, { err }] = useMutation(EDIT_REVIEW);

  const handleEdit = async (_id, textContent) => {

    try {
      const { data } = await editReview({
        variables: {
          reviewId: _id,
          reviewText: textContent
        },
      });

      setEditMode(false);
    } catch (err) {
      console.error(err);
    }
  };

  const [editMode, setEditMode] = useState(false);
  console.log(editMode);

  if (!reviews.length) {
    return <h3>No Reviews Yet</h3>;
  }

  return (
    <div>
      {showTitle && <h3>{title}</h3>}
      {reviews &&
        reviews.map((review) => (
          <div key={review._id} className="card mb-3">
            <h4 className="card-header bg-primary text-light p-2 m-0">
              {showUsername ? (
                <Link
                  className="text-light"
                  to={`/profiles/${review.reviewAuthor}`}
                >
                  {review.reviewAuthor} <br />
                  <span style={{ fontSize: '1rem' }}>
                    posted this review on {review.createdAt}
                  </span>
                </Link>
              ) : (
                <>
                  <span style={{ fontSize: '1rem' }}>
                    You had this review on {review.createdAt}
                  </span>
                </>
              )}
            </h4>
          <div>
            {review.reviewAuthor === user.username && editMode ? (
                    <div className="card-body bg-light p-2">
                      <p contentEditable="true" suppressContentEditableWarning={true} onBlur={e => handleEdit(review._id, e.currentTarget.textContent)}>{review.reviewText}</p>
                    </div>
                  ) : (
                    <div className="card-body bg-light p-2">
                      <p>{review.reviewText}</p>
                  </div> 
                  )}
            </div>
                  <div>
                    {review.reviewAuthor === user.username ? (
                      <div>
                      <button onClick={() => setEditMode(true)} type="button" className="btn btn-default edit-review">
                    Edit
                  </button>
                  <button
                    onClick={(event) => {
                      removeReviewHandler(event, review._id);
                    }}
                    className="btn btn-default delete-review"
                  >
                    Delete
                  </button>
                  </div>
                    ) : (
                      null
                    )}  
                  </div>
            <Link
              className="btn btn-primary btn-block btn-squared"
              to={`/reviews/${review._id}`}
            >
              Join the discussion on this review.
            </Link>
          </div>
        ))}
    </div>
  );
};

export default ReviewList;
