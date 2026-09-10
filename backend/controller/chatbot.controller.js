import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { Item } from "../models/item.model.js";

const websiteBaseContext = `
You are the official AI Assistant for **ZeroWasteHub** (also known as Zero Waste), powered by LangChain JS.

=========================================================
🌱 ABOUT ZEROWASTEHUB:
ZeroWasteHub is a web platform committed to sustainability and environmental conservation by reducing product, food, and resource waste.
It connects three primary user roles:
1. **Vendors** (Businesses, supermarkets, restaurants, distributors with surplus or near-expiry items)
2. **NGOs** (Non-Governmental Organizations & charities collecting items for community relief)
3. **Volunteers** (Community members helping with logistics, pickup, and delivery of claimed goods)

=========================================================
🔐 ACCOUNT & AUTHENTICATION:
- **Registration & Sign Up** (/register): Users can register by choosing their role (Vendor, NGO, or Volunteer), providing contact info, address, city, and credentials.
- **Login** (/): Secure login using email and password. Redirects users directly to their designated role dashboard.
- **Forgot Password** (/forgotpassword): Allows users to reset their account password securely via email verification/OTP.
- **Profile Management** (/myprofile & /updateprofile): Users can view and edit their profile details, update profile picture/avatar, phone number, address, and city.

=========================================================
🔶 AS A VENDOR:
- **Vendor Dashboard** (/vendor/dashboard): Overview of all listed items, claim requests from NGOs, delivery status updates, and quick navigation.
- **Create New Item** (/vendor/createitem): Vendors can list surplus or expiring items by specifying item name, description, category (Food, Clothes, Electronics, Books, Household, Other), total quantity, price (or 0 for donation), expiry date, image, and pickup location.
- **Manage Listed Items** (/vendor/allitems, /vendor/item/:id, /vendor/updateitem/:id): View all listed items, update stock/details, or edit item specifications.
- **Claim Management**: Review incoming claim requests from NGOs. Approve or reject claims, and update status to Pending, Approved, Rejected, or Delivered.
- **NGO Directory** (/allngos): View and connect with registered NGOs on the platform.
- **About & Vision** (/readmore): Learn more about ZeroWasteHub mission, sustainability goals, and company vision.

=========================================================
🔷 AS AN NGO:
- **NGO Dashboard** (/ngo/dashboard): Central hub showing available surplus items, recent claim updates, nearby vendor discovery, and quick access.
- **Browse & Search Items** (/vendor/allitems): Search and filter available items by category, location, and status.
- **Item Details & Claiming** (/vendor/item/:id): Inspect item specifications, expiry dates, quantities, and submit claim requests with required quantity and cause description.
- **My Claims** (/ngo/myclaimed): Track all submitted claims in real-time with status stages (Pending, Approved, Rejected, Delivered).
- **Book Volunteers for Transport** (/ngo/bookvolunteer & /bookingform/:id): Request volunteer assistance for picking up claimed items from vendor locations and delivering them to NGO facilities.
- **Vendor Discovery & Nearby Search** (/allvendors & /near): View all registered vendors and locate nearby vendors on an interactive map/list for fast local pickup.

=========================================================
🟢 AS A VOLUNTEER:
- **Volunteer Dashboard** (/volunteer/dashboard): View available pickup and transport requests submitted by NGOs or Vendors.
- **Accept Tasks**: Volunteers can accept delivery assignments to transport claimed goods from Vendors to NGOs.
- **Status Updates**: Mark deliveries as Assigned, In Transit, and Delivered upon successful transport.

=========================================================
💬 COMMUNITY & COLLABORATION:
- **Real-time Direct Chat** (/chatting/:id): Built-in messaging tool for direct communication between Vendors, NGOs, and Volunteers to coordinate pickup times and delivery details.
- **Notification System** (/notifications): Alerts for claim updates, new messages, volunteer bookings, and status changes.
- **Reviews & Ratings** (/review/:id & /allreview/:id): Rate and review vendors, NGOs, and volunteers after completed transactions to build platform trust and accountability.

=========================================================
🧭 ASSISTANT RULES:
- Always answer helpful, polite, and accurate questions about ZeroWasteHub.
- Guide users on how to navigate the platform, perform actions (like creating items, claiming items, booking volunteers, resetting passwords), and understand their role features.
- If asked about available surplus food/items, refer to the LIVE SURPLUS FOOD/ITEMS LIST below.
- If asked anything completely unrelated to ZeroWasteHub, politely reply:
  "I can only answer questions related to ZeroWasteHub and sustainability."
`;

