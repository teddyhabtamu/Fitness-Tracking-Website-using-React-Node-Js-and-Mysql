import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  justify-content: center;
  padding: 22px 0px;
  overflow-y: scroll;
`;

const Wrapper = styled.div`
  flex: 1;
  max-width: 1400px;
  display: flex;
  flex-direction: column;
  gap: 22px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const Title = styled.div`
  padding: 0px 16px;
  font-size: 22px;
  color: ${({ theme }) => theme.text_primary};
  font-weight: 500;
`;

const VideoGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 22px;
  padding: 0px 16px;
  @media (max-width: 600px) {
    gap: 12px;
  }
`;

const VideoCard = styled.div`
  width: 80%;
  max-width: 300px;
  background-color: ${({ theme }) => theme.card_background};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const VideoTitle = styled.div`
  padding: 16px;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
`;

const VideoPlayerContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const VideoPlayer = styled.div`
  width: 90%;
  max-width: 800px;
  aspect-ratio: 16 / 9;
  background-color: black;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 8px;
  font-size: 16px;
  color: white;
  background-color: red;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const TutorialTitle = styled.div`
  font-weight: 600;
  font-size: 18px;
  color: ${({ theme }) => theme.primary};
  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

const Tutorials = () => {
  const [tutorials, setTutorials] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/tutorials")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setTutorials(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, []);

  const handleVideoClick = (videoUrl) => {
    setSelectedVideo(videoUrl);
  };

  const closeVideoPlayer = () => {
    setSelectedVideo(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Container>
      <Wrapper>
        <Title>Workout Tutorials</Title>
        <VideoGrid>
          {tutorials.map((tutorial) => (
            <VideoCard
              key={tutorial.tutorial_id}
              onClick={() => handleVideoClick(tutorial.videourl)}
            >
              <Thumbnail src={tutorial.thumbnail} alt={tutorial.title} />
              <VideoTitle>
                <TutorialTitle>{tutorial.title}</TutorialTitle>
              </VideoTitle>
            </VideoCard>
          ))}
        </VideoGrid>
        {selectedVideo && (
          <VideoPlayerContainer>
            <VideoPlayer>
              <iframe
                width="100%"
                height="100%"
                src={selectedVideo}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Tutorial Video"
              ></iframe>
            </VideoPlayer>
            <CloseButton onClick={closeVideoPlayer}>Close</CloseButton>
          </VideoPlayerContainer>
        )}
      </Wrapper>
    </Container>
  );
};

export default Tutorials;
