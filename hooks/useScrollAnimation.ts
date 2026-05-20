import { useEffect, useRef, useState } from 'react';

type AnimationOptions = {
    threshold?: number;
    delay?: number;
};

export const useScrollAnimation = (options: AnimationOptions = {}) => {
    const { threshold = 0.12, delay = 0 } = options;
    const ref = useRef<HTMLElement | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    if (delay) {
                        setTimeout(() => setIsVisible(true), delay);
                    } else {
                        setIsVisible(true);
                    }
                    observer.unobserve(el);
                }
            },
            { threshold }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [threshold, delay]);

    return { ref, isVisible };
};
