import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from 'swiper';
import  { Navigation, Pagination, EffectCoverflow } from "swiper/modules";

import "swiper/css";
import "swiper/css/effect-coverflow";
import style from './Slider.module.css';

import image_1 from '../assets/image/img_1.jpg'
import image_2 from '../assets/image/img_2.jpg'
import image_3 from '../assets/image/img_3.jpg'
import image_4 from '../assets/image/img_4.jpg'
import image_5 from '../assets/image/img_5.jpg'
import image_6 from '../assets/image/img_6.jpg'
import image_7 from '../assets/image/img_7.jpg'
import image_8 from '../assets/image/img_8.jpg'
SwiperCore.use([Navigation, Pagination, EffectCoverflow]);

export default function SwiperCoverflow() {
  return (
    <div className={style.main}>
      <div className={style.info}>
        <span>Немного о нас</span>
        <h1>BarkFest</h1>
        <hr />
        <p></p>
      </div>
      <Swiper
        navigation
        pagination={{ clickable: true }}
        effect="coverflow"
        coverflowEffect={{
          rotate: 5,
          stretch: 2,
          depth: 100,
          modifier: 2,
          slideShadows: true
        }}
        slidesPerView={2}
        centeredSlides
        style={{ width: '650px', height: "500px", margin:'auto' }}
      >
        <SwiperSlide
          style={{
            backgroundImage:
              `url(${image_1})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: '5px',
          }}
        >
        </SwiperSlide>
        <SwiperSlide
          style={{
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: '5px',
            backgroundImage:
              `url(${image_2})`
          }}
        >
        </SwiperSlide>
        <SwiperSlide
          style={{
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: '5px',
            backgroundImage:
              `url(${image_3})`
          }}
        >
        </SwiperSlide>
        <SwiperSlide
          style={{
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: '5px',
            backgroundImage:
              `url(${image_4})`
          }}
        >
        </SwiperSlide>
        <SwiperSlide
          style={{
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: '5px',
            backgroundImage:
              `url(${image_5})`
          }}
        >
        </SwiperSlide>
        <SwiperSlide
          style={{
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: '5px',
            backgroundImage:
              `url(${image_6})`
          }}
        >
        </SwiperSlide>
        <SwiperSlide
          style={{
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: '5px',
            backgroundImage:
              `url(${image_7})`
          }}
        >
        </SwiperSlide>
        <SwiperSlide
          style={{
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            borderRadius: '5px',
            backgroundImage:
              `url(${image_8})`
          }}
        >
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
