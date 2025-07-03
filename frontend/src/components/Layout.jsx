import React from "react";
import Slidebar from "./Slidebar";
import Navbar from "./Navbar";

const Layout = ({children, showSidebar = false, friendRequestCount = 0 }) => {
  return (
    <div className="min-h-screen">
      <div className="flex">
        {showSidebar && <Slidebar friendRequestCount={friendRequestCount} />}

        <div className="flex-1 flex flex-col">
          <Navbar friendRequestCount={friendRequestCount} />
          <main className="flex-1 overflow-y-auto">
            {React.isValidElement(children) && children.type && children.type.name === 'HomePage'
              ? React.cloneElement(children, { friendRequestCount })
              : children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
