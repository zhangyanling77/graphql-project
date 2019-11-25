import React, {useState} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import AddProduct from './AddProduct';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail'
import { useQuery } from '@apollo/react-hooks';
import { CATEGORIES_PRODUCTS } from './query';
import { Product } from './types'

function App() {
  let [product, setProduct] = useState<Product>()
  const { loading, error, data, refetch, networkStatus } = useQuery(CATEGORIES_PRODUCTS, {
    // skip: !name, // 当某个参数不存在时，跳过该请求
    // pollInterval: 500, // 轮询时间
    notifyOnNetworkStatusChange: true
  })
  if(networkStatus === 4) return <p>重新加载中...</p>
  if(error) return <p>加载发生错误</p>
  if(loading) return <p>加载中...</p>
  // console.log(data) // getCategories,getProducts两个list
  const { getCategories, getProducts } = data

  return (
    <div className='container'>
      <nav className="navbar navbar-inverse navbar-static-top">
        <div className="container-fluid">
          <div className="navbar-header">
            {/* <a className="navbar-brand" href="#">首页</a> */}
            <a href="#" className="navbar-brand" onClick={() => refetch()}>
              <img alt="header" style={{width: 24, height: 24}} 
              src="https://mirror-gold-cdn.xitu.io/168e08be61400b23518?imageView2/1/w/180/h/180/q/85/format/webp/interlace/1"></img>
            </a>
          </div>
        </div>
      </nav>
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
            <div className="panel-heading">
              <p><b>产品详情</b></p>
            </div>
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
