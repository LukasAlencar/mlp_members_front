import SettingsAccount from "./SettingsAccount";
import SettingsSystem from "./SettingsSystem";

export const SettingsBody = ({ selected }) => {
  return (
    <div className="flex-1 p-6">
      {selected === "Conta" && <SettingsAccount />}
      {selected === "Sistema" && <SettingsSystem />}

      <h1 className="text-5xl">
        Em desenvolvimento
      </h1>
    </div>
  );
};



export default SettingsBody
