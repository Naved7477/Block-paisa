export default async function handler(req, res) {
  try {
    const BOT_TOKEN = process.env.BOT_TOKEN;
    const DB_URL = "https:" + "//block-paisa-default-rtdb.asia-southeast1.firebasedatabase.app";
    const WEB_APP_URL = "https:" + "//blockpaisa.vercel.app";
    const ADMIN_ID = "8219259239";
    const SUPPORT_USER = "@Game\\_Developer07";

    if (!BOT_TOKEN) {
      return res.status(200).json({ error: "BOT_TOKEN not found in Vercel Environment Variables" });
    }

    if (req.method !== "POST") {
      const setupUrl = "https:" + "//api.telegram.org/bot" + BOT_TOKEN + "/setWebhook?url=" + WEB_APP_URL + "/api/webhook";
      const r = await fetch(setupUrl);
      const data = await r.json();
      return res.status(200).json(data);
    }

    const body = req.body || {};

    if (body.type === "WITHDRAW_ALERT") {
      const alertText = "🚨 *New Withdrawal Request!*\n\n" +
        "👤 User: " + body.name + " (`" + body.userId + "`)\n" +
        "💰 Amount: *₹" + body.amount + "*\n" +
        "💳 Method: *" + body.method + "*\n" +
        "📩 Details: `" + body.detail + "`";

      await fetch("https:" + "//api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: ADMIN_ID, text: alertText, parse_mode: "Markdown" })
      });
      return res.status(200).json({ ok: true });
    }

    if (!body.message) return res.status(200).end();

    const chatId = String(body.message.chat.id);
    const text = body.message.text || "";

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

      const userRes = await fetch(DB_URL + "/users/" + chatId + ".json");
      const userData = await userRes.json();

      if (!userData) {
        await fetch(DB_URL + "/users/" + chatId + ".json", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ wallet: 0, referrals: 0, firstWithdrawDone: false, referredBy: referrerId || "" })
        });

        if (referrerId && referrerId !== chatId) {
          const refRes = await fetch(DB_URL + "/users/" + referrerId + ".json");
          const refData = await refRes.json();
          if (refData) {
            await fetch(DB_URL + "/users/" + referrerId + ".json", {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ referrals: (refData.referrals || 0) + 1 })
            });
          }
        }
      }

      replyText = "🔥 *Welcome to Block Paisa!*\n\n" +
        "🧱 Place blocks, clear lines, and earn real rewards!\n" +
        "💰 *1,000 Points = ₹1.00* (Instant Cloud Save)\n\n" +
        "👇 Tap *Play Game* below to start playing!";
    } 
    else if (text === "📜 Transaction History") {
      const txRes = await fetch(DB_URL + "/withdrawals/" + chatId + ".json");
      const txData = await txRes.json();
      if (!txData) {
        replyText = "📜 *Transaction History*\n\nNo withdrawals yet. Reach ₹10.00 in the game Wallet to withdraw!";
      } else {
        const list = Object.values(txData).slice(-5).reverse();
        replyText = "📜 *Last 5 Withdrawals:*\n\n" + list.map((item, idx) =>
          (idx + 1) + ". *₹" + item.amount + "* (" + item.method + ") - *" + item.status + "*"
        ).join("\n");
      }
    } 
    else if (text === "👥 Refer and Earn") {
      const uRes = await fetch(DB_URL + "/users/" + chatId + ".json");
      const uData = await uRes.json();
      const refs = (uData && uData.referrals) || 0;
      const inviteLink = "https:" + "//t.me/BlockPaisaGame_bot?start=" + chatId;
      replyText = "👥 *Refer & Earn*\n\nInvite *1 friend* to unlock withdrawals!\n✅ Referrals: *" + refs + "/1*\n\n🔗 Link:\n`" + inviteLink + "`";
    } 
    else if (text === "🎧 Customer Support") {
      replyText = "🎧 *Customer Support*\n\nContact: " + SUPPORT_USER + "\n⏰ Hours: 10:00 AM – 8:00 PM IST";
    }

    await fetch("https:" + "//api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: replyText, parse_mode: "Markdown", reply_markup: mainKeyboard })
    });

    return res.status(200).end();
  } catch (err) {
    return res.status(200).json({ error: err.message });
  }
}
