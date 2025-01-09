const cron = require("node-cron");
const axios = require("axios");
const DeploymentHistoryModel = require("./models/deploymentHistory");


const pollForDomain = async (
  taskId,
) => {

    try {
      const taskResponse = await axios.get(
        `${process.env.FOREVERLAND_HOSTING_BASE_URL}/tasks/${taskId}`,
        {
          headers: {
            token: process.env.TOKEN_ID,
          },
        }
      );
      const retrievedHash = taskResponse?.data?.content?.hash;
      const arweaveHash = taskResponse?.data?.content?.domains?.[0];

      console.log("ArweaveHash", arweaveHash)
      if (retrievedHash) {

        return retrievedHash
      }
    } catch (error) {
      console.error('Error checking task status:', error);
    }
};

// Function to check deployment status on Foreverland
const checkDeploymentStatus = async (taskId) => {
  try {
    const response = await axios.get(
      `${process.env.FOREVERLAND_HOSTING_BASE_URL}/tasks/${taskId}`,
      {
        headers: {token: process.env.TOKEN_ID},
      }
    );
    console.log("Response", response)
    return response.data; // This should include deployment status and URL
  } catch (error) {
    console.error(
      `Error checking deployment status for taskId ${taskId}:`,
      error.message
    );
    return null;
  }
};


// Function to update Short.io URL destination
const updateShortIoUrl = async (shortId, newDestination) => {
  try {
    await axios.post(
      `${process.env.SHORT_IO_BASE_URL}/${shortId}`,
      { originalURL: newDestination },
      {
        headers: {
          Authorization: process.env.SHORT_IO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Short.io URL updated successfully to ${newDestination}`);
  } catch (error) {
    console.error(`Error updating Short.io URL for ${shortId}:`, error.message);
  }
};

// Cron job function
const startCronJob = () => {
  cron.schedule("* * * * *", async () => {
    console.log("Running cron job to update deployment URLs...");

    try {
      // Fetch documents with empty arweaveUrl
      const deployments = await DeploymentHistoryModel.find({ arweaveUrl: "" });

      for (const deployment of deployments) {
        console.log(
          `Checking deployment status for taskId: ${deployment.taskId}`
        );
        
        const result = await checkDeploymentStatus(deployment.taskId);

        if (result.content.status === "SUCCESS") {
          const pollDomain = await pollForDomain(deployment.taskId)
          console.log("PollDomain", pollDomain)
          console.log(
            `Deployment completed. Updating URL for taskId: ${deployment.taskId}`
          );

          const customUrl = await DeploymentHistoryModel.find({ taskId: deployment.taskId  });
          console.log("customUrl",customUrl)
          await updateShortIoUrl(deployment.customUrl, result.url);
        } else {
          console.log(
            `Deployment still in progress for taskId: ${deployment.taskId}`
          );
        }
      }
    } catch (error) {
      console.error("Error in cron job:", error.message);
    }
  });
};

module.exports = { startCronJob };