const graphql = require('graphql')
const { CategoryModel, ProductModel } = require('./model.js')

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
        resolve(parent){
          return ProductModel.find({ category: parent.id })
        }
      }
    }
  )
})

// 商品查询
const Product = new GraphQLObjectType({
  name: 'Product',
  fields: () => (
    {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      category: {
        type: Category,
        resolve(parent){
          return CategoryModel.findById(parent.category)
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
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args){
        return CategoryModel.findById(args.id)
      }
    },
    getCategories: {
      type: new GraphQLList(Category),
      args: {},
      resolve(parent, args){
        return CategoryModel.find()
      }
    },
    getProduct: {
      type: Product,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args){
        return ProductModel.findById(args.id)
      }
    },
    getProducts: {
      type: new GraphQLList(Product),
      args: {},
      resolv(parent, args){
        return ProductModel.find()
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
        name: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args){
        return CategoryModel.create(args)
      }
    },
    addProduct: {
      type: Product,
      args: {
        name: {
          type: new GraphQLNonNull(GraphQLString)
        },
        category: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      resolve(parent, args){
        return ProductModel.create(args)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})
