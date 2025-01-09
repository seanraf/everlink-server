const cron = require("node-cron");
const axios = require("axios");
const DeploymentHistoryModel = require("./models/deploymentHistory");

// Function to check deployment status on Foreverland
const checkDeploymentStatus = async (taskId) => {
  try {
    const response = await axios.get(
      `https://api.foreverland.org/deployments/${taskId}/status`,
      {
        headers: { Authorization: `Bearer YOUR_FOREVERLAND_API_KEY` },
      }
    );
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
  cron.schedule("0 * * * *", async () => {
    console.log("Running cron job to update deployment URLs...");

    try {
      // Fetch documents with empty arweaveUrl
      const deployments = await DeploymentHistoryModel.find({ arweaveUrl: "" });

      for (const deployment of deployments) {
        console.log(
          `Checking deployment status for taskId: ${deployment.taskId}`
        );

        const status = await checkDeploymentStatus(deployment.taskId);
        if (status && status.url) {
          console.log(
            `Deployment completed. Updating URL for taskId: ${deployment.taskId}`
          );

          // Update arweaveUrl in the database
          deployment.arweaveUrl = status.url;
          await deployment.save();

          // Update the Short.io destination
          await updateShortIoUrl(deployment.customUrl, status.url);
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
