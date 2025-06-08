"use client";
import React, { useCallback, useMemo, useEffect, useRef } from "react";
import { EmblaOptionsType, EmblaCarouselType, EmblaEventType } from "embla-carousel";
import {
  DotButton,
  useDotButton,
} from "@/components/carousel/EmblaCarouselDotButton";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
type PropType = {
  slides: number[];
  options?: EmblaOptionsType;
};

const TWEEN_FACTOR_BASE = 0.1;

const EmblaCarousel: React.FC<PropType> = (props) => {
  const { slides, options } = props;
  const autoplay = useMemo(() => Autoplay(), []);
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [autoplay]);
  
  const tweenFactor = useRef(0);
  const tweenNodes = useRef<HTMLElement[]>([]);
  const animationId = useRef<number | null>(null);

  const setTweenNodes = useCallback((emblaApi: EmblaCarouselType): void => {
    tweenNodes.current = emblaApi.slideNodes().map((slideNode) => {
      return slideNode.querySelector('.embla__parallax__layer') as HTMLElement;
    });
  }, []);

  const setTweenFactor = useCallback((emblaApi: EmblaCarouselType) => {
    tweenFactor.current = TWEEN_FACTOR_BASE * emblaApi.scrollSnapList().length;
  }, []);

  const tweenParallax = useCallback(
    (emblaApi: EmblaCarouselType, eventName?: EmblaEventType) => {
      // Cancel any pending animation frame
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }

      // Use requestAnimationFrame for smoother performance
      animationId.current = requestAnimationFrame(() => {
        const engine = emblaApi.internalEngine();
        const scrollProgress = emblaApi.scrollProgress();
        const slidesInView = emblaApi.slidesInView();
        const isScrollEvent = eventName === 'scroll';

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
    []
  );

  useEffect(() => {
    if (!emblaApi) return;

    setTweenNodes(emblaApi);
    setTweenFactor(emblaApi);
    tweenParallax(emblaApi);

    emblaApi
      .on('reInit', setTweenNodes)
      .on('reInit', setTweenFactor)
      .on('reInit', tweenParallax)
      .on('scroll', tweenParallax)
      .on('slideFocus', tweenParallax);

    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
      tweenNodes.current.forEach((slide) => slide.removeAttribute('style'));
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

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(
    emblaApi,
    onNavButtonClick
  );

  return (
    <section className="embla">
      <div
        className="embla__viewport"
        ref={emblaRef}
        style={{ position: "relative" }}
      >
        <div className="embla__container">
          {slides.map((index) => (
            <div
              className="embla__slide"
              key={index}
              style={{ 
                position: "relative", 
                overflow: "hidden",
                transform: "translate3d(0, 0, 0)",
                backfaceVisibility: "hidden"
              }}
            >
              <div className="embla__parallax">
                <div className="embla__parallax__layer">
                  <Image
                    className="embla__slide__img embla__parallax__img"
                    src={`https://picsum.photos/800/340?random=${index + 1}`}
                    alt={`Random ${index + 1}`}
                    fill
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="embla__dots">
          {scrollSnaps.map((_, index) => (
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
      </div>
    </section>
  );
};

export default EmblaCarousel;