export const chatWithBot = async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Message is required" });
  }

  const normalizedMessage = message.toLowerCase();

  // ✅ Shortcut reply for zero-waste term
  if (
    normalizedMessage.includes("zero waste") ||
    normalizedMessage.includes("zerowaste") ||
    normalizedMessage.includes("zero-waste")
  ) {
    const predefinedResponse = `Zero Waste is a platform designed for vendors, NGOs, and the wider community. It allows vendors to list their unused or surplus items, which NGOs can then access—either through donations or at minimal cost—based on their needs.`;
    return res.status(200).json({ response: predefinedResponse });
  }

  try {
    const BOT_API_KEY = process.env.BOT_API_KEY;

    if (!BOT_API_KEY) {
      console.error("❌ BOT_API_KEY is missing from environment variables");
      return res.status(500).json({ error: "Chatbot API key not configured" });
    }

    // 📦 Retrieve live active surplus items from MongoDB
    let liveItemsContext = "No active surplus items available in the database at this moment.";
    try {
      const activeItems = await Item.find({ status: "available" })
        .select("name description category quantity mode location price expiryDate isUrgent")
        .limit(10)
        .lean();

      if (activeItems && activeItems.length > 0) {
        liveItemsContext = activeItems
          .map(
            (item, idx) =>
              `${idx + 1}. **${item.name}** [Category: ${item.category}] - ${item.quantity} units | Location: ${item.location} | Mode: ${item.mode} | Price: ₹${item.price}${item.isUrgent ? " | ⚡ URGENT PICKUP REQUIRED" : ""}${item.expiryDate ? ` | Expiry: ${new Date(item.expiryDate).toLocaleString()}` : ""}`
          )
          .join("\n");
      }
    } catch (dbErr) {
      console.warn("⚠️ Could not fetch active items for LangChain context:", dbErr.message);
    }

    // 🔗 Format conversation history for LangChain MessagesPlaceholder
    const formattedHistory = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        if (msg.role === "user" && msg.text) {
          formattedHistory.push(new HumanMessage(msg.text));
        } else if (msg.role === "bot" && msg.text) {
          formattedHistory.push(new AIMessage(msg.text));
        }
      }
    }

    // 🦜 Construct LangChain ChatPromptTemplate
    const fullSystemPrompt = `${websiteBaseContext}\n\n=========================================================\n📦 LIVE SURPLUS ITEMS IN DATABASE RIGHT NOW:\n${liveItemsContext}`;

    const prompt = ChatPromptTemplate.fromMessages([
      ["system", fullSystemPrompt],
      new MessagesPlaceholder("chat_history"),
      ["human", "{input}"]
    ]);

    // 🤖 Candidate model fallbacks
    const candidateModels = [
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-flash-latest",
      "gemini-1.5-flash"
    ];

    let botResponse = null;
    let lastError = null;

    for (const modelName of candidateModels) {
      try {
        const llm = new ChatGoogleGenerativeAI({
          model: modelName,
          apiKey: BOT_API_KEY,
          temperature: 0.7,
        });

        const chain = prompt.pipe(llm);
        const result = await chain.invoke({
          chat_history: formattedHistory,
          input: message,
        });

        const outputText = typeof result.content === "string" 
          ? result.content 
          : Array.isArray(result.content) 
            ? result.content.map(c => c.text || JSON.stringify(c)).join("")
            : JSON.stringify(result.content);

        if (outputText) {
          botResponse = outputText;
          console.log(`✅ LangChain chatbot response generated successfully using model: ${modelName}`);
          break;
        }
      } catch (err) {
        console.warn(`⚠️ LangChain model ${modelName} failed (${err.status || err.message}). Trying fallback...`);
        lastError = err;
      }
    }

    if (botResponse) {
      return res.status(200).json({ response: botResponse });
    }

    throw lastError || new Error("All Gemini model fallbacks failed in LangChain");

  } catch (error) {
    console.error("❌ Error in LangChain chatWithBot:");
    console.error("  Message:", error.message);
    console.error("  Status:", error.status || error.response?.status);
    
    const errorMessage = error.message || "Internal server error";
    res.status(500).json({ 
      error: `LangChain Chatbot error: ${errorMessage}` 
    });
  }
};


