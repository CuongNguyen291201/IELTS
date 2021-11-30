import React, { useState, useEffect } from 'react'
import { Grid, Button, Box, Link } from '@mui/material';
import { styled } from "@mui/material/styles";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getTopic } from '../../api/getTopic';
import { mapPracticeChild } from '../../utils/rootTopic';
import './style.scss';
import { EXAM_TYPE_IELTS, EXAM_TYPE_TOEIC, TOPIC_TYPE_LESSON, TOPIC_TYPE_TEST } from "../../utils/contraint";
import CheckedIcon from "../../assets/images/check-outlined.svg";

const Pratice = () => {
  const [topicSection, setTopicSection] = useState([]);
  const [topicTest, setTopicTest] = useState();
  const [sectionCurrent, setSectionCurrent] = useState();
  const [pagination, setPagination] = useState(false);

  const activeTopic = new URLSearchParams(window.location.search);
  const topic = activeTopic.get('topic');
  const activeTp = !activeTopic.get('section') ? 0 : activeTopic.get('section');
  mapPracticeChild[topic] = 'active';
  const learningUrl = process.env.REACT_APP_LEARNING_URL || 'https://ielts-testpro.com/learning';
  const appName = process.env.REACT_APP_APP_NAME || 'IELTS';

  useEffect(() => {
    const localUserId = localStorage.getItem("_static_uid");
    getTopic(topic, 0, localUserId || undefined)
      .then((section) => {
        setTopicSection(section);
        setSectionCurrent(section[activeTp]);

        getTopic(section[activeTp]?.topicExerciseId, 0, localUserId || undefined)
          .then((test) => {
            if (test.length < 10) setPagination(true);
            setTopicTest(test);
          })
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getTest = () => {
    const localUserId = localStorage.getItem("_static_uid");
    getTopic(sectionCurrent?.topicExerciseId, topicTest.length, localUserId || undefined)
      .then((test) => {
        if (test) {
          if (test.length < 10) setPagination(true);
          setTopicTest([...topicTest, ...test]);
        }
      })
  }

  const ReviewButton = styled(Button)({
    borderRadius: "5px",
    border: "0.5px solid #B6B6B6",
    color: "#797979",
    fontWeight: 600,
    '&:hover': {
      border: "0.5px solid #B6B6B6"
    }
  })

  return (
    <div className="practice">
      <div className="container">
        <h1 className="title-practice">
          {appName} {topic}
        </h1>
        <div className="btn-download">
          <Button className="google-play">
            <a href="https://play.google.com/store/apps/details?id=com.estudyme.ielts"><img src="https://ielts-testpro.com/wp-content/uploads/2021/09/Frame.png" alt="" /> <span>Google Play</span></a>
          </Button>
          <Button className="app-store">
            <a href="https://apps.apple.com/us/app/ielts-test-pro-2019/id1073549959"><img src="https://ielts-testpro.com/wp-content/uploads/2021/09/Vector.png" alt="" /> <span>App Store</span></a>
          </Button>
        </div>

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <div className="section-mb">
              <div className="section-parent">
                <div className="topic">IELTS {topic}</div>
              </div>
              <div className="list-section">
                {
                  topicSection && topicSection.map((item, index) => (
                    <div className={+activeTp === +index ? 'section-child section-active' : 'section-child'} key={item.topicExerciseId}>
                      <div className="section-item"><a href={`?topic=` + topic + `&section=` + index}>{item.name}</a></div>
                    </div>
                  ))
                }
              </div>
            </div>
          </Grid>
          <Grid item lg={9} md={9} sm={9} xs={12}>
            <div className="list-test">
              <div className="section-current">{sectionCurrent?.name}</div>
              <div className="test-detail">
                {
                  topicTest && topicTest.map((item) => {
                    const isPlayed = typeof item?.score !== 'undefined' && item?.type !== TOPIC_TYPE_LESSON;
                    const progressText = item?.type === TOPIC_TYPE_LESSON
                      ? ''
                      : (item?.type === TOPIC_TYPE_TEST
                        ? `${typeof item?.score !== 'undefined' ? `${item.score} pts.` : ''}`
                        : `${item.topicProgress ? item.topicProgress.progress + '%' : '0%'}`
                      )
                    return (
                      <div className="test-item" key={item.topicExerciseId}>
                        <Link href={`${learningUrl}?id=${item._id}`} underline="none" flex={1}>
                          <Box display="flex" alignItems="center">
                            {isPlayed ? <img src={CheckedIcon} alt="check-icon" className="done-topic-icon" /> : <FiberManualRecordIcon className="dot" />}
                            <div className="name">{item.name}</div>
                          </Box>
                        </Link>
                        <Box display="flex" alignItems="center" gap="8px">
                          {isPlayed && <ReviewButton onClick={() => {
                            window.location.href = `${learningUrl}?id=${item._id}&review`;
                          }} variant="outlined">Review</ReviewButton>}
                          {!!progressText && <div className="test-progress">{progressText}</div>}
                        </Box>
                      </div>
                    )
                  })
                }
              </div>
              <div className={pagination ? 'non-active' : 'show-more'}>
                <Button className="btn-show-more" onClick={() => getTest()} endIcon={<KeyboardArrowDownIcon />}>
                  Load More
                </Button>
              </div>
            </div>
          </Grid>
          <Grid item lg={3} md={3} sm={3} xs={12}>
            <div className="section">
              <div className="section-parent">
                <div className="topic">{appName} {topic}</div>
              </div>
              <div className="list-section">
                {
                  topicSection && topicSection.map((item, index) => (
                    <div className={+activeTp === +index ? 'section-child section-active' : 'section-child'} key={item.topicExerciseId}>
                      <div className="section-item"><a href={`?topic=` + topic + `&section=` + index}>{item.name}</a></div>
                    </div>
                  ))
                }
              </div>
            </div>
            <div className="other-practice">
              <div className="title">
                Other Pratice
              </div>
              <div className="practice-child">
                <div className={`practice-item vocabulary ` + mapPracticeChild['vocabulary']}>
                  <div className="name">VOCABULARY</div>
                  <div className="btn-join"><a href="?topic=vocabulary">Join</a></div>
                </div>
                <div className={`practice-item writing ` + mapPracticeChild['writing']}>
                  <div className="name">WRITING</div>
                  <div className="btn-join"><a href="?topic=writing">Join</a></div>
                </div>
                <div className={`practice-item speaking ` + mapPracticeChild['speaking']}>
                  <div className="name">SPEAKING</div>
                  <div className="btn-join"><a href="?topic=speaking">Join</a></div>
                </div>
                <div className={`practice-item grammar ` + mapPracticeChild['grammar']}>
                  <div className="name">GRAMMAR</div>
                  <div className="btn-join"><a href="?topic=grammar">Join</a></div>
                </div>
                <div className={`practice-item reading ` + mapPracticeChild['reading']}>
                  <div className="name">READING</div>
                  <div className="btn-join"><a href="?topic=reading">Join</a></div>
                </div>
                <div className={`practice-item listening ` + mapPracticeChild['listening']}>
                  <div className="name">LISTENING</div>
                  <div className="btn-join"><a href="?topic=listening">Join</a></div>
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </div >
  )
}

export default Pratice