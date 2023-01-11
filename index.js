const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");
const { EditPhotoHandler } = require("./feature/edit_foto");
const { ChatAIHandler } = require("./feature/chat_ai");

const client = new Client({
  authStrategy: new LocalAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", async (msg) => {
  const text = msg.body.toLowerCase() || "";

  //check status
  if (text === "!ping") {
    msg.reply("pong");
  }

  //image to sticker
  if (text === "#sticker") {
    const media = await msg.downloadMedia();
    client.sendMessage(msg.from, media, {
      sendMediaAsSticker: true,
      stickerAuthor: "Draco",
      stickerName: "draco",
    });
  }

  // #edit_bg/bg_color
  if (text.includes("#edit_bg/")) {
    await EditPhotoHandler(text, msg);
  }
  // #ask/question?
  if (text.includes("#ask/")) {
    await ChatAIHandler(text, msg);
  }
});

client.initialize();
