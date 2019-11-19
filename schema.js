const graphql = require('graphql')
const { CategoryModel, ProductModel } = require('./model.js')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
}  = graphql

// 模拟数据-商品分类
// const categories = [
//   { id: '1', name: '图书' },
//   { id: '2', name: '数码' },
//   { id: '3', name: '服饰' }
// ]
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
          // return products.filter(item => item.category === parent.id)
          return ProductModel.find({ category: parent.id })
        }
      }
    }
  )
})

// 商品查询
// const products = [
//   { id: '1', name: 'koa从入门到放弃', category: '1' },
//   { id: '2', name: '你不知道的JavaScript', category: '1' },
//   { id: '3', name: '佳能K30相机', category: '2' },
//   { id: '4', name: '艾莱依围巾', category: '3' },
//   { id: '5', name: '伊芙丽羽绒服', category: '3' },
//   { id: '6', name: '微前端架构入门', category: '1' },
//   { id: '7', name: 'iPhone XR', category: '2' }
// ]

const Product = new GraphQLObjectType({
  name: 'Product',
  fields: () => (
    {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      category: {
        type: Category,
        resolve(parent){
          // return categories.find(item => item.id === parent.category)
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
        // return categories.find(item => item.id === args.id)
        return CategoryModel.findById(args.id)
      }
    },
    getCategories: {
      type: new GraphQLList(Category),
      args: {},
      resolve(parent, args){
        // return categories
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
        // return products.find(item => item.id === args.id)
        return ProductModel.findById(args.id)
      }
    },
    getProducts: {
      type: new GraphQLList(Product),
      args: {},
      resolv(parent, args){
        // return products
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
        // args.id = categories.length + 1
        // categories.push(args)
        // return args
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
        // args.id = products.length + 1
        // products.push(args)
        // return args
        return ProductModel.create(args)
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: RootMutation
})
