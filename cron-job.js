module.exports = (req, res) => {
  console.log("Cron job triggered at:", new Date().toLocaleString());
  res.status(200).send("Cron job executed successfully!");
};
