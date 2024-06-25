import React from 'react';

interface ToggleSwitchProps {
  id: string;
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<any>) => void;
}

const ToggleSwitch = ({ name, id, onChange, checked }: ToggleSwitchProps) => {
  return (
    <label className={`toggle-button ${!checked ? 'active' : ''}`}>
      <input type="checkbox" name={name} id={id} onChange={onChange} checked={checked} />
      <div className="toggle-button-slider"></div>
    </label>
  );
};

export default ToggleSwitch;
