// React Libraries
import React, { useState } from 'react';
import { NavLink } from "react-router-dom";
import {
  FaBars, 
  FaTh,
  FaList,
  FaRegCalendar,
  FaRegSun,
  FaSignOutAlt
} from "../../node_modules/react-icons/fa"; // Temp icons for now, can be updated for better fit
import Logo from '../images/logo.png';
import './navbar.css';
import { AnimatePresence, motion } from "framer-motion";
import SidebarMenu from "./SidebarMenu";


const NavBar = ({children}) => {

  const[isOpen ,setIsOpen] = useState(false);
  const toggle = () => setIsOpen (!isOpen);

  const menuItem = [

    {
      path:"/courses",
      name:"Courses",
      icon:<FaList/>,
    },
    {
      path:"/schedule",
      name:"Schedule",
      icon:<FaRegCalendar/>,
    },
    {
      path:"/",
      name:"Sign Out",
      icon:<FaSignOutAlt/>,
    }
  ]

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      opacity: 1,
      width: "auto",
      transition: {
        duration: 0.2,
      },
    },
  };


	return (
    <>
      <div className="main-container">
        <motion.div
          animate={{
            width: isOpen ? "200px" : "50px",
            transition: {
              duration: 0.18,
              type: "spring",
              damping: 15,
            },
          }}
          className={`sidebar `}
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                >
                  <img style={{display: isOpen ? "block" : "none"}} src={Logo} alt="React" className="logo"/>
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars">
              <FaBars onClick={toggle} />
            </div>
          </div>
          <section className="routes">
            {menuItem.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }

              return (
                <NavLink to={route.path}  key={index} className="link" activeClassName="active" >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
        </motion.div>

        <main>{children}</main>
      </div>
    </>
	);
};
export default NavBar;