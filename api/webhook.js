module.exports = async function handler(req, res) {
if (req.method !== 'POST') {
  const setupUrl = "https:" + "//api.telegram.org/bot8210572669:AAFVeuGHweMCdCW0ai8ezBbR0EyVMqRM/setWebhook?url=https:" + "//blockpaisa.vercel.app/api/webhook";
  const r = await fetch(setupUrl);
  const data = await r.json();
  return res.status(200).json(data);
}
  
  
  const BOT_TOKEN = "9210572669:AAFVeuGNHweMCdCDW0ai8ezbBBrOEyYMqRM"; // Paste your BotFather token here
  const WEB_APP_URL = "https:" + "//blockpaisa.vercel.app";
  const SUPPORT_USERNAME = "@Game_Developer07"; // Paste your Telegram username here

  const update = req.body;
  if (!update || !update.message) return res.status(200).end();

  const chatId = update.message.chat.id;
  const text = update.message.text || "";

  // Persistent Bottom Keyboard (Exactly like screenshot 2)
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
    replyText = "🔥 *Welcome to Block Paisa!*\n\n" +
      "🧱 Place blocks, clear lines, and earn points daily!\n" +
      "💰 *10,000 Points = ₹10.00* (Auto-converts at 12:00 AM)\n\n" +
      "👇 Tap *Play Game* below to start earning!";
  } 
  else if (text === "📜 Transaction History") {
    replyText = "📜 *Transaction History*\n\n" +
      "You have not made any withdrawal requests yet.\n\n" +
      "💡 *Note:* Open the Wallet inside the game to withdraw via UPI or Google Play Redeem Code.";
  } 
  else if (text === "👥 Refer and Earn") {
    const inviteLink = "https:" + "//t.me/BlockPaisaGame_bot?start=" + chatId;
    replyText = "👥 *Refer & Earn Program*\n\n" +
      "Invite just *1 friend* to unlock lifetime withdrawals!\n\n" +
      "🔗 *Your Referral Link:*\n`" + inviteLink + "`";
  } 
  else if (text === "🎧 Customer Support") {
    replyText = "🎧 *Customer Support*\n\n" +
      "Need help with withdrawals or redeem codes? Contact us:\n\n" +
      "👉 Support: " + SUPPORT_USERNAME + "\n" +
      "⏰ Hours: 10:00 AM – 8:00 PM IST";
  } 
  else {
    replyText = "👇 Use the menu buttons below:";
  }

  const apiUrl = "https:" + "//api.telegram.org/bot" +9210572669:AAFVeuGNHweMCdCDW0ai8ezbBBrOEyYMqRM+ "/sendMessage";
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
