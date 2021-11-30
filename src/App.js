import { useEffect, useState } from "react";
import './App.css';
import LoadingPageContainer from "./components/LoadingPageContainer";
import PageNotFound from './components/notfound/PageNotFound';
import Topic from './components/topic/Topic';
import { mapRootTopic } from "./utils/rootTopic";

function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [isValidPath, setValidPath] = useState(true);
  const [isReady, setReady] = useState(false);

  const setInvalidPathReady = () => {
    setValidPath(false);
    setReady(true)
  }

  const setValidPathReady = () => {
    setValidPath(true);
    setReady(true);
  }

  useEffect(() => {
    if (path.endsWith('/')) {
      setPath(path.slice(0, -1));
      return;
    }
    const [slug] = path.split('/').slice(-1);
    const params = new URLSearchParams(window.location.search);
    const topic = params.get('topic');
    if (process.env.NODE_ENV !== "production") {
      if (!!slug) {
        // NOT FOUND
        setInvalidPathReady();
        return;
      }
    } else {
      if (slug !== (process.env.REACT_APP_ROOT_SLUG || "practice-list")) { // practice-list
        // NOT FOUND
        setInvalidPathReady();
        return;
      }
    }
    // Check Params
    if (!topic || !Object.keys(mapRootTopic).includes(topic)) {
      setInvalidPathReady();
      return;
    }
    setValidPathReady();
  }, [path]);

  const renderView = () => {
    if (isValidPath) return <Topic />
    return <PageNotFound />
  }

  return (
    <LoadingPageContainer loading={!isReady}>
      {renderView()}
    </LoadingPageContainer>
  )
}

export default App;