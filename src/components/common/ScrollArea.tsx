import { useRef, useState, useEffect } from 'react';

interface ScrollAreaProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollArea({ children, className = '' }: ScrollAreaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const check = () => {
      setCanScroll(el.scrollHeight > el.clientHeight + 2);
    };

    check();

    const observer = new ResizeObserver(check);
    observer.observe(el);

    return () => observer.disconnect();
  }, [children]);

  return (
    <div className={`relative ${className}`}>
      <div ref={ref} className="h-full overflow-y-auto min-h-0">
        {children}
      </div>
      {canScroll && (
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-earth-stone/20 to-transparent pointer-events-none" />
      )}
    </div>
  );
}
