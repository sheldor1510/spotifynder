module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      spotifyId: { type: DataTypes.STRING, allowNull: false },
      displayName: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING },
      accessToken: { type: DataTypes.STRING },
      college: { type: DataTypes.STRING },
    });
    return User;
  };
  