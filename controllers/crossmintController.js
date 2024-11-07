const mintNFT = async (req, res) => {
  const { url } = req.body;
  const { X_API_KEY, COLLECTION_ID } = process.env;

  try {
    // Metadata without recipient field
    const metadata = {
      name: "Testing Page 3",
      description: "My NFT created via the mint API from server!",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmCy16nhIbV3pI1qLYHMJKwbH2458oiC9EmA&s",
      attributes: [{ trait_type: "URL", value: url }],
    };

    // Options with recipient separated from metadata
    const options = {
      method: "POST",
      headers: {
        "X-API-KEY": X_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        metadata, // Pass metadata as its own object
        recipient: "base-sepolia:0xf98bf05D261DfBFd05F8B6f63758C68f558d5568",
        // recipient: "email:musama@devigital.com:base-sepolia", // Separate recipient field
      }),
    };

    const response = await fetch(
      `https://staging.crossmint.com/api/2022-06-09/collections/${COLLECTION_ID}/nfts`,
      options
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Error response from Crossmint:", data);
      return res.status(response.status).json({
        message: "Failed to mint NFT",
        error: data,
      });
    }

    res.status(201).json({ message: "Minted Successfully!", data });
  } catch (err) {
    console.error("Server error while minting NFT:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { mintNFT };
