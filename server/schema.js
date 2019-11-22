const graphql = require('graphql')
const { CategoryModel, ProductModel } = require('./model')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
}  = graphql

// 商品分类查询对象
const Category = new GraphQLObjectType({
  name: 'Category',
  fields: () => (
    {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      products: {
        type: new GraphQLList(Product),
        async resolve(parent){
          let result = await ProductModel.find({ category: parent.id })
          return result
        }
      }
    }
  )
})

const Product = new GraphQLObjectType({
  name: 'Product',
  fields: () => (
    {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      category: {
        type: Category,
        async resolve(parent){
          let result = await CategoryModel.findById(parent.category)
          return result
        }
      }
    }
  )
})

// 根查询对象
const RootQuery = new GraphQLObjectType({
  name: 'RootQuery',
  fields: {
    getCategory: { // 子查询
      type: Category,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args){
        let result = await CategoryModel.findById(args.id)
        return result
      }
    },
    getCategories: {
      type: new GraphQLList(Category),
      args: {},
      async resolve(parent, args){
        let result = await CategoryModel.find()
        return result
      }
    },
    getProduct: {
      type: Product,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args){
        let result = await ProductModel.findById(args.id)
        return result 
      }
    },
    getProducts: {
      type: new GraphQLList(Product),
      args: {},
      async resolve(parent, args){
        let result = await ProductModel.find()
        return result 
      }
    }
  }
})

const RootMutation = new GraphQLObjectType({
  name: 'RootMutation',
  fields: {
    addCategory: {
      type: Category,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args){
        let result = await CategoryModel.create(args)
        return result  
      }
    },
    addProduct: {
      type: Product,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        category: { type: new GraphQLNonNull(GraphQLString) }
      },
      async resolve(parent, args){
        let result = await ProductModel.create(args)
        return result 
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})
