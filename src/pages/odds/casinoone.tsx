import React from "react";
import { useParams } from "react-router-dom";

const Casinoone = () => {
  const { id } = useParams<{ id: string }>();

  const tvUrl = "https://tv.777exch.live/";

  return (
    <iframe
      style={{
        width: "100%",
        height: "100%",
        border: "none",
      }}
      src={`${tvUrl}${id}`}
      title="Live TV"
      allowFullScreen
    />
  );
};

export default Casinoone;