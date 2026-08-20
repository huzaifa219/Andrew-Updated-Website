import type { ImgHTMLAttributes } from 'react';
import logoImg from '@/assets/logo.png';
import logoMarkImg from '@/assets/logo-mark.png';

export function MspLogoMark({
  className = 'w-10 h-10',
  alt = 'Mutual Success Partners Logo',
  ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img
      src={logoMarkImg}
      alt={alt}
      className={`object-contain select-none shrink-0 ${className}`}
      loading="eager"
      {...props}
    />
  );
}

export function MspLogo({
  variant = 'horizontal',
  className = '',
  markSize = 'h-11 sm:h-12 w-auto',
}: {
  variant?: 'full' | 'mark' | 'horizontal';
  className?: string;
  markSize?: string;
}) {
  if (variant === 'mark') {
    return <MspLogoMark className={markSize} />;
  }

  if (variant === 'full') {
    return (
      <div className={`flex flex-col items-center text-center select-none ${className}`}>
        <img
          src={logoImg}
          alt="Mutual Success Partners"
          className={`object-contain max-w-full ${markSize || 'h-28 w-auto sm:h-36'}`}
          loading="eager"
        />
      </div>
    );
  }

  return (
    <div className={`flex items-center select-none ${className}`}>
      <img
        src={logoImg}
        alt="Mutual Success Partners"
        className={`object-contain ${markSize || 'h-11 sm:h-12 w-auto'}`}
        loading="eager"
      />
    </div>
  );
}
