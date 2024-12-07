module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    spotifyId: { type: DataTypes.STRING, allowNull: true },
    displayName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    accessToken: { type: DataTypes.STRING },
    topArtists: { type: DataTypes.JSON },
    topTracks: { type: DataTypes.JSON },
    topPlaylists: { type: DataTypes.JSON },
    college: { type: DataTypes.STRING },
    compatibilityScore: { type: DataTypes.FLOAT },
    personalityPrompts: { type: DataTypes.JSON },
  });

  return User;
};
