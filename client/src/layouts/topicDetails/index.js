// src/layouts/topic-detail/index.jsx
import { Box, Container, List, ListItem, ListItemText, Typography } from '@mui/material';
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import DashboardNavbar from 'examples/Navbars/DashboardNavbar';
import LoadingScreen from 'examples/loader';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function TopicDetail() {
    const { topicName, totalQuestions, problemsSolved } = useParams();
    const [topicInfo, setTopicInfo] = useState(null);
    const [points, setPoints] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [firstTwoPoints, setFirstTwoPoints] = useState([]);
    const [remainingPoints, setRemainingPoints] = useState([]);

    const apiKey = process.env.GOOGLE_API_KEY;

    const fetchTopicInfo = async () => {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        const headers = { 
            'Content-Type': 'application/json'
        };

        const sampleResponse = `pointcheaa: A Queue is a data structure that follows the First-In, First-Out (FIFO) principle. Elements are added to the rear (enqueue) and removed from the front (dequeue). 
        pointcheaa: You've completed 15 out of 46 questions in the Queue topic, showing a good understanding of basic concepts. You could benefit from exploring more complex problems involving multiple queues or advanced applications like priority queues.
        pointcheaa: questions
        questioncheaa: Implement Queue using Stacks (https://leetcode.com/problems/implement-queue-using-stacks/)
        questioncheaa: Design Circular Queue (https://leetcode.com/problems/design-circular-queue/)
        questioncheaa: Moving Average from Data Stream (https://leetcode.com/problems/moving-average-from-data-stream/)
        questioncheaa: Find the Town Judge (https://leetcode.com/problems/find-the-town-judge/)
        questioncheaa: Task Scheduler (https://leetcode.com/problems/task-scheduler/)
        questioncheaa: Sliding Window Maximum (https://leetcode.com/problems/sliding-window-maximum/)
        questioncheaa: Shortest Subarray with Sum at Least K (https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/)
        questioncheaa: Number of Subarrays with Bounded Maximum (https://leetcode.com/problems/number-of-subarrays-with-bounded-maximum/)
        questioncheaa: Maximum Size Subarray Sum Equals k (https://leetcode.com/problems/maximum-size-subarray-sum-equals-k/)
        questioncheaa:  Largest Rectangle in Histogram (https://leetcode.com/problems/largest-rectangle-in-histogram/) `

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: `I am preparing for an interview and using LeetCode to do so. I will give you three things: one is the topic name, the number of questions I have done in that topic, and the total number of questions. pointcheaa: You have to introduce that topic by briefly defining it.pointcheaa: then write some words and explain my progress in that topic. pointcheaa(dont forget to add pointcheaa here): You have to list some questions from LeetCode that cover all aspects of that topic, the quetions should be something like this, questioncheaa: first question (link). questioncheaa: second question(link). The topic name is ${topicName}, the number of questions I have done in that topic is ${problemsSolved}, and the total number of questions is ${totalQuestions}.
              I want you to respond in the following format: "pointcheaa: something. pointcheaa: another thing. pointcheaa: questions". If you write any other text than this, then my life would be in danger. And don't highlight any text by making it bold. For the questions, you can follow the format of questioncheaa: first question. questioncheaa: second question... If possible, also attach the link of the LeetCode question that is in discussion that cover the topic from all sides and only give a maximum of 10 questions. Here is a sample response of the queue topic, I want you to follow the same format to the space for all the topics. SampleResponse = ${sampleResponse}`
                        }
                    ]
                }
            ]
        };

        // Call the API
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const jsonResponse = await response.json();
            const responseText = jsonResponse.candidates[0].content.parts[0].text;

            console.log(responseText);

            const pointsArray = responseText.split('pointcheaa:').map(point => point.trim()).filter(point => point);

            if (pointsArray.length <= 2) {
                setFirstTwoPoints(['Refresh the page']);
                setIsLoading(false);
                return;
            }
            setFirstTwoPoints(pointsArray?.slice(0, 2));
            setRemainingPoints(pointsArray?.slice(2));

            const questionsRegex = /questioncheaa: (.+)/g;
            const questionsArray = [];
            let match;
            while ((match = questionsRegex.exec(responseText)) !== null) {
                questionsArray.push(match[1].trim());
            }

            setQuestions(questionsArray);

            setIsLoading(false);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    useEffect(() => {
        fetchTopicInfo();
    }, [topicName]);



    return (

        <DashboardLayout>
            {isLoading ? <LoadingScreen /> :
                <>
                    <DashboardNavbar />
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        textAlign="left"
                    >
                        <Container>
                            <Typography variant="h2" gutterBottom textAlign={'center'}>
                                {topicName}
                            </Typography>
                            <List>
                                {firstTwoPoints.map((point, index) => (
                                    <ListItem key={index} sx={{ marginBottom: '10px' }}>
                                        <ListItemText
                                            primary={`${index + 1}. ${point}`}
                                            sx={{
                                                color: theme => theme.palette.mode === 'light'
                                                    ? theme.palette.text.main // black for light mode
                                                    : theme.palette.white.main, // white for dark mode
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>

                            <Typography variant="h4" gutterBottom>
                                Some important questions
                            </Typography>
                            <List>
                                {questions.map((question, index) => (
                                    <a
                                        href={`${question.split(' (')[1].slice(0, -1)}`}
                                        target='_blank'
                                        style={{ textDecoration: 'none', color: 'inherit' }}
                                    >
                                        <ListItem key={index} sx={{ marginBottom: '10px' }}>
                                            <ListItemText
                                                primary={`${index + 1}. ${question.split(' (')[0]}`}
                                                sx={{
                                                    color: theme => theme.palette.mode === 'light'
                                                        ? theme.palette.text.main // black for light mode
                                                        : theme.palette.white.main // white for dark mode
                                                }}
                                            />
                                        </ListItem>
                                    </a>
                                ))}
                            </List>
                        </Container>
                    </Box>
                </>
            }
        </DashboardLayout>


    );
}

export default TopicDetail;
