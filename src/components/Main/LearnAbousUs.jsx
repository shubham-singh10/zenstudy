import React, { useMemo } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";

// Reusable hook for slide-up animation
const useSlideUp = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  const style = useSpring({
    from: { y: 100, opacity: 0 },
    to: { y: inView ? 0 : 100, opacity: inView ? 1 : 0 },
    config: { duration: 500 },
  });

  return { ref, style };
};

const InfoBlock = ({ index, title, text, align = "end", isRight }) => {
  const { ref, style } = useSlideUp();

  return (
    <animated.div
      ref={ref}
      style={style}
      className="relative lg:rounded-full md:rounded-full bg-[#fcedfb] flex items-center justify-center min-h-[30vh] lg:w-full md:w-full min-w-[30vw]"
    >
      <div
        className={`absolute lg:top-[-30px] md:top-[-30px] top-[-25px] ${
          isRight ? "lg:right-20 md:right-20 right-4" : "lg:left-20 md:left-20 left-4"
        } lg:text-6xl md:text-6xl text-5xl textPurpleGradient font-semibold`}
      >
        0{index}
      </div>
      <div
        className={`flex flex-col items-${align} lg:px-14 md:px-14 px-6 gap-2 py-5`}
      >
        <p className="textGreenGradient font-semibold lg:text-3xl md:text-2xl text-xl">
          {title}
        </p>
        <p
          className={`lg:w-3/4 md:w-3/4 w-full text-[#5D6169] text-${align} sm:text-sm`}
        >
          {text}
        </p>
        <Link to="/about">
          <button className="custom-btn-2 ">
            <span className="custom-btn-2-bg"></span>
            <span className="custom-btn-2-text">Read More</span>
          </button>
        </Link>
      </div>
    </animated.div>
  );
};

const LearnAbousUs = () => {
  const { ref: titleRef, style: titleStyle } = useSlideUp();

  const sections = useMemo(() => [
    {
      index: 1,
      title: "About Us",
      text:
        "Zenstudy is an innovative educational startup revolutionizing learning through a blend of traditional methods and modern technology...",
      align: "end",
      isRight: false,
    },
    {
      index: 2,
      title: "Our Vision",
      text:
        "To revolutionize education by making learning accessible, inclusive,  and engaging for everyone...",
      align: "start",
      isRight: true,
    },
    {
      index: 3,
      title: "Our Mission",
      text:
        "To create a dynamic and inclusive platform that leverages gamification to enhance learning experiences...",
      align: "end",
      isRight: false,
    },
  ], []);

  return (
    <div className="w-full min-h-[30vh] relative px-4 lg:px-12 mt-20">
      <animated.p
        ref={titleRef}
        style={titleStyle}
        className="text-center py-5 mb-10 text-2xl md:text-3xl lg:text-4xl font-semibold textPurpleGradient"
      >
        Le<span className="border-b-4 border-[#543a5d]">arn About</span> Us
      </animated.p>

      <div className="flex flex-col gap-14 mb-10">
        {sections.map((section) => (
          <InfoBlock key={section.index} {...section} />
        ))}
      </div>
    </div>
  );
};

export default React.memo(LearnAbousUs);
