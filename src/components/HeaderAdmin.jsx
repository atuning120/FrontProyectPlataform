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
  
  export default function HeaderAdmin() {
    const { user } = useContext(AuthContext);
  
    return (
      <div className="bg-blue-950">
        <Navbar className="bg-white/10 backdrop-blur-md border border-white/20 shadow-md rounded-b-xl px-4 py-2">
          <NavbarBrand className="flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2">
            <img src={logo} alt="Logo SIMICODE" className="w-24 h-auto" />
            <p className="text-xl sm:text-2xl font-semibold text-white tracking-wide">FISIM</p>
          </NavbarBrand>
  
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
                  <p className="text-xs text-white/60 italic">Rol: Administrador</p>
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
      </div>
    );
  }
  