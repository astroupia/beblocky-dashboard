"use client";
import { Slide } from "@/hooks/user-courses";
import { UptimeTracker } from "../uptime-tracker";
import IdePageBody from "./ide-body/ide-body";
import IdePageHeader from "./ide-header/ide-header";
import styles from "./ide-page.module.css"; // Import the CSS module
import { CoinProvider } from "./services/coinContext";
import { NightProvider } from "./services/nightContext";
import { SettingProvider } from "./services/settingContext";
const IdePage = ({
  slides,
  courseId,
}: {
  slides: Slide[];
  courseId: number;
}) => {
  return (
    <div className={styles["ide-page-container"]}>
      <UptimeTracker courseId={courseId} />
      <CoinProvider>
        <NightProvider>
          <SettingProvider>
            <IdePageHeader></IdePageHeader>
            <IdePageBody slides={slides} courseId={courseId}></IdePageBody>
          </SettingProvider>
        </NightProvider>
      </CoinProvider>
    </div>
  );
};

export default IdePage;
