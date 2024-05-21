import React from "react";
import styles from "./Testimonials.module.scss";
import img1 from "../../assets/Images/testimonial1.png"
import img2 from "../../assets/Images/testimonial2.png"
import img3 from "../../assets/Images/testimonial3.png"
import img4 from "../../assets/Images/testimonial4.png"
const list = [
  {
    name: "Emma Stone",
    details: "I did not even need help from an agent ! This is very good.",
    imgUrl:
      img1,
  },
  {
    name: "Chris Evans",
    details:
      "You are doing a great job. Proud to be a customer of Policybazaar.",
    imgUrl:
      img2,
  },
  {
    name: "Elle Fanning",
    details:
      "The services provided by CybSure are extremely helpful in making the right choice. Overall I had a good experience with Cybsure.",
    imgUrl:
      img3,
  },
  {
    name: "Ana De Armas",
    details:
      "Thanking you very much for your support for getting our policy quickly, I would appreciate your work.",
    imgUrl:
      img4,
  },
];
const Testimonials = () => {
  return (
    <div className={styles["main-container"]}>
      <div className={styles["title"]}>What our customers are saying </div>
      <div className={styles["cards-container"]}>
        {list.map((item) => (
          <div className={styles["card"]} key={item.imgUrl}>
            <div className={styles["img-container"]}>
              <img src={item.imgUrl} />
            </div>
            <div className={styles["details"]}>
              <p>{item.name}</p>
              <p>{item.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
