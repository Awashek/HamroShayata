import React from 'react'

const Category = () => {
  return (
    <div className="container mx-auto px-8 lg:px-16 ">
      <h1 className="text-3xl font-semibold text-center mb-4 mt-4 text-slate-700">
        Campaigns Available for Donation
      </h1>
      <div className="flex flex-wrap justify-center items-center gap-3 h-full pb-4">
        <button className='btns w-full sm:w-auto'>Charity</button>
        <button className='btns w-full sm:w-auto'>Animals</button>
        <button className='btns w-full sm:w-auto'>Medical</button>
        <button className='btns w-full sm:w-auto'>Personal</button>
      </div>

    </div>
  )
}

export default Category