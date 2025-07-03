import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
} from "@heroui/react";
import { useContext } from "react";
import { AuthContext } from "./Auth/AuthProvider";
import { logout } from "../services/firebase";
import logo from "../assets/logoPaginaBlanco.png";
import ToggleButton from "./ToggleButton";
import { useAdminView } from "../context/AdminViewContext";
import { useState } from "react";

export default function HeaderAdmin() {
   const defaultAvatar = "https://ui-avatars.com/api/?name=Usuario&background=0D8ABC&color=fff";

  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { user } = useContext(AuthContext);
  const avatarSrc = !imgError && user?.photoURL ? user.photoURL : defaultAvatar;
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    setShowDashboard,
    setShowPatientList,
    setShowClinicalRecords,
    setShowAnsweredRecords,
  } = useAdminView();


  const handleChangeView = (view) => {
    setShowDashboard(view === "dashboard");
    setShowPatientList(view === "patients");
    setShowClinicalRecords(view === "clinical");
    setShowAnsweredRecords(view === "answered");
  };

  return (
    <div className="bg-blue-950">


      {/* Logo FISIM */}
      <Navbar className="bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-b-xl px-4 py-2">

        {/* Botón de menú */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰
        </button>

        <NavbarBrand className="flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2">
          <img src={logo} alt="Logo SIMICODE" className="w-24 h-auto" />
          <p className="text-xl sm:text-2xl font-semibold text-white tracking-wide">FISIM</p>
        </NavbarBrand>

        {/*Botones*/}
        {user?.role === "admin" && (
          <NavbarContent className="hidden sm:flex gap-4 flex-1 justify-center">
            <ToggleButton
              onToggle={() => handleChangeView("dashboard")}
              showText="Dashboard"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-md transition duration-300 font-medium"
            />

            <ToggleButton
              onToggle={() => handleChangeView("patients")}
              showText="Pacientes"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-md transition duration-300 font-medium"
            />
            <ToggleButton
              onToggle={() => handleChangeView("clinical")}
              showText="Fichas clínicas"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-md transition duration-300 font-medium"
            />
            <ToggleButton
              onToggle={() => handleChangeView("answered")}
              showText="Fichas respondidas"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-md transition duration-300 font-medium"
            />

          </NavbarContent>
        )}

        {/* OPCIONES DE PERFIL */}
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger className="flex gap-4 items-center">
              <div className="relative">
                {!imgLoaded && (
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-200 animate-pulse border-2 border-white/40 absolute top-0 left-0 z-10">
                    {/* Spinner simple */}
                    <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                  </div>
                )}
                <img
                  src={avatarSrc}
                  alt="Foto de usuario"
                  className={`w-16 h-16 rounded-full border-2 border-white/40 object-cover hover:ring-2 hover:ring-white/50 transition ${imgLoaded ? "block" : "hidden"}`}
                  onLoad={() => setImgLoaded(true)}
                  onError={e => {
                    setImgError(true);
                    setImgLoaded(true); // Quita loader si falla
                  }}
                  style={{ minWidth: 64, minHeight: 64 }}
                />
              </div>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl px-4 py-3 space-y-3"
            >
              <DropdownItem
                key="profile"
                textValue={user?.displayName || "Usuario"}
                className="flex flex-col items-start gap-0 px-0 py-1 cursor-default"
              >
                <p className="text-sm text-white/80">Bienvenido,</p>
                <p className="text-base font-semibold text-white">{user?.displayName}</p>
                <p className="text-sm text-white/70">{user?.email}</p>
                <p className="text-xs text-white/60 italic">Rol: Profesor</p>
              </DropdownItem>

              <DropdownItem key="logout" className="px-0 py-1" textValue="Cerrar sesion">
                <button
                  onClick={logout}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg shadow-sm transition"
                >
                  Cerrar sesión
                </button>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>
      {/* Sidebar móvil con animación */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        >
          <div
            className={`bg-blue-900 w-64 h-full p-6 shadow-lg transform transition-transform duration-300 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
              }`}
            onClick={(e) => e.stopPropagation()} // evita cerrar si clic dentro del panel
          >
            <button
              className="text-white text-2xl mb-6"
              onClick={() => setIsSidebarOpen(false)}
            >
              ✕
            </button>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  handleChangeView("dashboard");
                  setIsSidebarOpen(false);
                }}
                className="text-white text-lg text-left"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  handleChangeView("patients");
                  setIsSidebarOpen(false);
                }}
                className="text-white text-lg text-left"
              >
                Pacientes
              </button>
              <button
                onClick={() => {
                  handleChangeView("clinical");
                  setIsSidebarOpen(false);
                }}
                className="text-white text-lg text-left"
              >
                Fichas clínicas
              </button>
              <button
                onClick={() => {
                  handleChangeView("answered");
                  setIsSidebarOpen(false);
                }}
                className="text-white text-lg text-left"
              >
                Fichas respondidas
              </button>
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
