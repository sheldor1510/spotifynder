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
    topPlaylists: { type: DataTypes.JSON },
    topArtists: { type: DataTypes.JSON },
    topTracks: { type: DataTypes.JSON },
    personalityPrompts: { type: DataTypes.JSON },
    compatibilityScore: { type: DataTypes.FLOAT },
    rejectPile: { type: DataTypes.JSON },
  });

  return User;
};
