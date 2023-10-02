import { useEffect, useState } from "react";

export const UptimeTracker = ({ courseId }: { courseId: number }) => {
  const [startTime, setStartTime] = useState<Date>();
  useEffect(() => {
    setStartTime(new Date());
    return () => {
      if (startTime) {
        const duration = new Date().getTime() - startTime.getTime();
        alert(duration);
      }
    };
  }, []);
  return <div></div>;
};
