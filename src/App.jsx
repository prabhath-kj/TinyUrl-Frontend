import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import gql from "graphql-tag";

const CREATE_URL = gql`
  mutation Mutation($originalUrl: String!) {
    createUrl(originalUrl: $originalUrl) {
      originalUrl
      shortCode
      error
    }
  }
`;

const GET_URLS = gql`
  query {
    urls {
      id
      originalUrl
      shortCode
    }
  }
`;

function isValidURL(url) {
  // Regular expression for URL validation
  const urlPattern = /^(http|https):\/\/[^ "]+$/;
  return urlPattern.test(url);
}

function App() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [createUrl] = useMutation(CREATE_URL);
  const { loading, error } = useQuery(GET_URLS);
  const [values, setData] = useState({});
  const [copyButtonText, setCopyButtonText] = useState("Copy");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidURL(originalUrl)) {
      setData({
        error: "Invalid URL format",
        originalUrl: null,
        shortCode: null,
      });
      return;
    }

    const { data } = await createUrl({ variables: { originalUrl } });
    setData(data.createUrl);
    setOriginalUrl("");
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyButtonText("Copied");
      setTimeout(() => {
        setCopyButtonText("Copy");
      }, 1500); // Reset the button text after 1.5 seconds
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <div className="mx-auto max-w-lg p-4 bg-white rounded-md shadow-md">
        <h1 className="text-2xl font-semibold text-center mb-4">Tiny URL Shortener</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <input
            type="text"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="Enter URL to shorten"
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300"
          >
            Shorten URL
          </button>
        </form>
        {values.error && (
          <p className="text-red-500 mt-2">{values.error}</p>
        )}
        {values.originalUrl && (
          <div className="flex flex-col gap-3 mt-5">
            <h2 className="text-lg font-semibold">Shortened URLs</h2>
            <ul className="flex flex-col gap-2">
              <li
                className="bg-gray-100 p-4 rounded-md flex flex-col gap-2"
              >
                <p>
                  <span className="text-green-400 font-semibold">
                    Original URL:
                  </span>{" "}
                  <span className="break-words">
                    {values.originalUrl}
                  </span>
                </p>
                <p>
                  <span className="text-green-400 font-semibold">
                    Short Code:
                  </span>{" "}
                  <span>
                    {`${window.location.href}${values.shortCode}`}
                    <button
                      onClick={() =>
                        handleCopy(
                          `${window.location.href}${values.shortCode}`
                        )
                      }
                      className="p-1 mx-2  hover:bg-gray-200 border  bg-opacity-60 text-sm rounded-md mt-1"
                    >
                      {copyButtonText}
                    </button>
                  </span>
                </p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
