export default {
  Query: {
    messages: async (parent, args, { models }) => {
      return await models.Message.findAll();
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPk(id);
    },
  },
  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => {
      return await models.Message.create({
        text,
        userId: me.id,
      });
    },
    deleteMessage: async (parent, { id }, {models}) => {
      return await models.Message.destroy({where: { id }});
    },
    updateMessage: async (parent, { id, text }, { me, models }) => {
      return await models.Message.update({ 
        text,
        userId: me.id
      },{
        where: { id },
      }).then(function (result) {
        return models.Message.findByPk(id);
      });
    }
  },
  Message: {
    user: async (message, args, { models }) => {
      return await models.Message.findByPk(message.userId);
    },
  },
};