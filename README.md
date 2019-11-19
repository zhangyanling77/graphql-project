# graphql-project
入门graphql的小实践

## 项目使用技术栈
```javascript
server: 
koa + graphql + mongodb

client:
react hooks + ts
```

## 安装项目依赖

```javascript
server: 
yarn add koa koa-router koa2-cors graphql koa-graphql mongoose

client:
npx create-react-app client --typescript
yarn add antd less less-loader
```
## Server端开发
* 创建server.js
```javascript
  const Koa = require('koa')
  const mount = require('koa-mount')
  const graphqlHTTP = require('koa-graphql')
  const cors = require('koa2-cors') // 解决跨域
  const myGraphQLSchema = require('./schema.js')

  const app = new Koa()

  app.use(cors({
    origin: 'http://localhost:3000', // 来源
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT', 'OPTIONS'] // 允许的方法名
  }))

  app.use(mount('/graphql', graphqlHTTP({
    schema: myGraphQLSchema,
    graphiql: true // 开启graphiql可视化操作ide
  })))


  app.listen(4000, () => {
    console.log('server started on 4000')
  })
```

* 创建schema.js
```javascript
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
```
* 创建model.js 操作数据库
首先连接本地数据库
```bash
cd C:\Program Files\MongoDB\Server\4.2\bin
mongod --dbpath=./data
```

```javascript
let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema

const conn = mongoose.createConnection('mongodb://localhost/graphql')

conn.on('open', () => {
  console.log('数据库连接成功！')
})

conn.on('error', (error) => {
  console.log(error)
})

// 用于定义表结构
const CategorySchema = new Schema({
  name: String
})
// 增删改查
const CategoryModel = conn.model('Category', CategorySchema)

const ProductSchema = new Schema({
  name: String,
  category: {
    type: ObjectId, // 外键
    ref: 'Category'  
  }
})

const ProductModel = conn.model('Product', ProductSchema)


module.exports = {
  CategoryModel,
  ProductModel
}
```
