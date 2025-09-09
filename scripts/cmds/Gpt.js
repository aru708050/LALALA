const axios = require("axios");

module.exports = {
  config: {
    name: "gpt",
    aliases: ["ai"],
    version: "1.1",
    author: "",
    countDown: 5,
    role: 0,
    shortDescription: "Chat with GPT API",
    longDescription: "",
    category: "ai",
    guide: {
      en: "{pn} <your question>\n{pn} set <modelName>"
    }
  },

  selectedModel: "gpt-5",

  onStart: async function () {},

  onChat: async function ({ event, message }) {
    const { threadID, body } = event;
    if (!body) return;

    const prefix = global.GoatBot.config.prefix || "-";
    if (
      !body.startsWith(prefix + "chatgpt") &&
      !body.startsWith(prefix + "gpt") &&
      !body.startsWith(prefix + "ai")
    ) return;

    const args = body.trim().split(" ").slice(1);
    if (!args.length) return message.reply("❌ Please provide a prompt or use `set <model>`.");

    if (args[0].toLowerCase() === "set") {
      if (!args[1]) return message.reply("⚠️ Please provide a model name.");
      this.selectedModel = args[1];
      return message.reply(`✅ Model set to **${this.selectedModel}**`);
    }

    const prompt = args.join(" ");

    try {
      const res = await axios.get("https://api.oculux.xyz/api/openai", {
        params: {
          prompt,
          chatId: threadID,
          model: this.selectedModel,
          system: "You are a helpful assistant."
        }
      });

      const answer = res.data.response || "⚠️ No response from API.";
      message.reply(answer);
    } catch (err) {
      console.error(err);
      message.reply("❌ Error while contacting the API.");
    }
  },

  onReply: async function ({ message, args }) {
    const prompt = args.join(" ");
    if (!prompt) return message.reply("❌ Please provide a prompt.");

    try {
      const res = await axios.get("https://api.oculux.xyz/api/openai", {
        params: {
          prompt,
          chatId: message.threadID,
          model: this.selectedModel,
          system: "You are a helpful assistant."
        }
      });

      const answer = res.data.response || "⚠️ No response from API.";
      message.reply(answer);
    } catch (err) {
      console.error(err);
      message.reply("❌ Error while contacting the API.");
    }
  }
};