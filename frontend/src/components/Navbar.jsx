import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  LayoutDashboard,
  PlusCircle,
  Package,
  Users,
  MapPin,
  Bell,
  User,
  LogOut,
  Menu,
  X,
  Heart,
  HandHeart,
  ChevronDown,
  Sparkles,
  Store,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { token, role, user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  // Scroll detection for backdrop effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/forgotpassword";
  const isVolunteerRole =
    (role || "").toLowerCase() === "volunteer" ||
    location.pathname.toLowerCase().includes("/volunteer");

  if (isAuthPage || isVolunteerRole) {
    return null;
  }

  // Determine role-based navigation links
  const getNavLinks = () => {
    if (!isAuthenticated) {
      return [
        { label: "All Items", path: "/vendor/allitems", icon: Package },
      ];
    }

    const currentRole = (role || "").toLowerCase();

    if (currentRole === "vendor") {
      return [
        { label: "Dashboard", path: "/vendor/dashboard", icon: LayoutDashboard },
        { label: "Add Item", path: "/vendor/createitem", icon: PlusCircle },
        { label: "All Items", path: "/vendor/allitems", icon: Package },
      ];
    } else if (currentRole === "ngo") {
      return [
        { label: "Dashboard", path: "/ngo/dashboard", icon: LayoutDashboard },
        { label: "My Claimed", path: "/ngo/myclaimed", icon: Heart },
        { label: "Book Volunteer", path: "/ngo/bookvolunteer", icon: HandHeart },
        { label: "All Items", path: "/vendor/allitems", icon: Package },
      ];
    }

    // Default authenticated links
    return [
      { label: "All Items", path: "/vendor/allitems", icon: Package },
      { label: "Profile", path: "/myprofile", icon: User },
    ];
  };

  const navLinks = getNavLinks();

  // Role Badge Styling Helper
  const getRoleBadge = () => {
    const r = (role || "").toUpperCase();
    if (r === "VENDOR") {
      return { text: "Vendor", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" };
    }
    if (r === "NGO") {
      return { text: "NGO", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" };
    }
    if (r === "VOLUNTEER") {
      return { text: "Volunteer", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" };
    }
    return { text: "User", color: "bg-slate-700/50 text-slate-300 border-slate-600" };
  };

  const roleBadge = getRoleBadge();
  const userInitials = user?.name ? user.name.substring(0, 2).toUpperCase() : "ZW";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <nav
        className={`w-full transition-all duration-300 ${isScrolled
          ? "glass-nav py-2.5 shadow-xl shadow-black/20 backdrop-blur-xl"
          : "bg-slate-950/80 backdrop-blur-md border-b border-white/10 py-3.5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo & Brand */}
            <Link to={isAuthenticated ? (role === "vendor" ? "/vendor/dashboard" : role === "NGO" ? "/ngo/dashboard" : "/volunteer/dashboard") : "/"} className="flex items-center gap-2.5 group">
              <motion.div
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 border border-emerald-300/30"
              >
                <Leaf className="w-5 h-5 text-white" />
              </motion.div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                  Zero<span className="text-emerald-400">Waste</span>
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400 opacity-80 group-hover:scale-125 transition-transform" />
                </span>
                <span className="text-[10px] font-semibold text-emerald-400/80 tracking-widest uppercase -mt-1">
                  Sustainability
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 text-slate-300 hover:text-white group"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-0 bg-emerald-500/15 border border-emerald-500/30 rounded-xl shadow-inner shadow-emerald-500/20"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-emerald-400" : "text-slate-400 group-hover:text-emerald-300"}`} />
                    <span className={`relative z-10 ${isActive ? "text-emerald-400 font-semibold" : ""}`}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Right Action Icons / Profile / Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* Notifications Icon Button */}
                  <Link
                    to="/notifications"
                    className="relative p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-emerald-500/40 transition duration-200"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4 text-slate-300 hover:text-emerald-400" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 hover:border-emerald-500/50 transition duration-200"
                    >
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold text-xs flex items-center justify-center shadow-md">
                        {userInitials}
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-xs font-semibold text-white truncate max-w-[100px]">
                          {user?.name || "My Account"}
                        </span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${roleBadge.color}`}>
                        {roleBadge.text}
                      </span>
                      <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${profileDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Animated Dropdown Menu */}
                    <AnimatePresence>
                      {profileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl py-2 z-50 divide-y divide-slate-800"
                        >
                          <div className="px-4 py-2.5">
                            <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                            <p className="text-sm font-semibold text-white truncate">{user?.email || user?.name || "User"}</p>
                          </div>

                          <div className="py-1">
                            <Link
                              to="/myprofile"
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-emerald-500/10 transition"
                            >
                              <User className="w-4 h-4 text-emerald-400" />
                              View Profile
                            </Link>
                            <Link
                              to="/updateprofile"
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-emerald-500/10 transition"
                            >
                              <Sparkles className="w-4 h-4 text-teal-400" />
                              Edit Profile
                            </Link>
                            <Link
                              to="/notifications"
                              className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-emerald-500/10 transition"
                            >
                              <Bell className="w-4 h-4 text-blue-400" />
                              Notifications
                            </Link>
                          </div>

                          <div className="py-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition font-medium"
                            >
                              <LogOut className="w-4 h-4 text-rose-400" />
                              Sign Out
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 shadow-md shadow-emerald-500/20 transition duration-200 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle Button */}
            <div className="flex items-center gap-2 md:hidden">
              {isAuthenticated && (
                <Link
                  to="/notifications"
                  className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300"
                >
                  <Bell className="w-4 h-4 text-emerald-400" />
                </Link>
              )}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 hover:text-white"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Sliding Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-2xl overflow-hidden px-4 pt-3 pb-6 space-y-3"
            >
              {isAuthenticated && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold flex items-center justify-center">
                    {userInitials}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-sm font-bold text-white truncate">{user?.name || "User"}</span>
                    <span className="text-xs text-slate-400 truncate">{user?.email}</span>
                  </div>
                  <span className={`ml-auto text-xs px-2.5 py-0.5 rounded-full border font-bold ${roleBadge.color}`}>
                    {roleBadge.text}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition ${isActive
                        ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                        : "text-slate-300 hover:bg-slate-800/60"
                        }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-400"}`} />
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              {isAuthenticated ? (
                <div className="pt-2 border-t border-slate-800 space-y-1">
                  <Link
                    to="/myprofile"
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800/60"
                  >
                    <User className="w-4 h-4 text-emerald-400" />
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-slate-800 flex flex-col gap-2">
                  <Link
                    to="/"
                    className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-200 bg-slate-900 border border-slate-800"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="w-full text-center py-2.5 rounded-xl text-sm font-semibold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300"
                  >
                    Register
                  </Link>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
