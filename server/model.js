let mongoose = require('mongoose')
let ObjectId = mongoose.Schema.Types.ObjectId

const Schema = mongoose.Schema

const conn = mongoose.createConnection('mongodb://localhost/graphql',{ useNewUrlParser: true, useUnifiedTopology: true })

conn.on('open', () => console.log('数据库连接成功！'))

conn.on('error', (error) => console.log(error))

// 用于定义表结构
const CategorySchema = new Schema({
  name: String
})
// 定义model
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
