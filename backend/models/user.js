module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    spotifyId: { type: DataTypes.STRING, allowNull: true },
    displayName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    accessToken: { type: DataTypes.STRING },
    college: { type: DataTypes.STRING },
    topPlaylists: {type: DataTypes.JSON},
    personalityPrompts: {type: DataTypes.JSON}
  });

  return User;
};
