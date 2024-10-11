module.exports = formatMsg = (username, message) => {
  return {
    username: username,
    message: message,
    sent_at: Date.now(),
  };
};
