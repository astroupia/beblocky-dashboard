import { useEffect, useRef } from "react";
// Import your custom hook for code editor service
import { cn } from "@/lib/utils";
import { faShareSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ide-preview.module.css"; // Import your CSS module here
const IdePreviewWindow = ({ mainCode }: any) => {
  const formattedHtmlRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframeDocument =
      formattedHtmlRef.current?.contentDocument ||
      formattedHtmlRef.current?.contentWindow?.document;
    if (iframeDocument) {
      iframeDocument.open();
      iframeDocument.write(mainCode);
    }
  }, [mainCode]);

  const openInNewTab = () => {
    const newTab = window.open("", "_blank");
    if (newTab) {
      newTab.document.write(mainCode);
    }
  };

  return (
    <div
      className={cn(
        " w-full border-2 border-brand-primary-orange-400 rounded-b-3xl h-full"
      )}
    >
      <div className=" w-full border-b flex px-4 justify-between py-2">
        <div className=" flex items-center gap-1">
          <div className=" bg-green-600 w-3 h-3 rounded-full"></div>
          <div className=" bg-yellow-600 w-3 h-3 rounded-full"></div>
          <div className=" bg-red-600 w-3 h-3 rounded-full"></div>
        </div>
        <div className=" bg-gray-200 flex-grow mx-8 rounded-sm">
          <p className=" text-center">Index.html</p>
        </div>
        <div></div>
      </div>
      <iframe className={cn("")} ref={formattedHtmlRef}></iframe>
      <button className={styles["preview-button"]} onClick={openInNewTab}>
        <FontAwesomeIcon className={styles["icon"]} icon={faShareSquare} />
      </button>
    </div>
  );
};

export default IdePreviewWindow;
