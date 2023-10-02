import { getProgress } from "@/actions/ide";
import { useAuthContext } from "@/components/context/auth-context";
import { Slide } from "@/hooks/user-courses";
import { useContext, useState } from "react";
import { CoinContext } from "../services/coinContext";
import IdeSlide from "./ide-slide/ide-slide"; // Import your IdeSlide component
import styles from "./ide-slides.module.css"; // Import your styles object

// export type Slide = {
//   backgroundColor: string,
//   color: string,
//   code: string,
//   title: string,
//   titleFont: string,
//   content: string,
//   contentFont: string,
//   image: string,
//   solution: string,
// }
function IdeSlides(props: {
  slides: Slide[];
  mainCode: string;
  course_id: number;
}) {
  const { coin, setCoin } = useContext(CoinContext);

  const slides = props.slides;
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = async () => {
    var progress = await extractProgress();
    const codeCompletion = checkCode();
    if (
      (currentIndex < slides.length - 1 && codeCompletion) ||
      currentIndex < progress
    ) {
      setCurrentIndex(currentIndex + 1);
      if (currentIndex > progress) {
        setCoin(checkCode() / 10 + coin);
        var progressId = `${currentIndex + 1} ${props.course_id}`;
        localStorage.setItem("progress", progressId);
      }
    } else if (currentIndex < slides.length - 1) {
      alert("You should write the code correctly to go to the next slide");
    }
  };
  const { user } = useAuthContext();
  const extractProgress = async () => {
    var { progress } = await getProgress(user!.uid);
    setCurrentIndex(parseInt(progress));
    return parseInt(progress) ?? 0;
  };
  const checkCode = () => {
    if (
      slides[currentIndex].code &&
      calculateSentencePercentage(slides[currentIndex].code, props.mainCode) >
        50
    ) {
      return calculateSentencePercentage(
        slides[currentIndex].code,
        props.mainCode
      );
    } else if (
      slides[currentIndex].solution &&
      calculateSentencePercentage(
        slides[currentIndex].solution,
        props.mainCode
      ) > 50
    ) {
      return calculateSentencePercentage(
        slides[currentIndex].code,
        props.mainCode
      );
    } else {
      return 100;
    }
  };
  const calculateSentencePercentage = (
    sentence?: string,
    paragraph?: string
  ): number => {
    if (!paragraph || !sentence) {
      return 100;
    }
    const paragraphLower = paragraph.toLowerCase();
    const sentenceLower = sentence.toLowerCase();
    const sentenceWords = sentenceLower.replace(/[.,?!]/g, "").split(" ");
    const sentenceLength = sentenceWords.length;
    const matchingWords = sentenceWords.filter((word: any) =>
      paragraphLower.includes(word)
    );
    const matchingWordCount = matchingWords.length;
    const percentage = (matchingWordCount / sentenceLength) * 100;
    return percentage;
  };

  return (
    <div className={styles["courser"]}>
      <div className={styles["dots-container"]}>
        {slides.map((course: any, courseIndex: any) => (
          <div
            key={courseIndex}
            className={
              courseIndex <= currentIndex
                ? `${styles.dot} ${styles["completed-course"]}`
                : `${styles.dot} ${styles["new-course"]}`
            }
            onClick={() => goToSlide(courseIndex)}
          ></div>
        ))}
      </div>
      <div className={styles.overlay}>
        <div onClick={goToPrevious} className={styles["left-arrow"]}>
          <p>❰</p>
        </div>
        <div onClick={goToNext} className={styles["right-arrow"]}>
          <p>❱</p>
        </div>
      </div>
      <IdeSlide
        backgroundColor={slides[currentIndex].backgroundColor}
        code={slides[currentIndex].code}
        title={slides[currentIndex].title}
        titleFont={slides[currentIndex].titleFont}
        content={slides[currentIndex].content}
        contentFont={slides[currentIndex].contentFont}
        image={slides[currentIndex].image}
      />
    </div>
  );
}

export default IdeSlides;
