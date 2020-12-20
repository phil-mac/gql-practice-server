import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated, isMessageOwner } from './authorization';

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
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { models, me }) => {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      },
    ),
    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, {models}) => {
        return await models.Message.destroy({where: { id }});
      },
    ),  
    updateMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id, text }, { me, models }) => {
        return await models.Message.update({ 
          text,
          userId: me.id
        },{
          where: { id },
        }).then(() => {
          return models.Message.findByPk(id);
        });
      },
    ),
  },
  Message: {
    user: async (message, args, { models }) => {
      return await models.Message.findByPk(message.userId);
    },
  },
};