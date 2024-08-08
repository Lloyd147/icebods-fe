"use client";
import { getCookie, removeCookie } from "@/lib/cookies";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

const Header = () => {
  const { push } = useRouter();
  const pathname = usePathname();
  const token = getCookie("token") && JSON.parse(getCookie("token") as any);

  const handleLogout = () => {
    removeCookie("token");
    push("/admin/login");
  };

  return (
    <div className="admin-nav">
      <div className="wrapper">
        <div className="admin-nav-content">
          <Link href="/admin/portables" className="admin-logo">
            Back Office
          </Link>
          <div className="nav-links">
            {token ? (
              <>
                <Link
                  href="/admin/portables"
                  className={
                    pathname === "/admin/portables"
                      ? "link-item --active"
                      : "link-item"
                  }
                >
                  Basic
                </Link>
                <Link
                  href="/admin/barrels"
                  className={
                    pathname === "/admin/barrels"
                      ? "link-item --active"
                      : "link-item"
                  }
                >
                  Mid-tier
                </Link>
                <Link
                  href="/admin/tubs"
                  className={
                    pathname === "/admin/tubs"
                      ? "link-item --active"
                      : "link-item"
                  }
                >
                  Luxury
                </Link>
                <Link
                  href="/admin/footer"
                  className={
                    pathname === "/admin/footer"
                      ? "link-item --active"
                      : "link-item"
                  }
                >
                  Footer
                </Link>
                <div className="auth-links">
                  <div className="link-item" onClick={handleLogout}>
                    Logout
                  </div>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link
                  href="/admin/signup"
                  className={
                    pathname === "/admin/signup"
                      ? "link-item --active"
                      : "link-item"
                  }
                >
                  Sign Up
                </Link>
                <Link
                  href="/admin/login"
                  className={
                    pathname === "/admin/login"
                      ? "link-item --active"
                      : "link-item"
                  }
                >
                  Log In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
