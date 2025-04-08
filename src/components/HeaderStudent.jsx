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
import logo from "../../public/logoPagina.png"



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
    <Navbar>
      <NavbarBrand>
        <img src={logo} alt="Logo SIMICODE" className="w-24 h-auto" />
        <p className="font-bold text-inherit">SIMICODE</p>
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
            <Avatar
              isBordered
              as="button"
              className="transition-transform rounded-full"
              color="secondary"
              name="user Photo"
              size="lg"
              src={user?.photoURL}
            />

          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">{user?.displayName}</p>
              <p className="font-semibold">{user?.email}</p>
              <p className="font-semibold">Rol: Estudiante</p>
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

  );
}
