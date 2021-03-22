let emojisPromise = Promise.resolve([]);

export const EmojiService = {
  async init() {
    emojisPromise = fetch('/dependencies/emojilib-2.4.0.json')
      .then((response) => response.json())
      .then((json) => {
        return Object.entries(json).map(([key, value]) => ({
          key,
          char: value.char,
          keywords: value.keywords,
        }))
      });
  },

  async getFromText(text) {
    const emojis = await emojisPromise;

    const emoji =
      emojis.find((emoji) => emoji.key === text) ||
      emojis.find((emoji) => emoji.keywords.includes(text)) ||
      emojis.find((emoji) =>
        emoji.keywords.some((keyword) => keyword.includes(text))
      );

    return emoji?.char ?? '';
  },
};
