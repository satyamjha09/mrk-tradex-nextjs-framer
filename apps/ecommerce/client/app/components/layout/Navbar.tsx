"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import UserMenu from "../molecules/UserMenu";
import { Menu, X, Search, LogOut, Phone, MessageCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import SearchBar from "../molecules/SearchBar";
import useClickOutside from "@/app/hooks/dom/useClickOutside";
import useEventListener from "@/app/hooks/dom/useEventListener";
import { useAuth } from "@/app/hooks/useAuth";
import { useAppDispatch } from "@/app/store/hooks";
import { useSignOutMutation } from "@/app/store/apis/AuthApi";
import { logout } from "@/app/store/slices/AuthSlice";
import { generateUserAvatar } from "@/app/utils/placeholderImage";
import { mrkFeatures } from "@/app/lib/config/features";
import { useMrkSiteSettings } from "@/app/hooks/useMrkSiteSettings";

const Navbar = () => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [signout] = useSignOutMutation();
  const router = useRouter();
  const { user, isLoading, isAuthenticated } = useAuth();
  const { company, urls } = useMrkSiteSettings();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEventListener("scroll", () => {
    setScrolled(window.scrollY > 20);
  });

  useClickOutside(menuRef, () => setMenuOpen(false));
  useClickOutside(mobileMenuRef, () => setMobileMenuOpen(false));

  const handleSignOut = async () => {
    try {
      await signout();
      dispatch(logout());
      router.push("/sign-in");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-black shadow-lg shadow-black/20"
            : "bg-black shadow-sm shadow-black/20"
        }`}
      >
        <nav className="mx-auto max-w-[1760px] px-4 sm:px-8 lg:px-16">
          <div className="flex h-[58px] items-center justify-between sm:h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex-shrink-0 text-2xl font-black uppercase tracking-normal text-white sm:text-3xl"
            >
              {company.shortName}
            </Link>

            <div className="ml-8 hidden items-center gap-8 text-sm font-semibold text-white lg:flex">
              <Link
                href="/products"
                className="transition-colors hover:text-gray-300"
              >
                Catalog
              </Link>
              {mrkFeatures.downloadsEnabled && (
                <Link
                  href="/downloads"
                  className="transition-colors hover:text-gray-300"
                >
                  Downloads
                </Link>
              )}
              {mrkFeatures.dealerLocatorEnabled && (
                <Link
                  href="/find-dealer"
                  className="transition-colors hover:text-gray-300"
                >
                  Find Dealer
                </Link>
              )}
              {mrkFeatures.dealerLocatorEnabled && (
                <Link
                  href="/dealer"
                  className="transition-colors hover:text-gray-300"
                >
                  Become Dealer
                </Link>
              )}
              <Link
                href="/contact"
                className="transition-colors hover:text-gray-300"
              >
                Contact
              </Link>
            </div>

            {/* Desktop Search Bar */}
            <div className="hidden flex-1 md:block" />

            {/* Right section */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search Button */}
              <button
                onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
                className="rounded-full p-2 text-white transition-colors hover:bg-white/10"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              <a
                href={urls.phone}
                className="hidden items-center gap-2 rounded-full p-2 text-white transition-colors hover:bg-white/10 sm:inline-flex"
                aria-label="Call MRK"
              >
                <Phone size={21} />
              </a>

              <a
                href={urls.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden items-center gap-2 rounded-full p-2 text-white transition-colors hover:bg-white/10 sm:inline-flex"
                aria-label="WhatsApp MRK"
              >
                <MessageCircle size={21} />
              </a>

              {/* User Menu */}
              {!isLoading && isAuthenticated ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center rounded-full p-1 transition-colors hover:bg-white/10"
                    aria-label="User menu"
                  >
                    {user?.avatar ? (
                      <div className="w-7 h-7 rounded-full bg-gray-200 overflow-hidden border border-gray-300">
                        <Image
                          src={user.avatar}
                          alt="User Profile"
                          width={28}
                          height={28}
                          className="rounded-full object-cover w-full h-full"
                          onError={(e) => {
                            e.currentTarget.src = generateUserAvatar(user.name);
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-[35px] h-[35px] rounded-full overflow-hidden border border-gray-300">
                        <Image
                          src={generateUserAvatar(user?.name || "User")}
                          alt="User Profile"
                          width={35}
                          height={35}
                          className="rounded-full object-cover w-full h-full"
                        />
                      </div>
                    )}
                  </button>

                  {menuOpen && (
                    <UserMenu
                      user={user}
                      menuOpen={menuOpen}
                      closeMenu={() => setMenuOpen(false)}
                    />
                  )}
                </div>
              ) : mrkFeatures.customerAuthEnabled ? (
                pathname !== "/sign-up" &&
                pathname !== "/sign-in" && (
                  <Link
                    href="/sign-in"
                    className="hidden rounded-full px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition-colors sm:block"
                  >
                    Sign in
                  </Link>
                )
              ) : null}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="rounded-full p-2 text-white transition-colors hover:bg-white/10 md:hidden"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="border-t border-white/10 py-3">
              <SearchBar />
            </div>
          )}

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="absolute left-0 right-0 top-full border-t border-white/10 bg-black shadow-lg md:hidden"
            >
              <div className="px-4 py-2 space-y-2">
                {!isAuthenticated && mrkFeatures.customerAuthEnabled && (
                  <>
                    <Link
                      href="/sign-in"
                      className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/sign-up"
                      className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sign up
                    </Link>
                  </>
                )}
                <Link
                  href="/"
                  className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/dealer"
                  className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Become Dealer
                </Link>
                {mrkFeatures.dealerLocatorEnabled && (
                  <Link
                    href="/find-dealer"
                    className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Find Dealer
                  </Link>
                )}
                <Link
                  href="/products"
                  className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Catalog
                </Link>
                {mrkFeatures.downloadsEnabled && (
                  <Link
                    href="/downloads"
                    className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Downloads
                  </Link>
                )}
                <Link
                  href="/contact"
                  className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                <a
                  href={urls.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  WhatsApp Enquiry
                </a>
                <a
                  href={urls.phone}
                  className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Call {company.phone}
                </a>
                {user?.role === "ADMIN" && (
                  <Link
                    href="/dashboard"
                    className="block rounded-md px-3 py-2 text-white hover:bg-white/10"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                )}

                {isAuthenticated && (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center w-full px-4 py-3 gap-3 text-red-600 hover:bg-red-50/80 transition-colors duration-150 text-sm"
                  >
                    <LogOut size={18} />
                    <span>Sign out</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;
