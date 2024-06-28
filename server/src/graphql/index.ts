import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLResolverMap } from 'apollo-graphql';
import { GraphQLSchema } from 'graphql';
import { importSchema } from 'graphql-import';
import { merge } from 'lodash'

import {shoesResolvers, storeResolvers, orderHistoryResolvers} from '../resolvers/index'

const shoeTypeDefs = importSchema(`${__dirname}/Shoe.graphql`);
const storeTypeDefs = importSchema(`${__dirname}/Store.graphql`);
const orderHistoryTypeDefs = importSchema(`${__dirname}/OrderHistory.graphql`);

const mergedResolvers = merge(
  shoesResolvers,
  storeResolvers,
  orderHistoryResolvers
) as GraphQLResolverMap<any>;


const typeDefs = [
  storeTypeDefs,
  shoeTypeDefs,
  orderHistoryTypeDefs,
].join('\n');


const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs,
  resolvers: mergedResolvers,
});

export default schema;
