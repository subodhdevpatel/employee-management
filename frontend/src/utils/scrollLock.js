let lockCount = 0;

export function acquireScrollLock() {
  if (typeof document === 'undefined') return () => {};
  if (lockCount === 0) {
    try {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('overflow-hidden');
      // Prevent iOS body scroll bounce inside viewport
      document.documentElement.style.overscrollBehavior = 'none';
    } catch {}
  }
  lockCount += 1;
  return function releaseScrollLock() {
    if (typeof document === 'undefined') return;
    lockCount = Math.max(0, lockCount - 1);
    if (lockCount === 0) {
      try {
        document.body.style.overflow = '';
        document.body.classList.remove('overflow-hidden');
        document.documentElement.style.overscrollBehavior = '';
      } catch {}
    }
  };
}
