import React, { useEffect } from 'react'
import Navbar from '../../Common/Navbar'
import AdminDrawerList from '../Sidebar/AdminDrawerList'
import AdminRoutes from '../../routes/AdminRoutes'
import { useAppDispatch } from '../../Redux Toolkit/store'
import { fetchHomeCategory } from '../../Redux Toolkit/features/Admin/AdminSlice'

const Dashboard = () => {
  const dispatch = useAppDispatch();

  return (
    <div className='min-h-screen'>
      <Navbar DrawerList={AdminDrawerList}/>
      <section className='lg:flex lg:h-[90vh]'>
        <div className='hidden lg:block h-full'>
            <AdminDrawerList/>
        </div>
        <div className='p-10 w-full lg:w-[80%] overflow-auto'>
            <AdminRoutes/>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
