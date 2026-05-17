import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function Dashboard() {
  const [selectedCard, setSelectedCard] = useState(null);
  const [ripples, setRipples] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const [rightContent, setRightContent] = useState("dashboard");

  // Handle card click with backflow animation
  const handleCardClick = (cardId, e) => {
    // Create ripple effect
    const rect = e.currentTarget.getBoundingClientRect();
    const rippleX = e.clientX - rect.left;
    const rippleY = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x: rippleX, y: rippleY, cardId };
    setRipples(prev => [...prev, newRipple]);
    
    // Remove ripple after animation
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 600);

    // Set selected card for backflow animation
    setSelectedCard(cardId);
    
    // Remove selected class after backflow animation completes
    setTimeout(() => {
      setSelectedCard(null);
    }, 400);
  };

  // Handle navigation from sidebar
  const handleNavClick = (navItem, e) => {
    if (navItem === "dailyReturn") {
      handleCardClick("daily", e);
      setTimeout(() => {
        setActiveNavItem("dailyReturn");
        setRightContent("dailyReturn");
      }, 400);
    } else if (navItem === "returnHistory") {
      handleCardClick("history", e);
      setTimeout(() => {
        setActiveNavItem("returnHistory");
        setRightContent("returnHistory");
      }, 400);
    } else {
      setActiveNavItem(navItem);
      setRightContent(navItem);
    }
  };

  // Clean up ripples on unmount
  useEffect(() => {
    return () => setRipples([]);
  }, []);

  // Render right side content based on active item
  const renderRightContent = () => {
    switch (rightContent) {
      case "dailyReturn":
        return (
          <Link to="/daily-return" className="block w-full h-full">
            <div className="h-full flex items-center justify-center p-8 animate-fadeInUp">
              <div className="text-center max-w-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce-slow">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Register Daily Return</h2>
                <p className="text-gray-500 mb-8">Submit your daily invoice return quickly and securely</p>
                <div className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <span>Get Started</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        );
      case "returnHistory":
        return (
          <Link to="/return-history" className="block w-full h-full">
            <div className="h-full flex items-center justify-center p-8 animate-fadeInUp">
              <div className="text-center max-w-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce-slow">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Return History</h2>
                <p className="text-gray-500 mb-8">View and track all your submitted returns in one place</p>
                <div className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105">
                  <span>View History</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        );
      default:
        return (
          <>
            {/* Animated header with fade-in and slide-down */}
            <div className="animate-fadeInUp">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  Taxpayer Dashboard
                </h1>
              </div>
              <p className="text-gray-500 ml-4 mb-10 text-lg animate-fadeIn animation-delay-200">
                Manage your tax returns efficiently
              </p>
            </div>

            {/* Cards grid with enhanced animations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Register Daily Return Card */}
              <div 
                onClick={(e) => {
                  if (selectedCard) return;
                  handleCardClick('daily', e);
                  setTimeout(() => setRightContent("dailyReturn"), 400);
                }}
                className={`block transform transition-all duration-500 cursor-pointer ${
                  selectedCard === 'daily' 
                    ? 'scale-95 opacity-0 translate-y-8' 
                    : 'hover:scale-105 hover:-translate-y-2'
                }`}
              >
                <div className="relative group overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {ripples.filter(r => r.cardId === 'daily').map(ripple => (
                    <span
                      key={ripple.id}
                      className="absolute w-32 h-32 bg-blue-400 rounded-full opacity-50 pointer-events-none animate-ripple"
                      style={{ left: ripple.x - 64, top: ripple.y - 64 }}
                    />
                  ))}
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-indigo-500/0 group-hover:from-blue-500/5 group-hover:to-indigo-500/5 transition-all duration-500"></div>
                  
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 blur-xl opacity-30"></div>
                  </div>
                  
                  <div className="relative p-8">
                    <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                      Register Daily Return
                    </h2>
                    
                    <p className="text-gray-500 leading-relaxed">
                      Submit daily invoice return quickly and securely
                    </p>
                    
                    <div className="mt-6 flex items-center text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                      <span className="text-sm font-medium">Get started</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </div>

              {/* Return History Card */}
              <div 
                onClick={(e) => {
                  if (selectedCard) return;
                  handleCardClick('history', e);
                  setTimeout(() => setRightContent("returnHistory"), 400);
                }}
                className={`block transform transition-all duration-500 cursor-pointer ${
                  selectedCard === 'history' 
                    ? 'scale-95 opacity-0 translate-y-8' 
                    : 'hover:scale-105 hover:-translate-y-2'
                }`}
              >
                <div className="relative group overflow-hidden rounded-2xl bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                  {ripples.filter(r => r.cardId === 'history').map(ripple => (
                    <span
                      key={ripple.id}
                      className="absolute w-32 h-32 bg-green-400 rounded-full opacity-50 pointer-events-none animate-ripple"
                      style={{ left: ripple.x - 64, top: ripple.y - 64 }}
                    />
                  ))}
                  
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500"></div>
                  
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 blur-xl opacity-30"></div>
                  </div>
                  
                  <div className="relative p-8">
                    <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                        </svg>
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-3 text-gray-800 group-hover:text-emerald-600 transition-colors duration-300">
                      Return History
                    </h2>
                    
                    <p className="text-gray-500 leading-relaxed">
                      View and track all your submitted returns
                    </p>
                    
                    <div className="mt-6 flex items-center text-emerald-500 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0">
                      <span className="text-sm font-medium">View history</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
                </div>
              </div>

            </div>

            {/* Quick stats section */}
            <div className="mt-12 pt-8 border-t border-gray-200/50 animate-fadeInUp animation-delay-600">
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="px-6 py-3">
                  <p className="text-2xl font-bold text-gray-700">24/7</p>
                  <p className="text-sm text-gray-500">Online Support</p>
                </div>
                <div className="px-6 py-3">
                  <p className="text-2xl font-bold text-gray-700">100%</p>
                  <p className="text-sm text-gray-500">Secure & Encrypted</p>
                </div>
                <div className="px-6 py-3">
                  <p className="text-2xl font-bold text-gray-700">Instant</p>
                  <p className="text-sm text-gray-500">Processing</p>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <Navbar />

      {/* Main Container with Sidebar Layout */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 relative overflow-hidden">
        
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        {/* Sidebar and Main Content */}
        <div className="relative z-10 flex">
          
          {/* LEFT SIDEBAR NAVIGATION */}
          <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 ease-in-out bg-white/80 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 min-h-screen`}>
            {/* Sidebar Header */}
            <div className="p-5 border-b border-gray-200/50 flex items-center justify-between">
              <div className={`flex items-center gap-3 ${!sidebarOpen && 'justify-center w-full'}`}>
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M6 6h12M6 18h12M5 14h14"></path>
                  </svg>
                </div>
                {sidebarOpen && (
                  <span className="font-bold text-gray-800 text-lg">Navigation</span>
                )}
              </div>
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-300"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                  )}
                </svg>
              </button>
            </div>

            {/* Navigation Items */}
            <nav className="p-4 space-y-2">
              {/* Dashboard Item */}
              <div 
                onClick={() => handleNavClick("dashboard", { currentTarget: { getBoundingClientRect: () => ({ left: 0, top: 0 }) } })}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeNavItem === "dashboard" 
                    ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 border-l-4 border-blue-500" 
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  activeNavItem === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                </div>
                {sidebarOpen && <span className="font-medium">Dashboard</span>}
              </div>

              {/* Daily Return Item */}
              <div 
                onClick={(e) => handleNavClick("dailyReturn", e)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeNavItem === "dailyReturn" 
                    ? "bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-600 border-l-4 border-blue-500" 
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  activeNavItem === "dailyReturn" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                {sidebarOpen && <span className="font-medium">Register Daily Return</span>}
              </div>

              {/* Return History Item */}
              <div 
                onClick={(e) => handleNavClick("returnHistory", e)}
                className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 ${
                  activeNavItem === "returnHistory" 
                    ? "bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 border-l-4 border-emerald-500" 
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-800"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  activeNavItem === "returnHistory" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-500"
                }`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                  </svg>
                </div>
                {sidebarOpen && <span className="font-medium">Return History</span>}
              </div>

              {/* Profile Item - Optional */}
              <div className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 opacity-50 hover:opacity-75`}>
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                {sidebarOpen && <span className="font-medium text-gray-400">Profile (Soon)</span>}
              </div>
            </nav>

            {/* Sidebar Footer */}
            {sidebarOpen && (
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200/50">
                <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-700">Taxpayer Account</p>
                    <p className="text-xs text-gray-400">Logged In</p>
                  </div>
                </div>
              </div>
            )}
          </aside>

          {/* RIGHT MAIN CONTENT AREA */}
          <main className="flex-1 p-6 md:p-8 lg:p-10 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {renderRightContent()}
            </div>
          </main>

        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes ripple {
          0% {
            transform: scale(0);
            opacity: 0.6;
          }
          100% {
            transform: scale(20);
            opacity: 0;
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animate-ripple {
          animation: ripple 0.6s ease-out forwards;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }
        
        .animation-delay-200 {
          animation-delay: 0.2s;
        }
        
        .animation-delay-400 {
          animation-delay: 0.4s;
        }
        
        .animation-delay-600 {
          animation-delay: 0.6s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </>
  );
}

export default Dashboard;