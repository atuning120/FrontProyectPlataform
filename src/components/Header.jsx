import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { useContext } from "react";
import { AuthContext } from "./Auth/AuthProvider";
import { logout } from "../services/firebase";
import logo from "../../public/logoPaginaBlanco.png"



export const AcmeLogo = () => {
  return (
    <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
      <path
        clipRule="evenodd"
        d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
        fill="currentColor"
        fillRule="evenodd"
      />
    </svg>
  );
};

export default function App() {
  const { user } = useContext(AuthContext);
  const menuItems = [
    { label: "Mi perfil", href: "#" },
    { label: "Configuración", href: "#" },
    { label: "Cerrar sesión", action: logout },
  ];
  return (
    <div className="bg-blue-950">
      <Navbar className="border-white/40 border shadow-lg bg-white/20">
        <NavbarBrand className="flex w-full sm:w-auto justify-center sm:justify-start items-center gap-2">
          <img src={logo} alt="Logo SIMICODE" className="w-24 h-auto" />
          <p className="font-bold text-white">SIMICODE</p>
        </NavbarBrand>


        {/* Contenido centrado con flex-1 */}
        <NavbarContent className="hidden sm:flex gap-4 flex-1 justify-center">
          <NavbarItem>
            <Link color="foreground" href="#">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem isActive>
            <Link aria-current="page" color="secondary" href="#">
              Customers
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="foreground" href="#">
              Integrations
            </Link>
          </NavbarItem>
        </NavbarContent>

        {/* Avatar a la derecha */}
        <NavbarContent as="div" justify="end">
          <Dropdown placement="bottom-end">
            <DropdownTrigger className="flex gap-4 items-center">
              <img
                src={user?.photoURL}
                alt="Foto de usuario"
                className="w-16 h-16 rounded-full  border-secondary object-cover"
              />


            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat" className="bg-black/20 rounded-lg">
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
