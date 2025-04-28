import { useSelector } from 'react-redux';

export const getContextMenuItems = () => {
  // Access translations from Redux store
  const messages = useSelector(state => state.intl?.messages || {});
  
  return [
    { text: messages.applyToAllFamilies || 'Appliquer sur toutes les familles' },
    { text: messages.applyToAllSubFamilies || 'Appliquer sur toutes les sous familles' }
  ];
};

// For backward compatibility
export const contextMenuItems = [
  { text: 'Appliquer sur toutes les familles' },
  { text: 'Appliquer sur toutes les sous familles' }
];