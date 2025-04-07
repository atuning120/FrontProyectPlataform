import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
} from "@heroui/react"; // Usando heroui sin Avatar
import { useContext } from "react";
import { AuthContext } from "./Auth/AuthProvider";
import { logout } from "../services/firebase";

const AcmeLogo = () => (
  <svg fill="none" height="36" viewBox="0 0 32 32" width="36">
    <path
      clipRule="evenodd"
      d="M17.6482 10.1305L15.8785 7.02583L7.02979 22.5499H10.5278L17.6482 10.1305ZM19.8798 14.0457L18.11 17.1983L19.394 19.4511H16.8453L15.1056 22.5499H24.7272L19.8798 14.0457Z"
      fill="currentColor"
      fillRule="evenodd"
    />
  </svg>
);

export default function Header() {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { label: "Mi perfil", href: "#" },
    { label: "Configuración", href: "#" },
    { label: "Cerrar sesión", action: logout },
  ];

  return (
    <Navbar shouldHideOnScroll isBordered>
      {/* Móvil */}
      <NavbarContent className="sm:hidden" justify="start">
        <NavbarMenuToggle />
      </NavbarContent>

      <NavbarContent className="sm:hidden pr-3" justify="center">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
      </NavbarContent>

      {/* Escritorio */}
      <NavbarContent className="hidden sm:flex" justify="start">
        <NavbarBrand>
          <AcmeLogo />
          <p className="font-bold text-inherit">ACME</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link href="#">Features</Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link href="#">Customers</Link>
        </NavbarItem>
        <NavbarItem>
          <Link href="#">Integrations</Link>
        </NavbarItem>
      </NavbarContent>

      <NavbarContent justify="end">
        <NavbarItem className="hidden lg:flex items-center gap-2">
          {/* Reemplazo de Avatar */}
          <img
            src={user?.photoURL}
            alt="Usuario"
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-sm">{user?.displayName}</span>
        </NavbarItem>
        <NavbarItem>
          <Button
            as={Link}
            onClick={logout}
            color="danger"
            variant="flat"
          >
            Cerrar sesión
          </Button>
        </NavbarItem>
      </NavbarContent>

      {/* Menú móvil */}
      <NavbarMenu>
        {menuItems.map(({ label, href, action }, index) => (
          <NavbarMenuItem key={`${label}-${index}`}>
            {action ? (
              <Button
                onClick={action}
                color="danger"
                variant="flat"
                className="w-full"
              >
                {label}
              </Button>
            ) : (
              <Link href={href} className="w-full" size="lg">
                {label}
              </Link>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
