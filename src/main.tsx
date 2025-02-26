import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './component/Login.tsx';
import Food from './component/DoAn.tsx'
import App from './App.tsx';
import DoHang from './component/DonHang.tsx'
import NhanVien from './component/NhanVien.tsx'
import KhachHang from './component/KhachHang.tsx';
import NuocUong from './component/NuocUong.tsx'
import MonChanMieng from './component/MonChanMieng.tsx'
import {RouterProvider, createBrowserRouter} from 'react-router-dom'
const router = createBrowserRouter([
  {
   path:"/",
   element:<Login/>,
  },
  {
    path:"/page",
    element:<App/>,
    children:[
      {
       path:"DoAn",
       element:<Food/>,
    },
    {
      path:"NuocUong",
      element:<NuocUong/>,
    },
    {
      path:"MonChanMieng",
      element:<MonChanMieng/>
    },
    {
       path:"NhanVien",
       element:<NhanVien/>,
    },
    {
      path:"DonHang",
      element:<DoHang/>,
    },
    {
      path:"KhachHang",
      element:<KhachHang/>,
    },
  ],
  }
])
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>,
)
