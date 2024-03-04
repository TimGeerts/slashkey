 const Emoji = {
    Tank: '🛡️',
    Healer: '🇨🇭',
    Dps: '⚔️'
  }

module.exports = { 
    getEmojiForRole: (role) => {
      return Emoji[role];
    },
    getRoleForEmoji: (emoji) => {
      return Object.keys(Emoji).find(k => Emoji[k] === emoji)
    }
}