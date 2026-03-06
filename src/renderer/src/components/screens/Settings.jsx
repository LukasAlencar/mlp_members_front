import { useState } from "react";
import SettingsHeader from "../SettingsHeader";
import SettingsSidebar from "../SettingsSidebar";
import SettingsBody from "../SettingsBody";
import Sidebar from "../Sidebar";

export const Settings = () => {
  const [selectedTab, setSelectedTab] = useState("Conta"); // aba padrão

  return (
    <div className="w-screen h-screen text-zinc-100 flex bg-zinc-950">
      <Sidebar />
      <div className="w-full h-full flex flex-col">
        <div className="flex flex-col w-full h-full">
          <SettingsHeader />
          {/* Passa o estado e o setter */}
          <SettingsSidebar selected={selectedTab} onSelect={setSelectedTab} />
        </div>
        <SettingsBody selected={selectedTab} />
      </div>
    </div>
  );
};

export default Settings;
