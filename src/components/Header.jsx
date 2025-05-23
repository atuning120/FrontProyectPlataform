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
import logo from "../../public/logoPaginaBlanco.png";
import ToggleButton from "./ToggleButton";
import { useTeacherView } from "../context/TeacherViewContext";
import { useState } from "react";

export default function Header() {
  const { user } = useContext(AuthContext);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    showForm, setShowForm,
    showPatientList, setShowPatientList,
    showClinicRecordForm, setShowClinicRecordForm,
    showClinicalRecords, setShowClinicalRecords,
    showAnsweredRecords, setShowAnsweredRecords,
  } = useTeacherView();

  const handleToggleForm = () => {
    setShowForm(!showForm);
    setShowPatientList(false);
    setShowClinicRecordForm(false);
    setShowClinicalRecords(false);
    setShowAnsweredRecords(false);
  };

  const handleTogglePatientList = () => {
    setShowPatientList(!showPatientList);
    setShowForm(false);
    setShowClinicRecordForm(false);
    setShowClinicalRecords(false);
    setShowAnsweredRecords(false);
  };

  const handleToggleClinicalRecordsForm = () => {
    setShowClinicRecordForm(!showClinicRecordForm);
    setShowForm(false);
    setShowPatientList(false);
    setShowClinicalRecords(false);
    setShowAnsweredRecords(false);
  };

  const handleToggleClinicalRecords = () => {
    setShowClinicalRecords(!showClinicalRecords);
    setShowForm(false);
    setShowPatientList(false);
    setShowClinicRecordForm(false);
    setShowAnsweredRecords(false);
  };

  const handleToggleAnsweredRecords = () => {
    setShowAnsweredRecords(!showAnsweredRecords);
    setShowForm(false);
    setShowPatientList(false);
    setShowClinicRecordForm(false);
    setShowClinicalRecords(false);
  };

  return (
    <div className="bg-blue-950">
      <Navbar className="bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-b-xl px-4 py-2">

        {/* Botón de menú */}
        <button
          className="sm:hidden text-white focus:outline-none"
          onClick={() => setIsSidebarOpen(true)}
        >
          ☰
        </button>
        {/* Logo y título */}
        <NavbarBrand className="flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2">
          <img src={logo} alt="Logo SIMICODE" className="w-24 h-auto" />
          <p className="text-xl sm:text-2xl font-semibold text-white tracking-wide">FISIM</p>
        </NavbarBrand>

        {/* Botones al centro */}
        <NavbarContent className="hidden sm:flex gap-4 flex-1 justify-center">
          <ToggleButton
            isVisible={showForm}
            onToggle={handleToggleForm}
            showText="Crear Paciente"
            hideText="Cancelar Paciente"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-md transition font-medium"
          />
          <ToggleButton
            isVisible={showPatientList}
            onToggle={handleTogglePatientList}
            showText="Ver Pacientes"
            hideText="Ocultar Pacientes"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-md transition font-medium"
          />
          <ToggleButton
            isVisible={showClinicRecordForm}
            onToggle={handleToggleClinicalRecordsForm}
            showText="Crear Ficha"
            hideText="Cancelar Ficha"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-md transition font-medium"
          />
          <ToggleButton
            isVisible={showClinicalRecords}
            onToggle={handleToggleClinicalRecords}
            showText="Ver Fichas"
            hideText="Ocultar Fichas"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-md transition font-medium"
          />
          <ToggleButton
            isVisible={showAnsweredRecords}
            onToggle={handleToggleAnsweredRecords}
            showText="Ver Respuestas"
            hideText="Ocultar Respuestas"
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md px-4 py-2 rounded-xl shadow-md transition font-medium"
          />
        </NavbarContent>

        {/* Avatar y menú de usuario */}
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger className="flex gap-4 items-center">
              <img
                src={user?.photoURL}
                alt="Foto de usuario"
                className="w-16 h-16 rounded-full border-2 border-white/40 object-cover hover:ring-2 hover:ring-white/50 transition"
              />
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              className="bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl px-4 py-3 space-y-3"
            >
              <DropdownItem
                key="profile"
                className="flex flex-col items-start gap-0 px-0 py-1 cursor-default"
              >
                <p className="text-sm text-white/80">Bienvenido,</p>
                <p className="text-base font-semibold text-white">{user?.displayName}</p>
                <p className="text-sm text-white/70">{user?.email}</p>
                <p className="text-xs text-white/60 italic">Rol: Profesor</p>
              </DropdownItem>

              <DropdownItem key="logout" className="px-0 py-1">
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
                  handleToggleForm();
                  setIsSidebarOpen(false);
                }}
                className="text-white text-lg text-left"
              >
                {showForm ? "Cancelar Paciente" : "Crear Paciente"}
              </button>

              <button
                onClick={() => {
                  handleTogglePatientList();
                  setIsSidebarOpen(false);
                }}
                className="text-white text-lg text-left"
              >
                {showPatientList ? "Ocultar Pacientes" : "Ver Pacientes"}
              </button>

              <button
                onClick={() => {
                  handleToggleClinicalRecordsForm();
                  setIsSidebarOpen(false);
                }}
                className="text-white text-lg text-left"
              >
                {showClinicRecordForm ? "Cancelar Ficha" : "Crear Ficha"}
              </button>

              <button
                onClick={() => {
                  handleToggleClinicalRecords();
                  setIsSidebarOpen(false);
                }}
                className="text-white text-lg text-left"
              >
                {showClinicalRecords ? "Ocultar Fichas" : "Ver Fichas"}
              </button>
              <button
                onClick={() => {
                  handleToggleAnsweredRecords();
                  setIsSidebarOpen(false);
                }}
                className="text-white text-lg text-left"
              >
                {showAnsweredRecords ? "Ocultar Respuestas" : "Ver Respuestas"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
