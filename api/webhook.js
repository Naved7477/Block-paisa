module.exports = async (req, res) => {
  try {
    const BOT_TOKEN = "9210572669:AAHqs5I4NPJoV0x-FWYx_BQlSiQMfX2payw";
    const DB_URL = "https:" + "//block-paisa-default-rtdb.asia-southeast1.firebasedatabase.app";
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

    const chatId = String(update.message.chat.id);
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

    let replyText = "👇 Please use the menu buttons below:";

    if (text.startsWith("/start")) {
      const parts = text.split(" ");
      const referrerId = parts.length > 1 ? parts.trim() : null;

      // Check if user exists in Firebase
      const userRes = await fetch(DB_URL + "/users/" + chatId + ".json");
      const userData = await userRes.json();

      if (!userData) {
        // New user registration
        await fetch(DB_URL + "/users/" + chatId + ".json", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            wallet: 0,
            referrals: 0,
            firstWithdrawDone: false,
            referredBy: referrerId || ""
          })
        });

        // Credit referral to inviter (if valid & not self)
        if (referrerId && referrerId !== chatId) {
          const refRes = await fetch(DB_URL + "/users/" + referrerId + ".json");
          const refData = await refRes.json();
          if (refData) {
            const newRefs = (refData.referrals || 0) + 1;
            await fetch(DB_URL + "/users/" + referrerId + ".json", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ referrals: newRefs })
            });
          }
        }
      }

      replyText = "🔥 *Welcome to Block Paisa!*\n\n" +
        "🧱 Place blocks, clear lines, and earn real rewards!\n" +
        "💰 *1,000 Points = ₹1.00* (Instant Wallet Conversion)\n\n" +
        "👇 Tap *Play Game* below to start playing!";
    } 
    else if (text === "📜 Transaction History") {
      const txRes = await fetch(DB_URL + "/withdrawals/" + chatId + ".json");
      const txData = await txRes.json();

      if (!txData) {
        replyText = "📜 *Transaction History*\n\n" +
          "You have not made any withdrawal requests yet.\n\n" +
          "💡 *Tip:* Reach ₹10.00 in the game Wallet to request your first payout!";
      } else {
        const list = Object.values(txData).slice(-5).reverse();
        replyText = "📜 *Last 5 Withdrawals:*\n\n" + list.map((item, idx) =>
          (idx + 1) + ". *₹" + item.amount + "* (" + item.method + ")\n" +
          "   Details: `" + item.detail + "`\n" +
          "   Status: *" + item.status + "*"
        ).join("\n\n");
      }
    } 
    else if (text === "👥 Refer and Earn") {
      const uRes = await fetch(DB_URL + "/users/" + chatId + ".json");
      const uData = await uRes.json();
      const refs = (uData && uData.referrals) || 0;
      const inviteLink = "https:" + "//t.me/BlockPaisaGame_bot?start=" + chatId;

      replyText = "👥 *Refer & Earn Program*\n\n" +
        "Invite just *1 friend* to unlock lifetime withdrawals!\n\n" +
        "✅ *Your Valid Referrals:* " + refs + "/1\n\n" +
        "🔗 *Your Referral Link:*\n`" + inviteLink + "`";
    } 
    else if (text === "🎧 Customer Support") {
      replyText = "🎧 *Customer Support*\n\n" +
        "Need help with withdrawals or Google Play redeem codes?\n\n" +
        "👉 Contact: " + SUPPORT_USER + "\n" +
        "⏰ Hours: 10:00 AM – 8:00 PM IST";
    }

    const apiUrl = "https:" + "//api.telegram.org/bot" + 9210572669:AAHqs5I4NPJoV0x-FWYx_BQlSiQMfX2payw + "/sendMessage";
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
