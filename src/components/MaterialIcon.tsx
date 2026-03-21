import React from 'react';

/**
 * Self-hosted Material Symbols as SVG (see docs/material-icons-used.md).
 * Renders via CSS mask + bg-current so Tailwind text-* colors apply.
 */
export const MATERIAL_ICON_NAMES = [
  'arrow_back',
  'arrow_forward',
  'auto_awesome',
  'block',
  'check',
  'check_circle',
  'celebration',
  'dark_mode',
  'description',
  'download_for_offline',
  'edit_note',
  'favorite',
  'home_app_logo',
  'light_mode',
  'lock',
  'medical_services',
  'palette',
  'pets',
  'photo_camera',
  'picture_as_pdf',
  'progress_activity',
  'psychology',
  'shield_lock',
  'task_alt',
  'tune',
  'verified',
  'verified_user',
] as const;

export type MaterialIconName = (typeof MATERIAL_ICON_NAMES)[number];

const ICON_BASE = '/icons/material';

export interface MaterialIconProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, 'children'> {
  name: MaterialIconName;
  /** Use for loading spinner (progress_activity) */
  spin?: boolean;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({
  name,
  className = '',
  spin = false,
  style,
  ...rest
}) => {
  const url = `${ICON_BASE}/${name}.svg`;
  return (
    <span
      aria-hidden
      className={[
        'inline-block shrink-0 align-middle leading-none [width:1em] [height:1em] bg-current',
        spin ? 'animate-spin' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        maskImage: `url(${url})`,
        WebkitMaskImage: `url(${url})`,
        maskSize: 'contain',
        WebkitMaskSize: 'contain',
        maskRepeat: 'no-repeat',
        WebkitMaskRepeat: 'no-repeat',
        maskPosition: 'center',
        WebkitMaskPosition: 'center',
        ...style,
      }}
      {...rest}
    />
  );
};

export default MaterialIcon;
