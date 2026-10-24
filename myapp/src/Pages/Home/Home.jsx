
import BestSellerComponent from "../../Components/Swiper/BestSellerComponent";
import WomanFragrances from "../../Components/WomenFrag/WomenFrag";
import MenFragrances from "../../Components/MenFrag/MenFrag";
import UnisexFragrances from "../../Components/UnisexFrag/UnisexFrag";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
const images = [
  {
    img:  "https://cdn.files.salla.network/homepage/1934736234/ebe10c34-202a-4eba-a502-ff3ff3960e91_1440x480.webp",

  }
  ,
  {
    img: "https://cdn.files.salla.network/homepage/1934736234/27f7ca0f-6394-4a97-9b3b-a9ed98bca9d6_1440x480.webp",

  }
];

export default function Home() {

  return (
    <main className="w-full">

 



  <div className="w-full overflow-hidden">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          className="w-full"
        >
          {images.map((item, index) => (
            <SwiperSlide key={index}>
              <img
                src={item.img}
                alt={`Banner ${index + 1}`}
                className="block w-full h-auto object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>



    <BestSellerComponent/>
          <WomanFragrances/>
          <MenFragrances/>
 <UnisexFragrances/> 
 
    </main>
  );
}
