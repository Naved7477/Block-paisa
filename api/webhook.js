module.exports = async (req, res) => {
  try {
    const BOT_TOKEN = "9210572669:AAFVeuGNHweMCdCDW0ai8ezbBBrOEyYMqRM";
    const WEB_APP_URL = "https:" + "//blockpaisa.vercel.app";
    const SUPPORT_USER = "@Game_Developer07";

    if (req.method !== 'POST') {
      const setupUrl = "https:" + "//api.telegram.org/bot" + 9210572669:AAFVeuGNHweMCdCDW0ai8ezbBBrOEyYMqRM + "/setWebhook?url=" + WEB_APP_URL + "/api/webhook";
      const r = await fetch(setupUrl);
      const data = await r.json();
      return res.status(200).json(data);
    }

    const update = req.body;
    if (!update || !update.message) return res.status(200).end();

    const chatId = update.message.chat.id;
    const text = update.message.text || "";

    const mainKeyboard = {
      keyboard: [
        [{ text: "🎮 Play Game", web_app: { url: WEB_APP_URL } }],
        [{ text: "📜 Transaction History" }, { text: "👥 Refer and Earn" }],
        [{ text: "🎧 Customer Support" }]
      ],
      resize_keyboard: true,
      is_persistent: true
    };

    let replyText = "👇 Use the menu buttons below:";

    if (text.startsWith("/start")) {
      replyText = "🔥 *Welcome to Block Paisa!*\n\n" +
        "🧱 Place blocks, clear lines, and earn points daily!\n" +
        "💰 *10,000 Points = ₹10.00* (Auto-converts at 12:00 AM)\n\n" +
        "👇 Tap *Play Game* below to start earning!";
    } else if (text === "📜 Transaction History") {
      replyText = "📜 *Transaction History*\n\n" +
        "No withdrawals yet. Reach ₹10.00 in the game Wallet to withdraw via UPI or Google Play Redeem Code!";
    } else if (text === "👥 Refer and Earn") {
      const inviteLink = "https:" + "//t.me/BlockPaisaGame_bot?start=" + chatId;
      replyText = "👥 *Refer & Earn Program*\n\n" +
        "Invite just *1 friend* to unlock lifetime withdrawals!\n\n" +
        "🔗 *Your Referral Link:*\n`" + inviteLink + "`";
    } else if (text === "🎧 Customer Support") {
      replyText = "🎧 *Customer Support*\n\n" +
        "Need help? Contact: " + SUPPORT_USER + "\n" +
        "⏰ Hours: 10:00 AM – 8:00 PM IST";
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
  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
};
