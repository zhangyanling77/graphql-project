import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap';
import AddProduct from './AddProduct';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail'
import { useQuery } from '@apollo/react-hooks';
import { CATEGORIES_PRODUCTS } from './query';
import { Product } from './types'

function App() {
  let [product, setProduct] = useState<Product>()
  const { loading, error, data } = useQuery(CATEGORIES_PRODUCTS)
  if(error){
    return <p>加载发生错误</p>
  }
  if(loading){
    return <p>加载中...</p>
  }
  console.log(data) // getCategories,getProducts两个list
  const { getCategories, getProducts } = data

  return (
    <div className='container'>
      <div className='row'>
        <div className='col-md-6'>
          <div className="panel panel-default">
            <div className="panel-heading">
              <AddProduct categories={getCategories} />
            </div>
            <div className="panel-body">
              <ProductList products={getProducts} setProduct={setProduct}/>
            </div>
          </div>
        </div>
        <div className='col-md-6'>
          <div className="panel panel-default">
            <div className="panel-body">
              <ProductDetail product={product} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App