/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import axios from 'axios';
import { useEffect, useState } from 'react';
// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import { getCookie } from "utlis/cookieUtils";
import Tables from "layouts/tables";
import projectsTableData from "layouts/tables/data/projectsTableData";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import LoadingScreen from "examples/loader";
import { tagProblemCounts } from "utlis/total_questions";
import { List, ListItem, ListItemText } from "@mui/material";
import Notifications from "layouts/notifications";
import MDButton from "components/MDButton";

function Dashboard() {

  const username = getCookie("userName");
  const { columns: pColumns, rows: pRows } = projectsTableData();
  const [isLoading, setIsLoading] = useState(true);
  const [timeZoneMap, setTimeZoneMap] = useState(new Map());
  const [totalQuestions, setTotalQuestions] = useState({ count: 0, acSubmissions: 0 });
  const [easyQuestions, setEasyQuestions] = useState({ count: 0, acSubmissions: 0 });
  const [mediumQuestions, setMediumQuestions] = useState({ count: 0, acSubmissions: 0 });
  const [hardQuestions, setHardQuestions] = useState({ count: 0, acSubmissions: 0 });
  const [monthlyQuestionMap, setMonthlyQuestionMap] = useState(new Map());
  const [monthQuestions, setMonthQuestions] = useState({ labels: [], datasets: { label: "Questions per month", data: [] } });
  const [previousYearMonthlyQuestionMap, setPreviousYearMonthlyQuestionMap] = useState(new Map());
  const [previousYearMonthQuestions, setPreviousYearMonthQuestions] = useState({ labels: [], datasets: { label: "Questions per month", data: [] } });
  const [weeklyQuestionData, setWeeklyQuestionData] = useState({ labels: [], datasets: { label: "Questions in last 7 days", data: [] } });
  const [topicData, setTopicData] = useState([]);
  const [geminiAnalytics, setGeminiAnalytics] = useState('');
  const [geminiAnalyticsPoints, setGeminiAnalyticsPoints] = useState([]);
  const apiKey = process.env.GOOGLE_API_KEY;

  useEffect(() => {
    setIsLoading(true);
    getSubmisionsData();
    submissionTimeStats();
    submissionTimeStatsPreviousYear();
    fetchWeeklyQuestionData();
    fetchTopicData();
    setTimeout(() => {
      setIsLoading(false);
    }, 3000)
    // setIsLoading(false);
  }, []);


  const deSlugify = (str) => {
    let formattedName = str.replace('-', ' ');

    formattedName = formattedName.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');

    return formattedName;
  };

  const fetchTopicData = async () => {
    const response = await fetch('https://leetcode-analysis-backend.vercel.app/typeofquestionssolved', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    });

    const result = await response.json();

    const fetchedTopicData = [
      ...result.data.matchedUser.tagProblemCounts.fundamental,
      ...result.data.matchedUser.tagProblemCounts.intermediate,
      ...result.data.matchedUser.tagProblemCounts.advanced
    ];

    const completeTopicData = mergeWithDefaultTopics(fetchedTopicData, tagProblemCounts);
    setTopicData(completeTopicData);
  };

  const mergeWithDefaultTopics = (fetchedData, defaultTopics) => {
    const updatedData = [...fetchedData];

    Object.keys(defaultTopics).forEach((key) => {
      if (!updatedData.find((topic) => topic.tagSlug === key)) {
        updatedData.push({ tagSlug: key, problemsSolved: 0, tagName: deSlugify(key) });
      }
    });

    return updatedData;
  };

  async function generateContent(topicData) {
    setIsLoading(true);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyBsfdiGRLba50_uOaBGFrQxuSrQ8PGt0b4`;
    const headers = {
      'Content-Type': 'application/json'
    };

    if (!topicData || topicData.length === 0 || !tagProblemCounts || tagProblemCounts.length === 0) {
      setGeminiAnalyticsPoints(['Refresh the page']);
      setIsLoading(false);
      return;
    }

    const result = topicData.map(topic => `${topic.tagName}-${topic.problemsSolved}`);

    console.log("topicData", topicData);

    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `I am prepraing for an interview and using leetcode to do so. I have done multiple questions of different type, to make you understand more that what I have done till now, I am attaching a some data that has the topic's name,slug and the number of questions I have done in that topic topicData = ${result}. And then these are the total questions per topic ${tagProblemCounts}. There maybe topics that are not too neccessay for my preperation and there maybe some that are crucial for the preperation. I want you to analize this 'topicData' and comment on what should I do next that would help in my interview prep. Don't forget you need to focus on important topics more and less or no focus should be given to less important topic.reply in this format, and dont use any special character like '*' and '\\n', i.e no new paragraphs, I want it in one paragraph. here is a sample response: 'pointcheaa: something. pointcheaa: someother thing'. If you write any other text than this, then my life would be in danger. And don't highlight any text by making them bold. pointcheaa: I this first point I want you to commend on my journey till now and say something about the type of questions I have done, I have done ${totalQuestions.acSubmissions} questions if this is less than 250 questions, than you need to say that I have just started my journey and there is a long way to go. pointcheaa: Now in this second point I want you to say what all topics I have done enough (add a maximum of 5 topics that you think are important for interview). If I have done less than 50 questions in a topic dont mention it here, then never I repeat never mention that topic in this point, this is the data of questions ${result}, check from there what which topic has less than 50 quesions. I want you to write some words and be a little descriptive. pointcheaa: Now I want you to check this data ${result} and list any 5 topics that you think are important and I have not practiced enough. I want you to write some words and not just list the topics, be a little descriptive. pointcheaa: Now I want you to be a little descriptive and a give me an advice from your side on what should I do next to ace my interview. What topics should I do more and how should I approach things at this stage of my preperation based on this data ${result}. pointcheaa: In this point I want you to be a supportive friend and motivate me to do more and congratulate me for the progress I have already made.`
            }
          ]
        }
      ]
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody)
      });

      if (response.status === 429) {
        setIsLoading(false);
        setGeminiAnalyticsPoints(['Rate limit exceeded. Please try again later.']);
        alert('Rate limit exceeded. Please try again later.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }


      const jsonResponse = await response.json();
      const responseText = jsonResponse.candidates[0].content.parts[0].text;
      setGeminiAnalytics(responseText);
      const points = responseText.replace('*', '').split('pointcheaa:').slice(1).map(point => point.trim());
      setGeminiAnalyticsPoints(points);

      setIsLoading(false);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const getSubmisionsData = async () => {
    try {
      const response = await fetch('https://leetcode-analysis-backend.vercel.app/submissionstats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username
        })
      });

      const result = await response.json();

      const { allQuestionsCount, matchedUser } = result.data;

      const [allQuestions, easyQuestions, mediumQuestions, hardQuestions] = allQuestionsCount;
      const [acSubmissionsAll, acSubmissionsEasy, acSubmissionsMedium, acSubmissionsHard] = matchedUser.submitStats.acSubmissionNum;

      const difficultyMap = new Map([
        ["All", allQuestions],
        ["Easy", easyQuestions],
        ["Medium", mediumQuestions],
        ["Hard", hardQuestions]
      ]);

      const acSubmissionsMap = new Map([
        ["All", acSubmissionsAll],
        ["Easy", acSubmissionsEasy],
        ["Medium", acSubmissionsMedium],
        ["Hard", acSubmissionsHard]
      ]);

      setTotalQuestions({ count: difficultyMap.get("All").count, acSubmissions: acSubmissionsMap.get("All").count });
      setEasyQuestions({ count: difficultyMap.get("Easy").count, acSubmissions: acSubmissionsMap.get("Easy").count });
      setMediumQuestions({ count: difficultyMap.get("Medium").count, acSubmissions: acSubmissionsMap.get("Medium").count });
      setHardQuestions({ count: difficultyMap.get("Hard").count, acSubmissions: acSubmissionsMap.get("Hard").count });
    } catch (error) {
      console.error(error);
    }
  };

  const submissionTimeStats = async () => {
    try {
      const response = await fetch('https://leetcode-analysis-backend.vercel.app/userstreakstats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const timeZoneData = result.data?.matchedUser?.userCalendar?.submissionCalendar;

      const timeZoneObj = JSON.parse(timeZoneData);

      const map = Object.entries(timeZoneObj).reduce((acc, [key, value]) => {
        acc.set(parseInt(key), value);
        return acc;
      }, new Map());

      setTimeZoneMap(map);

      const monthlyMap = aggregateMonthlyData(map);
      setMonthlyQuestionMap(monthlyMap);
      formatMonthQuestions(monthlyMap, setMonthQuestions); // Pass state setter

    } catch (error) {
      Notifications.error(error.message);
      console.error("An error occurred while fetching submission time stats:", error);
    }
  };

  const submissionTimeStatsPreviousYear = async () => {
    try {
      const previousYear = new Date().getFullYear() - 1;

      const response = await fetch('https://leetcode-analysis-backend.vercel.app/userstreakstats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: username,
          year: previousYear
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      const timeZoneData = result.data?.matchedUser?.userCalendar?.submissionCalendar;

      const timeZoneObj = JSON.parse(timeZoneData);

      const map = new Map(Object.entries(timeZoneObj).map(([key, value]) => [parseInt(key), value]));

      setTimeZoneMap(map);

      const previousYearMonthlyMap = aggregateMonthlyData(map);
      setPreviousYearMonthlyQuestionMap(previousYearMonthlyMap);
      formatMonthQuestions(previousYearMonthlyMap, setPreviousYearMonthQuestions); // Pass state setter
    } catch (error) {
      console.error("An error occurred while fetching submission time stats for previous year:", error);
    }
  };

  const aggregateMonthlyData = (dailyMap) => {
    const monthlyMap = new Map();

    // Iterate over each entry in the dailyMap
    for (const [timestamp, questions] of dailyMap) {
      const date = new Date(timestamp * 1000); // Convert Unix timestamp to JS Date object
      const monthYear = `${date.getMonth() + 1}-${date.getFullYear()}`; // Format as MM-YYYY

      // Increment the count for the month-year in the monthlyMap
      monthlyMap.set(monthYear, (monthlyMap.get(monthYear) || 0) + questions);
    }

    return monthlyMap;
  };

  const formatMonthQuestions = (monthlyMap, setMonthQuestionsState) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const labels = [];
    const data = [];

    // Iterate over each entry in the monthlyMap
    monthlyMap.forEach((questions, monthYear) => {
      const [month, year] = monthYear.split("-");
      labels.push(`${monthNames[month - 1]} ${year}`); // Add formatted month-year to labels
      data.push(questions); // Add question count to data
    });

    // Sort labels and data based on the month order
    const sortedIndices = labels.map((label, index) => ({ label, index })).sort((a, b) => {
      const [monthA, yearA] = a.label.split(" ");
      const [monthB, yearB] = b.label.split(" ");
      return new Date(`${monthA} 1, ${yearA}`) - new Date(`${monthB} 1, ${yearB}`);
    }).map(item => item.index);

    const sortedLabels = sortedIndices.map(index => labels[index]);
    const sortedData = sortedIndices.map(index => data[index]);

    const filteredLabels = sortedLabels.map((item) => {
      return item.split(" ")[0]; // Extract only the month part
    });


    setMonthQuestionsState({
      labels: filteredLabels,
      datasets: {
        label: "Questions per month",
        data: sortedData
      }
    });
  };

  const fetchWeeklyQuestionData = async () => {
    try {
      const response = await fetch(`https://leetcode-analysis-backend.vercel.app/userstreakstats`);
      const result = await response.json();

      const timeZoneData = result.data?.matchedUser?.userCalendar?.submissionCalendar;
      const timeZoneObj = JSON.parse(timeZoneData);
      const last7DaysMap = new Map(Object.entries(timeZoneObj).slice(-7).map(([key, value]) => [new Date(key).getTime(), value]));

      formatWeeklyQuestions(last7DaysMap);
    } catch (error) {
      console.error(`Error fetching weekly question data: ${error}`);
    }
  };

  const formatWeeklyQuestions = (weeklyMap) => {
    const labels = [];
    const data = [];

    weeklyMap.forEach((questions, date) => {
      const formattedDate = `${date.getDate()}/${date.getMonth() + 1}`;
      labels.push(formattedDate);
      data.push(questions);
    });

    setWeeklyQuestionData({
      labels: labels,
      datasets: {
        label: "Questions in last 7 days",
        data: data
      }
    });
  };

  return (
    <DashboardLayout>
      {isLoading ? <LoadingScreen /> :
        <>
          <DashboardNavbar />
          <MDBox py={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="dark"
                    icon="done"
                    title="Total Questions Solved"
                    count={`${totalQuestions.acSubmissions}/${totalQuestions.count}`}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="sentiment_satisfied_alt"
                    color="success"
                    title="Easy"
                    count={`${easyQuestions.acSubmissions}/${easyQuestions.count}`}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    icon="mood_bad"
                    title="Medium"
                    count={`${mediumQuestions.acSubmissions}/${mediumQuestions.count}`}
                  />
                </MDBox>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <MDBox mb={1.5}>
                  <ComplexStatisticsCard
                    color="primary"
                    icon="sentiment_very_dissatisfied"
                    title="Hard"
                    count={`${hardQuestions.acSubmissions}/${hardQuestions.count}`}
                    percentage={{
                      color: "success",
                      amount: "",
                      label: "Just updated",
                    }}
                  />
                </MDBox>
              </Grid>
            </Grid>
            <MDBox mt={4.5}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={6}>
                  <MDBox mb={3}>
                    <ReportsLineChart
                      color="success"
                      title="Questions per month (current year)"
                      description={
                        <>
                          (<strong>+15%</strong>) increase in today sales.
                        </>
                      }
                      date="updated 4 min ago"
                      chart={monthQuestions}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={6} lg={6}>
                  <MDBox mb={3}>
                    <ReportsLineChart
                      color="dark"
                      title="Questions per month (previous year)"
                      description="Last Campaign Performance"
                      date="just updated"
                      chart={previousYearMonthQuestions}
                    />
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>
            <MDBox mt={3}>
              <Card>
                <MDBox mx={2} my={2} display="flex" justifyContent="center">
                  <MDButton variant="h1" textTransform="capitalize" sx={{
                    fontSize: "33px",
                    backgroundColor: "#49a3f1", // Example color, replace with your desired color
                    color: '#fffff',
                    '&:hover': {
                      backgroundColor: "#1976d2", // Darker shade for hover effect
                    }
                  }} onClick={() => generateContent(topicData)} color="info">
                    Generate Gemini Analysis of your progress
                  </MDButton>
                </MDBox>
                <MDBox mx={2} my={2}>
                  <MDTypography variant="body1">
                    <List>
                      {geminiAnalyticsPoints.map((point, index) => (
                        <ListItem key={index}>
                          <ListItemText>
                            <MDTypography
                              variant="body1"
                              color="text"
                              fontWeight="medium"
                              textTransform="capitalize"
                              fontSize="1.1rem" // Adjust the font size as needed
                              padding="0.3rem 0"
                            >
                              {index + 1}. {point}
                            </MDTypography>
                          </ListItemText>
                        </ListItem>
                      ))}
                    </List>
                  </MDTypography>
                </MDBox>

              </Card>
            </MDBox>
            <MDBox>
              <Grid container spacing={3} mt={5}>
                <Grid item xs={12} md={6} lg={8}>
                  <Grid item xs={12}>
                    <Card>
                      <MDBox
                        mx={2}
                        mt={-3}
                        py={3}
                        px={2}
                        variant="gradient"
                        bgColor="info"
                        borderRadius="lg"
                        coloredShadow="info"
                      >
                        <MDTypography variant="h6" color="white">
                          Topic Table
                        </MDTypography>
                      </MDBox>
                      <MDBox pt={3}>
                        <DataTable
                          table={{ columns: pColumns, rows: pRows }}
                          isSorted={false}
                          entriesPerPage={false}
                          showTotalEntries={false}
                          noEndBorder
                        />
                      </MDBox>
                    </Card>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={6} lg={4}>
                  <OrdersOverview />
                </Grid>
              </Grid>
            </MDBox>
          </MDBox>
          <Footer />
        </>
      }
    </DashboardLayout>

  );
}

export default Dashboard;
