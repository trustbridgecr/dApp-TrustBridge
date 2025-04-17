"use client";

import useSettings from "./hooks/settings.hook";
import ProfileSection from "./profileSection";

const Settings = () => {
  const { currentTab, saveProfile } = useSettings();

  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex flex-col lg:flex-row h-screen">
        <div className="flex-1 flex flex-col h-auto lg:h-3/4">
          <main className="flex-1 p-8">
            {currentTab === "profile" && (
              <ProfileSection onSave={saveProfile} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Settings;
