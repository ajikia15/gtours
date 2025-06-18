"use client";
import React, {
  useCallback,
  useMemo,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  EmblaOptionsType,
  EmblaCarouselType,
  EmblaEventType,
} from "embla-carousel";
import {
  DotButton,
  useDotButton,
} from "@/components/carousel/EmblaCarouselDotButton";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { isMobile } from "@/lib/isMobile";

type SlideContent = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  buttonText: string;
  href: string;
};

type PropType = {
  slides?: number[];
  options?: EmblaOptionsType;
};

const TWEEN_FACTOR_BASE = 0.1;

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const [mobile, setMobile] = useState(false);
  // Modify options for mobile - disable interaction
  const carouselOptions = useMemo(() => {
    if (mobile) {
      return {
        ...options,
        watchDrag: false, // Disable drag on mobile
        watchSlides: false, // Disable slide watching
        watchResize: false, // Disable resize watching
        dragFree: false, // Disable free drag
        startIndex: 0, // Always start at first slide
      };
    }
    return options;
  }, [options, mobile]);

  // Only use autoplay on non-mobile devices
  const autoplay = useMemo(() => (mobile ? null : Autoplay()), [mobile]);
  const [emblaRef, emblaApi] = useEmblaCarousel(
    carouselOptions,
    autoplay ? [autoplay] : []
  );

  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);
  const animationId = useRef<number | null>(null);

  // Check for mobile device
  useEffect(() => {
    const userAgent = navigator.userAgent || "";
    const isMobileDevice = isMobile(userAgent);
    setMobile(isMobileDevice);
  }, []);
  // Define slide content with Georgian tours theme
  const slideContent: SlideContent[] = [
    {
      id: 0,
      image: "https://picsum.photos/800/600?random=1",
      title: "Discover Georgia",
      subtitle: "Book Your Adventure Now",
      buttonText: "Book Now",
      href: "/destinations",
    },
    {
      id: 1,
      image: "https://picsum.photos/800/600?random=2",
      title: "Explore Georgia",
      subtitle: "Discover Amazing Destinations",
      buttonText: "Explore",
      href: "/destinations",
    },
    {
      id: 2,
      image: "https://picsum.photos/800/600?random=3",
      title: "Read Our Stories",
      subtitle: "Get Inspired by Travel Tales",
      buttonText: "Blog",
      href: "/blog",
    },
    {
      id: 3,
      image: "https://picsum.photos/800/600?random=4",
      title: "About Our Company",
      subtitle: "Learn More About Us",
      buttonText: "About Us",
      href: "/about",
    },
    {
      id: 4,
      image: "https://picsum.photos/800/600?random=5",
      title: "Get in Touch",
      subtitle: "Contact Us for More Information",
      buttonText: "Contact",
      href: "/contact",
    },
  ];

  const actualSlides = slides || [0, 1, 2, 3, 4];

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector(".embla__parallax__layer") as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);
  const tweenParallax = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      // Skip parallax effect on mobile for better performance
      if (mobile) return;

      // Cancel any pending animation frame
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }

      // Use requestAnimationFrame for smoother performance
      animationId.current = requestAnimationFrame(() => {
        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();
        const slidesInView = emblaApi.slidesInView();
        const isScrollEvent = eventName === "scroll";

        emblaApi.scrollSnapList().forEach((scrollSnap, snapIndex) => {
          let diffToTarget = scrollSnap - scrollProgress;
          const slidesInSnap = engine.slideRegistry[snapIndex];

          slidesInSnap.forEach((slideIndex) => {
            if (isScrollEvent && !slidesInView.includes(slideIndex)) return;

            if (engine.options.loop) {
              engine.slideLooper.loopPoints.forEach((loopItem) => {
                const target = loopItem.target();

                if (slideIndex === loopItem.index && target !== 0) {
                  const sign = Math.sign(target);

                  if (sign === -1) {
                    diffToTarget = scrollSnap - (1 + scrollProgress);
                  }
                  if (sign === 1) {
                    diffToTarget = scrollSnap + (1 - scrollProgress);
                  }
                }
              });
            }

            const translate = diffToTarget * (-1 * tweenFactor.current) * 100;
            const tweenNode = tweenNodes.current[slideIndex];
            if (tweenNode) {
              // Use translate3d for better GPU acceleration
              tweenNode.style.transform = `translate3d(${translate}%, 0, 0)`;
            }
          });
        });
      });
    },
    [mobile]
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on("reInit", setTweenNodes)
      .on("reInit", setTweenFactor)
      .on("reInit", tweenParallax)
      .on("scroll", tweenParallax)
      .on("slideFocus", tweenParallax);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      tweenNodes.current.forEach((slide) => slide.removeAttribute("style"));
    };
  }, [emblaApi, tweenParallax, setTweenNodes, setTweenFactor]);

  const onNavButtonClick = useCallback((emblaApi: EmblaCarouselType) => {
    const autoplay = emblaApi?.plugins()?.autoplay;
    if (!autoplay) return;

    const resetOrStop =
      autoplay.options.stopOnInteraction === false
        ? autoplay.reset
        : autoplay.stop;

    resetOrStop();
  }, []);
  const { selectedIndex, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );
  return (
    <section
      className={mobile ? "embla embla--mobile" : "embla"}
      style={
        mobile
          ? {
              pointerEvents: "none",
              touchAction: "pan-y",
              userSelect: "none",
              WebkitUserSelect: "none",
            }
          : {}
      }
    >
      <div
        className="embla__viewport"
        ref={emblaRef}
        style={{ position: "relative" }}
      >
        {" "}
        <div className="embla__container">
          {actualSlides.map((index) => {
            const content = slideContent[index] || slideContent[0];
            return (
              <div
                className="embla__slide"
                key={index}
                style={{
                  position: "relative",
                  overflow: "hidden",
                  transform: "translate3d(0, 0, 0)",
                  backfaceVisibility: "hidden",
                }}
              >
                <div className="embla__parallax">
                  <div className="embla__parallax__layer">
                    <Image
                      className="embla__slide__img embla__parallax__img"
                      src={content.image}
                      alt={content.title}
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />
                    {/* Dark overlay */}
                    <div className="absolute inset-0 bg-black/40 z-10" />

                    {/* Content overlay - hide interactive elements on mobile */}
                    {!mobile && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <div className="text-center text-white px-8">
                          <h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
                            {content.title}
                          </h1>
                          <p className="text-lg md:text-xl mb-8 drop-shadow-md opacity-90">
                            {content.subtitle}
                          </p>
                          <Link href={content.href || "/"}>
                            <Button
                              size="lg"
                              className="font-semibold shadow-xl"
                            >
                              {content.buttonText}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Mobile overlay - simple, no interactivity */}
                    {mobile && (
                      <div className="absolute inset-0 z-20 flex items-center justify-center">
                        <div className="text-center text-white px-4">
                          <h1 className="text-2xl font-bold drop-shadow-lg">
                            {content.title}
                          </h1>
                          <p className="text-sm mt-2 drop-shadow-md opacity-90">
                            {content.subtitle}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>{" "}
        {/* Hide dots on mobile */}
        {!mobile && (
          <div className="embla__dots">
            {actualSlides.map((_, index) => (
              <DotButton
                key={index}
                onClick={() => onDotButtonClick(index)}
                className={"embla__dot".concat(
                  index === selectedIndex ? " embla__dot--selected" : ""
                )}
              >
                0{index + 1}
              </DotButton>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default EmblaCarousel;
