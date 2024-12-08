// backend/models/Chat.js

module.exports = (sequelize, DataTypes) => {
    const Chat = sequelize.define('Chat', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        match_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Matches',
                key: 'id'
            }
        },
        conversation_history: {
            type: DataTypes.JSON,  // Storing chat history in JSON format
            allowNull: false,
            defaultValue: []
        }
    });
  
    return Chat;
};

