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
export default function NavigationIcon({ name, ...rest }: NavigationIconProps) {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in icon map`);
    return null;
  }

  return <IconComponent {...rest} />;
}
