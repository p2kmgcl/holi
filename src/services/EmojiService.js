let emojis = [];

export const EmojiService = {
  async init() {
    emojis = await fetch('/dependencies/emojilib-2.4.0.json')
      .then((response) => response.json())
      .then((json) =>
        Object.entries(json).map(([key, value]) => ({
          key,
          char: value.char,
          keywords: value.keywords,
        }))
      );
  },

  async getFromText(text) {
    const emoji =
      emojis.find((emoji) => emoji.key === text) ||
      emojis.find((emoji) => emoji.keywords.includes(text)) ||
      emojis.find((emoji) =>
        emoji.keywords.some((keyword) => keyword.includes(text))
      );

    return emoji?.char ?? '';
  },
};
