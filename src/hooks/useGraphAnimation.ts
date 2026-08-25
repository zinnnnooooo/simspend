import { useState, useEffect } from 'react';

/**
 * 0.8초 ~ 1.2초 동안 0에서 1로 부드럽게 증가하는 애니메이션 진행률을 반환하는 훅입니다.
 * @param duration 애니메이션 지속 시간 (ms)
 * @returns 0에서 1 사이의 진행률 (ease-out cubic 적용)
 */
export const useGraphAnimation = (duration: number = 1000): number => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }
      const elapsed = timestamp - startTimestamp;
      const progressRatio = Math.min(elapsed / duration, 1);
      
      // easeOutCubic: f(t) = 1 - (1 - t)^3
      const easeOutRatio = 1 - Math.pow(1 - progressRatio, 3);

      setProgress(easeOutRatio);

      if (progressRatio < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [duration]);

  return progress;
};
