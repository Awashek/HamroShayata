import React from 'react'

export default function Category() {
    return (
        <div>
            <h1 className='p-4 text-4xl text-center font-semibold'>Fundraising Categories</h1>
            <div className='flex flex-row justify-center'>
                <button className='btns bg-red-300'>Medical</button>
                <button className='btns'>Personal</button>
                <button className='btns'>Campaign</button>
                <button className='btns'>Animals</button>
            </div>
            <div className='p-20'>
            </div>
        </div>
    )
}
