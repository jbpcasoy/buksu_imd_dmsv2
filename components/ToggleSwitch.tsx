import React, { useEffect, useState } from "react";

interface ToggleSwitchProps {
  onActivate: () => any;
  onDeactivate: () => any;
  isActive: boolean;
}
export default function ToggleSwitch({
  onActivate,
  onDeactivate,
  isActive,
}: ToggleSwitchProps) {
  const [isChecked, setIsChecked] = useState<boolean>(isActive);

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    if (isChecked === undefined) {
      return;
    } else if (isActive !== isChecked) {
      if (isChecked === false) {
        onDeactivate();
      } else if (isChecked === true) {
        onActivate();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isChecked]);

  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id="toggleSwitch"
        className="rounded text-palette_blue focus:border-palette_blue focus:ring focus:ring-offset-0 focus:ring-palette_blue focus:ring-opacity-10 cursor-pointer"
        checked={isChecked}
        onChange={handleToggle}
      />
    </div>
  );
}
