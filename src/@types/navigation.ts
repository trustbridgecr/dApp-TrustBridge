export interface NavigationItem {
  name: string;
  href: string;
  current?: boolean;
  external?: boolean;
}

export interface NavigationProps {
  items: NavigationItem[];
  className?: string;
  onItemClick?: (item: NavigationItem) => void;
}

export interface HeaderProps {
  className?: string;
  fixed?: boolean;
}