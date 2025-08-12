import axios from 'axios';

export const chatWithBot = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const BOT_API_KEY = process.env.BOT_API_KEY;
  const BOT_API_ENDPOINT = process.env.BOT_API_ENDPOINT;

  const normalizedMessage = message.toLowerCase();

  // ✅ Shortcut reply for zero-waste term
  if (
    normalizedMessage.includes("zero waste") ||
    normalizedMessage.includes("zerowaste") ||
    normalizedMessage.includes("zero-waste")
  ) {
    const predefinedResponse = `Zero Waste is a platform designed for vendors, NGOs, volunteers, and the wider community. It allows vendors to list their unused or surplus items, which NGOs can then access—either through donations or at minimal cost—based on their needs. Volunteers assist NGOs by transporting claimed items from vendor locations to NGO facilities. The platform also features a blogs community for sharing ideas, updates, and stories.`;
    return res.status(200).json({ response: predefinedResponse });
  }

  try {
    // ✅ Full context prompt
    const websiteContext = `
You are an AI assistant for the platform **ZeroWasteHub**.

ZeroWasteHub is a zero-waste platform that connects **vendors**, **NGOs**, and **volunteers** to reduce product and food waste.  
It supports donation and redistribution of unsold or expiring goods, and encourages community engagement through blogs.

=========================
🔹 GENERAL FEATURES:
- After login, users land on their respective **dashboard** (NGO, Vendor, or Volunteer).
- From the dashboard, users can:
  - Access **notifications**
  - View **all items**
  - Use **logout**
  - Open the **profile section** to:
    - Update their profile
    - Reset password (Forgot Password)
    - View received reviews
  - Access the **Blogs Community**:
    - Upload blogs
    - View blogs from others
    - Like and comment on blogs

=========================
🔶 AS A **VENDOR**, YOU CAN:
- Create new listings via **"Create Item"**
- Add item name, description, quantity, price, expiry, and category
- View and manage claims made by NGOs
- Approve, reject, or mark claims as delivered
- Access **Read More** page for company info
- View list of **all NGOs and vendors** at the bottom of the dashboard

=========================
🔷 AS AN **NGO**, YOU CAN:
- Browse and claim available items
- View your claimed items under **"My Claims"**
- Track approval status (pending, approved, rejected, delivered)
- Discover **nearby vendors** (just above footer on the dashboard)
- View list of **all NGOs and vendors** at the bottom of the dashboard
- Book a **volunteer** for transporting items from vendor location to NGO

=========================
🟢 AS A **VOLUNTEER**, YOU CAN:
- Help NGOs transport claimed items from vendor places to NGO facilities
- Check your **bookings**
- See list of **all volunteers**
- Participate in the **Blogs Community** by posting, liking, and commenting

=========================
🧭 ADDITIONAL INFO:
- Items can be filtered by **location, category**, and **status**
- The platform is designed to maximize sustainability by reducing waste
- If asked anything unrelated to the platform, politely reply:
  "I can only answer questions related to ZeroWasteHub."
    `;

    // ✅ Gemini API call
    const response = await axios.post(
      `${BOT_API_ENDPOINT}?key=${BOT_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${websiteContext}\n\nUser asked: ${message}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const botResponse =
      response.data.candidates?.[0]?.content?.parts?.[0]?.text || "No response from assistant.";
    res.status(200).json({ response: botResponse });

  } catch (error) {
    console.error("Error in chatWithBot:", error?.response?.data || error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
