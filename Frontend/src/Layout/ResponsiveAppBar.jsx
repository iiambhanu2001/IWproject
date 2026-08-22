import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react";

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/Authcontext/Authcontext.jsx";

export default function ResponsiveAppBar() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <Navbar
      fluid
      rounded
      className="relative z-50 border-b border-[#E6ECE6] bg-[#F7F9F7]/80 backdrop-blur-md"
    >
      <NavbarBrand as={Link} to="/">
        <span className="text-lg font-semibold text-[#1F2A24] tracking-wide">
          InterviewOS
        </span>
      </NavbarBrand>

      <div className="flex items-center gap-2 md:order-2">
        {user ? (
          <>
            <Dropdown label="My Profile">
              <DropdownHeader>
                <span className="block text-sm">{user.name}</span>
                <span className="block truncate text-sm font-medium">
                  {user.email}
                </span>
              </DropdownHeader>
              <DropdownItem>Dashboard</DropdownItem>
              <DropdownItem>Settings</DropdownItem>

              <DropdownDivider />
              <DropdownItem
                className="border border-[#E6ECE6] text-[#1F2A24]"
                onClick={() => navigate("/logout")}
              >
                Log out
              </DropdownItem>
            </Dropdown>
          </>
        ) : (
          <>
            <Button
              onClick={() => navigate("/login")}
              color="light"
              className="border border-[#E6ECE6] text-[#1F2A24]"
            >
              Login
            </Button>
            <Button
              onClick={() => navigate("/getstarted")}
              className="bg-[#4E9B7A] hover:bg-[#3f8063] text-white"
            >
              Get Started
            </Button>
          </>
        )}

        <NavbarToggle />
      </div>

      {/* LINKS */}
      <NavbarCollapse className="text-sm">
        <NavbarLink as={Link} to="/">
          Home
        </NavbarLink>
        {user?.role === "interviewer" ? (
          <>
            <NavbarLink as={Link} to="/Adminsendque">
              Take Interview
            </NavbarLink>
            <NavbarLink as={Link} to="/iv/dashboard">
              Dashboard
            </NavbarLink>
          </>
        ) : (
          <>
            <NavbarLink as={Link} to="/aiiw">
              AI Interview
            </NavbarLink>

            <NavbarLink as={Link} to="/ivmode">
              Human Interview
            </NavbarLink>
            <NavbarLink as={Link} to="/dashboard">
              Dashboard
            </NavbarLink>
          </>
        )}
      </NavbarCollapse>
    </Navbar>
  );
}
