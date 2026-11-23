export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(200).send('Block Paisa Bot is Active!');
  }

  const BOT_TOKEN = "9210572669:AAFVeuGNHweMCdCDW0ai8ezbBBrOEyYMqRM"; // Paste your BotFather API Token here
  const WEB_APP_URL = "https:" + "//blockpaisa.vercel.app";
  const SUPPORT_USERNAME = "@Game_Developer07"; // Paste your Telegram support username here

  const update = req.body;
  if (!update || !update.message) return res.status(200).end();

  const chatId = update.message.chat.id;
  const text = update.message.text || "";

  // 4 Fixed Bottom Buttons (Persistent Keyboard)
  const mainKeyboard = {
    keyboard: [
      [{ text: "🎮 Play Game", web_app: { url: WEB_APP_URL } }],
      [{ text: "📜 Transaction History" }, { text: "👥 Refer and Earn" }],
      [{ text: "🎧 Customer Support" }]
    ],
    resize_keyboard: true,
    is_persistent: true
  };

  let replyText = "";

  if (text.startsWith("/start")) {
    replyText = `🔥 *Welcome to Block Paisa!*\n\n` +
      `🧱 Place blocks, clear lines, and earn points daily!\n` +
      `💰 *10,000 Points = ₹10.00* (Auto-converts at 12:00 AM)\n\n` +
      `👇 Tap *Play Game* below to start playing and earning!`;
  } 
  else if (text === "📜 Transaction History") {
    replyText = `📜 *Transaction History*\n\n` +
      `You have not made any withdrawal requests yet.\n\n` +
      `💡 *Note:* Once you reach ₹10.00, open the Wallet inside the game to withdraw via UPI or Google Play Redeem Code.`;
  } 
  else if (text === "👥 Refer and Earn") {
 const inviteLink = "https:" + "//t.me/BlockPaisaGame_bot?start=" + chatId;
    replyText = `👥 *Refer & Earn Program*\n\n` +
      `Invite just *1 friend* to unlock lifetime withdrawals!\n\n` +
      `🔗 *Your Referral Link:*\n\`${inviteLink}\`\n\n` +
      `*(Tap the link above to copy and share it with your friends)*`;
  } 
  else if (text === "🎧 Customer Support") {
    replyText = `🎧 *Customer Support*\n\n` +
      `Need help with withdrawals, Google Play redeem codes, or gameplay? Reach out to our support team:\n\n` +
      `👉 Contact: ${SUPPORT_USERNAME}\n` +
      `⏰ Working Hours: 10:00 AM – 8:00 PM IST`;
  } 
  else {
    replyText = `👇 Please use the menu buttons below to navigate:`;
  }

const apiUrl = "https:" + "//api.telegram.org/bot" + 9210572669:AAFVeuGNHweMCdCDW0ai8ezbBBrOEyYMqRM + "/sendMessage";
await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text: replyText,
      parse_mode: "Markdown",
      reply_markup: mainKeyboard
    })
  });

  return res.status(200).end();
}
