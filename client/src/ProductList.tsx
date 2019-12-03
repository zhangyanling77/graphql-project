import React from 'react';
import { Product } from './types'

interface Props {
  products: Array<Product>;
  setProduct: any;
}
// 产品列表
function ProductList(props: Props){
  if(!props.products) return <p>暂无数据</p>
  return (
    <>
      <table className="table table-striped">
        <caption className="text-center">产品列表</caption>
        <thead>
          <tr>
            <td>名称</td>
            <td>分类</td>
            <td>操作</td>
          </tr>
        </thead>
        <tbody>
          {
            props.products.map((item: Product, index:number) => (
              <tr key={item.id} onClick={() => props.setProduct(item)}>
                <td>{item.name}</td>
                <td>{item.category!.name}</td>
                <td><a href="#">修改</a> | <a href="#" style={{color: 'red'}}>删除</a></td>
              </tr>
            ))
          }
        </tbody>
      </table>
     <ul className="pagination">
        <li className="page-item disabled">
          <a className="page-link" href="#" aria-disabled="true">Previous</a>
        </li>
        <li className="page-item"><a className="page-link" href="#">1</a></li>
        <li className="page-item"><a className="page-link" href="#">2</a></li>
        <li className="page-item"><a className="page-link" href="#">3</a></li>
        <li className="page-item">
          <a className="page-link" href="#">Next</a>
        </li>
      </ul>
    </>
  )
}

export default ProductList
