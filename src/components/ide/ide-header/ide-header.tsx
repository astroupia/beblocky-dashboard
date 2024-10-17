import { useAuthContext } from "@/components/context/auth-context";
import { cn } from "@/lib/utils";
import {
  faCoins,
  faGear,
  faMoon,
  faSun,
} from "@fortawesome/free-solid-svg-icons/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/index";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import Logo from "../../../../public/assets/images/logo.png";
import { CoinContext } from "../services/coinContext";
import { NightContext } from "../services/nightContext";
import { SettingContext } from "../services/settingContext"; // Replace with the actual import path
import styles from "./ide-header.module.css";
const IdePageHeader: React.FC = () => {
  const { user } = useAuthContext();
  const [showSetting, setShowSetting] = useState<boolean>(false);
  const { isNight, setIsNight } = useContext(NightContext); // Replace with the actual context
  const { coin, setCoin } = useContext(CoinContext); // Replace with the actual context
  function toggleNight() {
    setIsNight(!isNight);
    localStorage.setItem("isNight", isNight ? "false" : "true");
  }

  useEffect(() => {
    var night = localStorage.getItem("isNight") == "true";
    setIsNight(night ? true : false);
  }, []);

  return (
    <>
      <div
        className={styles["header-container"]}
        style={{
          backgroundColor: `${isNight ? "#1A1A1A" : "white"}`,
          color: `${isNight ? "white" : "grey"}`,
        }}
      >
        <Link className={styles["header-image-container"]} href="/dashboard">
          {!isNight && (
            <Image
              src={Logo}
              alt="BeBlocky Logo"
              className={cn(styles["header-image"], "h-35 w-25")}
            />
          )}
          {isNight && (
            <Image
              src={Logo}
              alt="BeBlocky Logo"
              className={cn(styles["header-image"], "h-35 w-35")}
            />
          )}
        </Link>

        <div className={styles["icons-container"]}>
          <div className={styles["icon-container"]}>
            <h4>{coin.toFixed(0)}</h4>
          </div>
          <div className={styles["icon-container"]}>
            <FontAwesomeIcon icon={faCoins} style={{ color: "gold" }} />
          </div>

          <div className={styles["icon-container"]}>
            {!isNight && (
              <FontAwesomeIcon
                icon={faSun}
                style={{ color: "orange" }}
                onClick={toggleNight}
              />
            )}
            {isNight && (
              <FontAwesomeIcon
                icon={faMoon}
                style={{ color: "white" }}
                onClick={toggleNight}
              />
            )}
          </div>
          <div className={styles["icon-container"]}>
            <FontAwesomeIcon
              icon={faGear}
              onClick={() => setShowSetting(!showSetting)}
            />
          </div>
          <div className={styles["name-container"]}>
            <h4
              style={{
                color: `${isNight ? "white" : "black"}`,
                fontFamily: "monospace",
                marginRight: "0.6rem",
              }}
            >
              {user?.displayName}
            </h4>
          </div>
        </div>
      </div>
      {showSetting && <SettingMenu />}
    </>
  );
};

const SettingMenu: React.FC = () => {
  const defaultSetting = {
    fontSize: 16,
    theme: "dracula",
    fullScreen: false,
  };
  // Use the SettingContext to access the context values
  const { setting, setSetting } = useContext(SettingContext) || {
    setting: defaultSetting,
    setSetting: () => {},
  };

  const { fontSize, theme } = setting; // Access the values from the context

  const themes = [
    "chrome",
    "chaos",
    "cobalt",
    "clouds",
    "dawn",
    "eclipse",
    "crimson_editor",
    "dreamweaver",
    "gob",
    "github",
    "gruvbox",
    "xcode",
  ];

  const fullScreen = () => {
    document.documentElement.requestFullscreen();
  };

  return (
    <>
      <div>
        <div className={styles["setting-menu"]}>
          <p>CODE EDITOR:</p>
          <div className={styles["setting"]}>
            <label htmlFor="customRange1">FONT SIZE</label>
            <br />
            <input
              type="range"
              className={styles["form-range"]}
              id="customRange1"
              value={fontSize}
              onChange={(e) =>
                setSetting({ ...setting, fontSize: parseInt(e.target.value) })
              }
            />
          </div>
          <div className={styles["setting"]}>
            <label htmlFor="full-screen">FULL SCREEN:</label>
            <br />
            <button id="full-screen" onClick={fullScreen}>
              FullScreen
            </button>
          </div>
          <div className={styles["setting"]}>
            <label htmlFor="theme">THEME</label>
            <br />
            <select
              value={theme}
              onChange={(e) =>
                setSetting({ ...setting, theme: e.target.value })
              }
            >
              <option value="dracula">dracula</option>
              {themes.map((themeOption, index) => (
                <option key={index} value={themeOption}>
                  {themeOption}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default IdePageHeader;
