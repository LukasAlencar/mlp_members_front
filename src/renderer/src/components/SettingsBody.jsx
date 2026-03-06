import SettingsAccount from "./SettingsAccount";
import SettingsSystem from "./SettingsSystem";

export const SettingsBody = ({ selected }) => {
  return (
    <div className="flex-1 p-6">
      {selected === "Conta" && <SettingsAccount />}
      {selected === "Sistema" && <SettingsSystem />}
    </div>
  );
};



export default SettingsBody
