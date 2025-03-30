import React from 'react';
import {
  FaHeadphones,
  FaReceipt,
  FaUsers,
  FaCog,
  FaChartBar,
  FaUser,
} from 'react-icons/fa';
import { IconType } from 'react-icons/lib';
type IconMap = {
  [key: string]: IconType;
};
// Map the string identifiers to React Icons components
const iconMap: IconMap = {
  shopping_cart: FaHeadphones,
  receipt: FaReceipt,
  people: FaUsers,
  settings: FaCog,
  bar_chart: FaChartBar,
  person: FaUser,
};

interface NavigationIconProps extends React.SVGAttributes<SVGElement> {
  name: string;
}

// Component that renders the appropriate icon based on the name
/**
 * NavigationIcon component that renders an icon from the icon map.
 *
 * @component
 * @param {Object} props - The component props
 * @param {string} props.name - The name of the icon to render
 * @param {Object} props.rest - Any additional props to pass to the icon component
 * @returns {JSX.Element|null} The rendered icon component or null if icon not found
 *
 * @example
 * ```tsx
 * <NavigationIcon name="home" className="icon-class" />
 * ```
 */
export default function NavigationIcon({ name, ...rest }: NavigationIconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  return <IconComponent {...rest} />;
}
