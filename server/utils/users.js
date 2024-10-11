const users = [];
exports.saveuser = (id, username, room) => {
  const user = {
    id: id,
    username: username,
    room: room,
  };
  users.push(user);
  return user;
};

exports.getdisconnectUser = (id) => {
  const dcuser = users.findIndex((user) => user.id === id);
  if (dcuser !== -1) {
    return users.splice(dcuser, 1)[0];
    //If a matching user is found, splice is used to remove that user from the users array. The splice method returns an array containing the removed element(s ).
  }
  return null;
};

exports.getsameRoomusers = (room) => {
  return users.filter((user) => user.room === room);
};
