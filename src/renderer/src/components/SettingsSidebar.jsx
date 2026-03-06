import SidebarItem from "./SidebarItem";

export const SettingsSidebar = ({ selected, onSelect }) => {
  return (
    <div className="w-52 bg-zinc-900 h-full flex flex-col">
      <SidebarItem
        value="Conta"
        active={selected === "Conta"}
        onClick={() => onSelect("Conta")}
      />
      <SidebarItem
        value="Sistema"
        active={selected === "Sistema"}
        onClick={() => onSelect("Sistema")}
      />
    </div>
  );
};

export default SettingsSidebar;
