import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@heroui/react";
import { useContext } from "react";
import { AuthContext } from "./Auth/AuthProvider";
import { logout } from "../services/firebase";
import { useStudentView } from "../context/StudentViewContext"; // 👈 contexto
import ToggleButton from "./ToggleButton";
import logo from "../../public/logoPaginaBlanco.png";

export default function App() {
  const { user } = useContext(AuthContext);
  const {
    showClinicalRecords,
    setShowClinicalRecords,
    showAnsweredRecords,
    setShowAnsweredRecords,
  } = useStudentView();

  const handleToggleClinicalRecords = () => {
    setShowClinicalRecords(!showClinicalRecords);
    setShowAnsweredRecords(false);
  };

  const handleToggleAnsweredRecords = () => {
    setShowAnsweredRecords(!showAnsweredRecords);
    setShowClinicalRecords(false);
  };

  return (
    <div className="bg-blue-950">
      <Navbar className="border-white/40 border shadow-lg bg-white/20">
        <NavbarBrand className="flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2">
          <img src={logo} alt="Logo SIMICODE" className="w-24 h-auto" />
          <p className="font-bold text-white">SIMICODE</p>
        </NavbarBrand>

        {/* Botones solo para estudiantes */}
        {user?.role === "alumno" && (
          <NavbarContent className="hidden sm:flex gap-4 flex-1 justify-center">
            <ToggleButton
              isVisible={showClinicalRecords}
              onToggle={handleToggleClinicalRecords}
              showText="Ver Fichas Clínicas"
              hideText="Ocultar Fichas Clínicas"
            />
            <ToggleButton
              isVisible={showAnsweredRecords}
              onToggle={handleToggleAnsweredRecords}
              showText="Ver Fichas Enviadas"
              hideText="Ocultar Fichas Enviadas"
            />
          </NavbarContent>
        )}

        {/* Perfil a la derecha */}
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger className="flex gap-4 items-center">
              <img
                src={user?.photoURL}
                alt="Foto de usuario"
                className="w-16 h-16 rounded-full border-secondary object-cover"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              className="bg-black/20 rounded-lg"
            >
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold text-white">{user?.displayName}</p>
                <p className="font-semibold text-white">{user?.email}</p>
                <p className="font-semibold text-white">Rol: Estudiante</p>
              </DropdownItem>
              <DropdownItem key="logout" className="py-2">
                <button
                  onClick={logout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded text-sm"
                >
                  Cerrar sesión
                </button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
