import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const animateFadeInUp = (element: HTMLElement | null) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 60,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
      },
      ease: 'power2.out',
    }
  );
};

export const animateSlideInLeft = (element: HTMLElement | null) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      opacity: 0,
      x: -100,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
      },
      ease: 'power2.out',
    }
  );
};

export const animateSlideInRight = (element: HTMLElement | null) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      opacity: 0,
      x: 100,
    },
    {
      opacity: 1,
      x: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
      },
      ease: 'power2.out',
    }
  );
};

export const animateScale = (element: HTMLElement | null) => {
  if (!element) return;

  gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 0.8,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
      },
      ease: 'power2.out',
    }
  );
};

export const addHoverAnimation = (element: HTMLElement | null) => {
  if (!element) return;

  element.addEventListener('mouseenter', () => {
    gsap.to(element, {
      y: -8,
      duration: 0.3,
      ease: 'power2.out',
    });
  });

  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out',
    });
  });
};

export const animateStagger = (elements: HTMLElement[], delay: number = 0.1) => {
  gsap.fromTo(
    elements,
    {
      opacity: 0,
      y: 40,
    },
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: delay,
      scrollTrigger: {
        trigger: elements[0],
        start: 'top 80%',
        end: 'top 50%',
        scrub: false,
      },
      ease: 'power2.out',
    }
  );
};
