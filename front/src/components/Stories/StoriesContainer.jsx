import React, { useState, useEffect, useRef } from "react";
import Story from "./Content/Story/Story";
import { View } from "react-native";
import HeaderContainer from "./Content/Header/HeaderContainer";
import { connect, useDispatch } from "react-redux";
import { currentStoryIndex } from "../../../redux/actions/feeds";
import { showStoriesHeader } from "../../../redux/actions/stories";
import { setPlay } from "../../../redux/actions/play";
import {setPendingStories} from "../../../redux/actions/stories"


const StoriesContainer = ({
  handleClose,
  feed,
  handleFeedChange,
  play,
  setPlay,
  showStoriesHeader,
  setPendingStories,
  pendingStories
}) => {
  const { stories, name } = feed;
  const [storyIndex, setStoryIndex] = useState(0);
  const [wasPlayed, setWasPlayed] = useState(false);

  const handleStoryChange = (moveStory) => {
    let newIndex = storyIndex + moveStory;
    changeStatus(newIndex);
    if (newIndex >= 0 && newIndex < stories.length) {
      setPendingStories(feed.id, newIndex)
      setStoryIndex(newIndex);
    } else {
      setStoryIndex(0);
      setPendingStories(feed.id, 0)
      handleFeedChange(moveStory);
    }
  };

  const handleLongPress = () => {
    showStoriesHeader(false);
    if (play) {
      setWasPlayed(true);
      setPlay(!play);
    }
  };

  const handlePressOut = () => {
    showStoriesHeader(true);
    if (wasPlayed) {
      setWasPlayed(false);
      setPlay(!play);
    }
  };

  const changeStatus = (index) => {
    if (stories[index] && stories[index].status == "not_seen") {
      stories[index].status = "seen";
    }
  };

  useInterval(
    () => {
      handleStoryChange(1);
    },
    3000,
    play
  );

  useEffect(() => {
    let storyIndex = (typeof pendingStories[feed.id] === "number")? pendingStories[feed.id] : searchFirstStoryPending(stories)
    changeStatus(storyIndex);
    setStoryIndex(storyIndex);
    return;
  }, [feed]);

  return (
    <View flex={1}>
      <HeaderContainer
        style={{ position: "absolute" }}
        handleClose={handleClose}
        name={name}
        stories={stories}
        index={storyIndex}
      />
      <Story
        story={stories[storyIndex]}
        handleStoryChange={handleStoryChange}
        handleLongPress={handleLongPress}
        handlePressOut={handlePressOut}
        handleClose={handleClose}
        handleFeedChange={handleFeedChange}
      />
    </View>
  );
};

const searchFirstStoryPending = (stories) => {
  let inx = stories.findIndex((story) => story.status == "not_seen");
  return inx !== -1 ? inx : 0;
};

const mapStateToProps = (state) => {
  return {
    play: state.play.value,
    showHeader: state.stories.showHeader,
    pendingStories: state.stories.pendingStories
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    showStoriesHeader: (value) => dispatch(showStoriesHeader(value)),
    setPlay: (value) => dispatch(setPlay(value)),
    setPendingStories: (feedId, storyIndex) => dispatch(setPendingStories(feedId, storyIndex))
  };
};

function useInterval(callback, delay, isActive) {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    let interval = null;
    if (isActive) {
      interval = setInterval(tick, delay);
    } else if (!isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, delay]);
}



export default connect(mapStateToProps, mapDispatchToProps)(StoriesContainer);
