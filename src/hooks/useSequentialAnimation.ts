import { useState, useEffect } from 'react';

/**
 * 0에서 1 사이로 차오르는 진행률을 다수의 컴포넌트에 순차적으로 부여하기 위한 애니메이션 훅입니다.
 * @param steps 순차 실행할 단계 수
 * @param duration 각 단계당 진행되는 애니메이션 지속 시간 (ms)
 * @param stagger 각 단계 간의 지연 시간 (ms)
 * @returns 각 단계별 진행률 배열 (0 ~ 1, easeOutCubic 적용)
 */
export const useSequentialAnimation = (
  steps: number = 3,
  duration: number = 600,
  stagger: number = 400
): number[] => {
  const [progresses, setProgresses] = useState<number[]>(Array(steps).fill(0));

  useEffect(() => {
    let startTimestamp: number | null = null;
    let animationFrameId: number;
    const totalDuration = duration + (steps - 1) * stagger;

    const step = (timestamp: number) => {
      if (!startTimestamp) {
        startTimestamp = timestamp;
      }
      const elapsed = timestamp - startTimestamp;

      const nextProgresses = Array(steps).fill(0).map((_, index) => {
        const delay = index * stagger;
        if (elapsed < delay) return 0;
        const progressRatio = Math.min((elapsed - delay) / duration, 1);
        
        // easeOutCubic: f(t) = 1 - (1 - t)^3
        const easeOutRatio = 1 - Math.pow(1 - progressRatio, 3);
        return easeOutRatio;
      });

      setProgresses(nextProgresses);

      if (elapsed < totalDuration) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [steps, duration, stagger]);

  return progresses;
};

export default useSequentialAnimation;
