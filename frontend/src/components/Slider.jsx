import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from 'swiper';
import  { Navigation, Pagination, EffectCoverflow, Autoplay, Mousewheel } from "swiper/modules";

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
SwiperCore.use([Navigation, Pagination, EffectCoverflow, Autoplay, Mousewheel]);

export default function SwiperCoverflow() {
  return (
    <div className={style.main}>
      <div className={style.info}>
        <span>Немного о нас</span>
        <h1>BarkFest</h1>
        <hr />
        <p>На нашем фестивале соберутся ведущие специалисты в области ветеринарии и груминга. Наши профессионалы имеют многолетний опыт и репутацию лучших в своей сфере. Мы гордимся тем, что можем предложить вашим питомцам самое качественное обслуживание.</p>
      </div>
      <Swiper
      mousewheel={true}
        autoplay={{
          "delay": 2500
        }}
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
        modules={[Mousewheel, Pagination]}
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
