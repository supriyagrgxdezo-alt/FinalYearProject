import React from 'react'
import HomeCategoryTable from './HomeCategoryTable'
import { useAppSelector } from '../../Redux Toolkit/store';

const image =
  "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/DECEMBER/18/6e7f9UBl_a84150b889ce434f92663ab84a7ee432.jpg";
const ClothesTable = () => {
   const homeCategories = useAppSelector(
        (store) => store.homeCategory.homeCategories,
      );
  return (
    <>
      <HomeCategoryTable categories={homeCategories?.CLOTHES_CATEGORIES}/>
    </>
  )
}

export default ClothesTable
