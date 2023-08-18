import React, { useEffect } from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_URLS = gql`
  query {
    urls {
      id
      originalUrl
      shortCode
    }
  }
`;

const Redirect = () => {
  const { paramValue } = useParams();
  const { data } = useQuery(GET_URLS);
  const Navigate=useNavigate()

  useEffect(() => {
    if (data && data.urls) {
      const urlObject = data.urls.find(url => url.shortCode === paramValue);
      if(!urlObject){
       Navigate("/")
       return
      }
      if (urlObject) {
        window.location.href = urlObject.originalUrl;
      }
    }
  }, [data, paramValue]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
}

export default Redirect;
