import React from 'react'
import HomeCategoryCard from './HomeCategoryCard'
import { useAppSelector } from '../../../../../Redux Toolkit/store';

const HomeCategory = () => {
   const categories = useAppSelector(
     (store) => store.homeCategory.homeCategories?.SHOP_BY_CATEGORIES,
   );
   console.log("Categories:", categories);
  return (
    <div className="flex justify-center gap-7 flex-wrap">
      {categories.map((item) => (
        <HomeCategoryCard item={item} />
      ))}
    </div>
  );
}

export default HomeCategory
