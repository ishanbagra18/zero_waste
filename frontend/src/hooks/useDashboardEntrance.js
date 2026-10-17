import { useLayoutEffect } from "react";
import gsap from "gsap";

export default function useDashboardEntrance(rootRef) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    const context = gsap.context(() => {
      const intro = root.querySelectorAll("[data-gsap-intro]");
      const cards = root.querySelectorAll("[data-gsap-card]");
      const targets = [...intro, ...cards];
      const reducedMotion =
        window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

      if (reducedMotion) {
        gsap.set(targets, { clearProps: "all" });
        return;
      }

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline.fromTo(
        intro,
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.1 }
      );
      timeline.fromTo(
        cards,
        { autoAlpha: 0, y: 20, scale: 0.98 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.48, stagger: 0.08 },
        "-=0.28"
      );
    }, root);

    return () => context.revert();
  }, [rootRef]);
}
