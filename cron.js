const cron = require("node-cron");
const axios = require("axios");
const DeploymentHistoryModel = require("./models/deploymentHistory");

const getHtmlPath = async (retrievedHash) => {
  try {
    const url = `${process.env.EVERLAND_DOMAIN_BASE_URL}/${retrievedHash}`;
    const urlResponse = await axios.get(url);
    const indexHtmlId = urlResponse.data.paths?.["index.html"]?.id;

    if (indexHtmlId) {
      return indexHtmlId;
    } else {
      console.error("Index HTML ID not found in response.");
      return null;
    }
  } catch (error) {
    console.error("Error retrieving final URL:", error);
  }
};

const createCustomURL = async (htmlPath) => {
  const customizeUrl = `${process.env.EVERLAND_DOMAIN_BASE_URL}/${htmlPath}`;
  return customizeUrl;
};

const pollForDomain = async (taskId) => {
  try {
    const taskResponse = await axios.get(
      `${process.env.EVERLAND_HOSTING_BASE_URL}/tasks/${taskId}`,
      {
        headers: {
          token: process.env.TOKEN_ID,
        },
      }
    );
    const retrievedHash = taskResponse?.data?.content?.hash;

    if (retrievedHash) {
      const htmlPath = await getHtmlPath(retrievedHash);
      const customizeUrl = await createCustomURL(htmlPath);

      return customizeUrl;
    }
  } catch (error) {
    console.error("Error checking task status:", error);
  }
};

// Function to check deployment status on Foreverland
const checkDeploymentStatus = async (taskId) => {
  try {
    const response = await axios.get(
      `${process.env.EVERLAND_HOSTING_BASE_URL}/tasks/${taskId}`,
      {
        headers: { token: process.env.TOKEN_ID },
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
const handler = (req, res) => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("Running cron job to update deployment URLs...");

    try {
      const deployments = await DeploymentHistoryModel.find({
        deployed: false,
      });

      if (!deployments || deployments.length === 0) {
        console.log("No deployments to update.");
        return; // Exit early if no deployments found
      } else {
        console.log(`${deployments.length} pending deployments to update.`);
      }
      for (const deployment of deployments) {
        console.log(
          `Checking deployment status for taskId: ${deployment.ipfsTaskId}`
        );

        const result = await checkDeploymentStatus(deployment.ipfsTaskId);
        if (result.content.status === "SUCCESS") {
          console.log(
            `Deployment completed. Updating URL for taskId: ${deployment.ipfsTaskId}`
          );

          const deploymentData = await DeploymentHistoryModel.find({
            ipfsTaskId: deployment.ipfsTaskId,
          });
          const match = deploymentData.find(
            (item) =>
              item.ipfsTaskId === deployment.ipfsTaskId &&
              item.arweaveTransactionId &&
              item.arweaveTransactionId.trim() !== ""
          );
          const updatedAt = match.updatedAt;
          const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
          if (match && updatedAt < oneHourAgo) {
            await updateShortIoUrl(
              match?.shortUrlId,
              match?.arweaveTransactionId
            );
            const fieldsToUpdate = {
              deployed: true,
            };
            await DeploymentHistoryModel.findOneAndUpdate(
              { ipfsTaskId: deployment.ipfsTaskId },
              fieldsToUpdate,
              { new: true, runValidators: true }
            );
          } else {
            console.log(
              `⏳ Skipping deployment ${deployment.ipfsTaskId}: last update was less than 1 hour ago`
            );
          }
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

module.exports = { handler };
