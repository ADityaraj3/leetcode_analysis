const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/langstats', async (req, res) => {
  const { username } = req.body;

  const data = {
    query: `
      query languageStats($username: String!) {
        matchedUser(username: $username) {
          languageProblemCount {
            languageName
            problemsSolved
          }
        }
      }
    `,
    variables: {
      username
    }
  };

  const config = {
    method: 'post',
    url: 'https://leetcode.com/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data)
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/submissionstats', async (req, res) => {
  const { username } = req.body;

  const data = {
    query: `
      query userSessionProgress($username: String!) {
        allQuestionsCount {
          difficulty
          count
        }
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
              submissions
            }
            totalSubmissionNum {
              difficulty
              count
              submissions
            }
          }
        }
      }
    `,
    variables: {
      username
    }
  };

  const config = {
    method: 'post',
    url: 'https://leetcode.com/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data)
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post('/userstreakstats', async (req, res) => {
  const { username, year } = req.body;

  const data = {
    query: `
          query userProfileCalendar($username: String!, $year: Int) {
            matchedUser(username: $username) {
              userCalendar(year: $year) {
                activeYears
                streak
                totalActiveDays
                submissionCalendar
              }
            }
          }
        `,
    variables: {
      username,
      year
    },
    operationName: 'userProfileCalendar'
  };

  const config = {
    method: 'post',
    url: 'https://leetcode.com/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data)
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post('/typeofquestionssolved', async (req, res) => {
  const { username } = req.body;

  const data = {
    query: `
        query skillStats($username: String!) {
          matchedUser(username: $username) {
            tagProblemCounts {
              advanced {
                tagName
                tagSlug
                problemsSolved
              }
              intermediate {
                tagName
                tagSlug
                problemsSolved
              }
              fundamental {
                tagName
                tagSlug
                problemsSolved
              }
            }
          }
        }
      `,
    variables: {
      username
    },
    operationName: 'skillStats'
  };

  const config = {
    method: 'post',
    url: 'https://leetcode.com/graphql',
    headers: {
      'Content-Type': 'application/json',
    },
    data: JSON.stringify(data)
  };

  try {
    const response = await axios(config);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

app.post('/leetcode-profile', async (req, res) => {
  const { username } = req.body;

  try {
    const response = await axios.post('https://leetcode.com/graphql/', {
      query: `
              query userPublicProfile($username: String!) {
                  matchedUser(username: $username) {
                      contestBadge {
                          name
                          expired
                          hoverText
                          icon
                      }
                      username
                      githubUrl
                      twitterUrl
                      linkedinUrl
                      profile {
                          ranking
                          userAvatar
                          realName
                          aboutMe
                          school
                          websites
                          countryName
                          company
                          jobTitle
                          skillTags
                          postViewCount
                          postViewCountDiff
                          reputation
                          reputationDiff
                          solutionCount
                          solutionCountDiff
                          categoryDiscussCount
                          categoryDiscussCountDiff
                      }
                  }
              }
          `,
      variables: {
        username: username
      },
      operationName: "userPublicProfile"
    }, {
      headers: {
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json',
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the profile.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port} `);
});
