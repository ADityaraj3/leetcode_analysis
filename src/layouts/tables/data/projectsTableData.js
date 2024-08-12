/* eslint-disable react/prop-types */
/* eslint-disable react/function-component-definition */
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
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDProgress from "components/MDProgress";

// Images
import LogoAsana from "assets/images/small-logos/logo-asana.svg";
import logoGithub from "assets/images/small-logos/github.svg";
// import logoAtlassian from "assets/images/small-logos/logo-atlassian.svg";
import logoSlack from "assets/images/small-logos/logo-slack.svg";
import logoSpotify from "assets/images/small-logos/logo-spotify.svg";
import logoInvesion from "assets/images/small-logos/logo-invision.svg";
import { getCookie } from "utlis/cookieUtils";
import { useState, useEffect } from "react";
import { tagProblemCounts } from "utlis/total_questions";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";

export default function ProjectsTableData() {
  const username = getCookie('userName');
  const [topicData, setTopicData] = useState([]);
  const navigate = useNavigate();

  const deSlugify = (str) => {
    let formattedName = str.replace('-', ' ');

    formattedName = formattedName.split(' ').map(word => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');

    return formattedName;
  };

  const fetchTopicData = async () => {
    const response = await fetch('http://localhost:3001/typeofquestionssolved', {
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

    setTopicData(fetchedTopicData);
  };

  useEffect(() => {
    fetchTopicData();
  }, [username]);

  const handleRowClick = async (topicName, totalQuestions, problemsSolved) => {
    navigate(`/topicDetail/${topicName}/${totalQuestions}/${problemsSolved}`);
  };

  const Project = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" variant="rounded" />
      <MDTypography display="block" variant="button" fontWeight="medium" ml={1} lineHeight={1}>
        {name}
      </MDTypography>
    </MDBox>
  );

  const Progress = ({ color, value }) => (
    <MDBox display="flex" alignItems="center">
      <MDTypography variant="caption" color="text" fontWeight="medium">
        {value}%
      </MDTypography>
      <MDBox ml={0.5} width="9rem">
        <MDProgress variant="gradient" color={color} value={value} />
      </MDBox>
    </MDBox>
  );

  const columns = [
    { Header: "topic", accessor: "topic", width: "30%", align: "left" },
    { Header: "questions", accessor: "questions", align: "left" },
    { Header: "completion", accessor: "completion", align: "center" },
    { Header: "action", accessor: "action", align: "center" },
  ];

  const rows = topicData.map((topic) => {
    const totalQuestions = tagProblemCounts[topic.tagSlug] || 1; // Default to 1 to avoid division by zero

    return {
      topic: <Project image={LogoAsana} name={topic.tagName} />,
      questions: (
        <MDTypography component="a" href={`/topicDetail/${topic.tagName}/${totalQuestions}/${topic.problemsSolved}`} variant="button" color="text" fontWeight="medium" onClick={() => handleRowClick(topic.tagName, totalQuestions, topic.problemsSolved)} cursor="pointer">
          {`${topic.problemsSolved} / ${totalQuestions}`}
        </MDTypography>
      ),
      completion: <Progress color="info" href={`/topicDetail/${topic.tagName}/${totalQuestions}/${topic.problemsSolved}`} value={((topic.problemsSolved / totalQuestions) * 100).toFixed(1)} onClick={() => handleRowClick(topic.tagName, totalQuestions, topic.problemsSolved)} />,
      action: (
        <MDTypography component="a" href={`/topicDetail/${topic.tagName}/${totalQuestions}/${topic.problemsSolved}`} color="text" onClick={() => handleRowClick(topic.tagName, totalQuestions, topic.problemsSolved)}>
          <Icon>more_vert</Icon>
        </MDTypography>
      ),
    };
  });

  return { columns, rows };
}
