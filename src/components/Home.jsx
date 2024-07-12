import React from 'react'
import Carousel from './Carousel'
import CourseCarousel from './CourseCarousel'
import ExploreArticles from './ExploreArticles '


const Home = () => {
    return (
        <div>
            <Carousel />
            <div className="flex flex-col md:flex-row items-center justify-between mt-8 px-4 md:px-16">
                <div className="text-section md:w-1/2 mb-4 md:mb-0">
                    <h2 className="text-2xl font-bold mb-4"><span className='text-[#5D6169]'>Welcome To</span><span className='text-[#054BB4]'> ZenStudy</span></h2>
                    <h1 className="text-4xl font-bold mb-4"><span className='text-[#5D6169]'>Making</span><span className='text-[#054BB4]'> Education</span><span className='text-[#5D6169]'> Imaginative</span></h1>
                    <p className="text-[#5D6169]">
                        Zenstudy makes learning engaging with 3D models, animations, and AI. Focused on UPSC prep, we aim to expand into other competitive exams, college education, and K12 content.
                    </p>
                    <div className='mt-9'>
                        <button className='rounded-full bg-[#054BB4] text-[#ffffff] px-6 py-2 font-medium mr-5'>Explore Courses</button>
                        <button className='rounded-full border-2  border-solid border-[#054BB4] text-[#054BB4] px-6 py-2 font-medium'>Watch Videos</button>
                    </div>
                </div>
                <div className="image-section md:w-1/2">
                    <img
                        src="https://flowbite.com/docs/images/carousel/carousel-2.svg"
                        alt="Description of the"
                        className="w-full h-85 rounded-lg"
                    />
                </div>
            </div>
            <div className='mt-20'>
                <h1 className='text-5xl mb-10 text-center text-[#054BB4] font-semibold'>Re<span className='border-b-8 border-[#054BB4]'>cently Added Cours</span>es</h1>
                <CourseCarousel />
            </div>
            <ExploreArticles/>
        </div>
    )
}


export default Home