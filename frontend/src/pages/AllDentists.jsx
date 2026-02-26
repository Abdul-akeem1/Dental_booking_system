import React from 'react'
import Navbar from '../components/layout/Navbar'
import SpecialityMenu from '../components/layout/SpecialityMenu'
import TopDentists from '../components/layout/TopDentists'
/*import Banner from '../components/Banner'*/

const AllDentists = () => {
  return (
    <div>
      <Navbar />
      <SpecialityMenu />
      <TopDentists />
    </div>
  )
}

export default AllDentists