import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';


import { Pagination } from 'swiper/modules';
export default function DogSwiper({photo}) {
    console.log(photo)
  return (
    <>
      <Swiper
      mousewheel={true}
        direction={'vertical'}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination]}
        className="mySwiper"
        style={{width: '430px', margin: '5px'}}
      >
        {photo.map((image,index)=><SwiperSlide key ={index} style={{backgroundImage: `url(${image})`,  width: '430px',
    borderRadius: '3px',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'}}></SwiperSlide>)}
      </Swiper>
    </>
  );
}
