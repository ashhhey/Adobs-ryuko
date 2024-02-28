const axios = require('axios');
const cron = require('node-cron');

module.exports = async ({ api }) => {
  const messagedThreads = new Set();

  async function sendMessage(body, threadID) {
    try {
      await api.sendMessage({ body }, threadID);
      messagedThreads.add(threadID);
    } catch (error) {
      console.error("Error sending a message:", error);
    }
  }

  async function sendMotivation() {
    try {
      const quoteResponse = await axios.get('https://api.quotable.io/random');
      const quote = quoteResponse.data.content;
      const formattedQuoteMessage = `
🔔 𝖣𝖺𝗂𝗅𝗒 𝖬𝗈𝗍𝗂𝗏𝖺𝗍𝗂𝗈𝗇!

${quote}

- ${quoteResponse.data.author}
`;
      const threads = await api.getThreadList(25, null, ['INBOX']);
      let i = 0;
      let j = 0;

      while (j < 20 && i < threads.length) {
        const thread = threads[i];
        if (thread.isGroup && thread.name !== thread.threadID && !messagedThreads.has(thread.threadID)) {
          await sendMessage(formattedQuoteMessage, thread.threadID);
          j++;
          const currentThreadID = thread.threadID;
          setTimeout(() => {
            messagedThreads.delete(currentThreadID);
          }, 1000);
        }
        i++;
      }
    } catch (error) {
      console.error("Error sending motivation:", error);
    }
  }

  async function sendBibleVerse() {
    try {
      const verseResponse = await axios.get('https://labs.bible.org/api/?passage=random&type=json');
      const verse = verseResponse.data[0];
      const formattedVerseMessage = `
🔔 𝖣𝖺𝗂𝗅𝗒 𝖡𝗂𝖻𝗅𝖾 𝖵𝖾𝗋𝗌𝖾:

${verse.text}

- ${verse.bookname} ${verse.chapter}:${verse.verse}
`;
      const threads = await api.getThreadList(25, null, ['INBOX']);
      let i = 0;
      let j = 0;

      while (j < 20 && i < threads.length) {
        const thread = threads[i];
        if (thread.isGroup && thread.name !== thread.threadID && !messagedThreads.has(thread.threadID)) {
          await sendMessage(formattedVerseMessage, thread.threadID);
          j++;
          const currentThreadID = thread.threadID;
          setTimeout(() => {
            messagedThreads.delete(currentThreadID);
          }, 1000);
        }
        i++;
      }
    } catch (error) {
      console.error("Error sending Bible verse:", error);
    }
  }



  // Schedule to send motivation every 30 minutes
  cron.schedule('*/30 * * * *', sendMotivation, {
    scheduled: false,
    timezone: "Asia/Manila"
  });

  // Schedule to send Bible verse every day
  cron.schedule('*/30 * * * *', sendBibleVerse, {
    scheduled: true,
    timezone: "Asia/Manila"
  });
};
