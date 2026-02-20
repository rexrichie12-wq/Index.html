// netlify/functions/submit-donation.js
const fetch = require('node-fetch');

exports.handler = async (event) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const donationData = JSON.parse(event.body);
    
    // Your Formbricks credentials
    const FORMBRICKS_API_KEY = process.env.FORMBRICKS_API_KEY; // Add this in Netlify
    const FORMBRICKS_ENVIRONMENT_ID = 'cmlusrwin5btnuf01lnyarup6';
    const FORMBRICKS_SURVEY_ID = 'cmlusxev35irwun013mqa5p7s';
    
    // Format data for Formbricks API
    const response = await fetch(
      `https://app.formbricks.com/api/v1/environments/${FORMBRICKS_ENVIRONMENT_ID}/surveys/${FORMBRICKS_SURVEY_ID}/responses`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': FORMBRICKS_API_KEY
        },
        body: JSON.stringify({
          data: donationData,
          finished: true
        })
      }
    );

    const result = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ success: true, data: result })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
