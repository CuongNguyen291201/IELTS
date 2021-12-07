import axios from "axios";
import { mapRootTopic } from '../utils/rootTopic';

export const getTopic = async (topic, skip=0, userId) => {
    const sectionTest = await axios.post("https://api-estudyme.koolsoft.ga/api/offset-topics-by-parent-id", {
        "courseId": "6112209e1e6e0c7cbe105841",
        "parentId": topic in mapRootTopic ? mapRootTopic[topic] : topic,
        userId,
        "field": "orderIndex",
        "skip": skip,
        "limit": 50
    });
    return sectionTest.data.data;
}