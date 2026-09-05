import React from 'react';
import {
  LayoutGrid, Home, Store, Users,
  Tent, House, Bed, Utensils, ShoppingBag, Briefcase,
  Library, Trees, Church, Maximize2, Layers, Flame
} from 'lucide-react';

export const filterCategories = [
  'Tiny Living',
  'Multi-Generational',
  'Vacation Homes',
  'Food & Beverage',
  'Retail & Lifestyle',
  'Workspaces',
  'Shared Spaces',
  'Shared Places',
  'Sacred Structures',
];

export const categoryNavItems = [
  { id: 'Shelter', title: 'shelter', icon: <Home size={16} /> },
  { id: 'Livelihood', title: 'livelihood', icon: <Store size={16} /> },
  { id: 'Community', title: 'community', icon: <Users size={16} /> },
];

export const getFilterIcon = (cat: string) => {
  switch (cat) {
    case 'All': return <LayoutGrid size={16} />;
    case 'Private': return <Home size={16} />;
    case 'Interiors': return <Layers size={16} />;
    case 'Tiny Living': return <Tent size={16} />;
    case 'Multi-Generational': return <House size={16} />;
    case 'Vacation Homes': return <Bed size={16} />;
    case 'Food & Beverage': return <Utensils size={16} />;
    case 'Retail & Lifestyle': return <ShoppingBag size={16} />;
    case 'Workspaces': return <Briefcase size={16} />;
    case 'Shared Spaces': return <Library size={16} />;
    case 'Shared Places': return <Trees size={16} />;
    case 'Sacred Structures': return <Church size={16} />;
    default: return <LayoutGrid size={16} />;
  }
};
