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
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";
import { useEffect, useState } from "react";
import { getCookie } from "utlis/cookieUtils";
import { FaJava, FaPython, FaJs, FaDatabase } from 'react-icons/fa';
import { TbBrandCpp } from "react-icons/tb";


function OrdersOverview() {

  const [languageStats, setLanguageStats] = useState([]);
  const username = getCookie("userName");

  useEffect(() => {
    getLangData();
  }, []);

  const getLangData = async () => {
    const response = await fetch('https://leetcode-analysis-backend.vercel.app/langstats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username
      })
    });

    const result = await response.json();

    if (result.errors) {
      console.log(result.errors);
      return;
    }

    const data = result.data.matchedUser.languageProblemCount;

    // Transform data to include icons
    const languageIconMap = {
      "C++": <TbBrandCpp />,
      "Java": <FaJava />,
      "Python": <FaPython />,
      "Python3": <FaPython />,
      "MySQL": <FaDatabase />,
      "JavaScript": <FaJs />
    };

    const transformedData = data
      .map(item => ({
        languageName: item.languageName,
        problemsSolved: item.problemsSolved,
        icon: languageIconMap[item.languageName] || null // Use null if icon is not found
      }))
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 9);

    setLanguageStats(transformedData);
  };



  return (
    <Card sx={{ height: "100%" }}>
      <MDBox pt={3} px={3}>
        <MDTypography variant="h6" fontWeight="medium">
          Language overview
        </MDTypography>
        <MDBox mt={0} mb={2}>
          <MDTypography variant="button" color="text" fontWeight="regular">
            <MDTypography display="inline" variant="body2" verticalAlign="middle">
              <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
            </MDTypography>
            &nbsp;
            <MDTypography variant="button" color="text" fontWeight="medium">
              Top
            </MDTypography>{" "}
            9 languages used
          </MDTypography>
        </MDBox>
      </MDBox>
      <MDBox p={2}>
        {languageStats.map((item, index) => (
          <TimelineItem
            key={index}
            title={item.languageName}
            dateTime={`Problems Solved: ${item.problemsSolved}`}
            icon={item.icon}
          />
        ))}
      </MDBox>
    </Card>
  );
}

export default OrdersOverview;
