import React from "react";
import { Redirect, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";

import UserReviewList from "../components/UserReviewList";
import { QUERY_USER, QUERY_ME } from "../utils/queries";

import Auth from "../utils/auth";

const Profile = () => {
  const { username: userParam } = useParams();

  // If there is no `username` in the URL as a parameter, execute the `QUERY_ME` query instead for the logged in user's information
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { username: userParam },
  });

  const user = data?.me || data?.user || {};

  console.log(user.username);
  console.log(user.reviews);

  // redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/me" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5 mx-auto card">
          Viewing {userParam ? `${user.username}'s` : "your"} profile.
        </h2>

        <div className="col-12 col-md-10 mb-5">
          <UserReviewList
            reviews={user.reviews}
            title={`${user.username}'s reviews...`}
            showTitle={false}
            showUsername={false}
          />
        </div>
        {!userParam && (
          <div
            className="col-12 col-md-10 mb-3 p-3"
            style={{ border: "1px dotted #1a1a1a" }}
          >
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
