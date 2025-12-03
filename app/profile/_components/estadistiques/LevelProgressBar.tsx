"use client";

import { getProgressToNextLevel } from "@/app/_lib/utils/leveling_utils";
import { Progress } from "antd";
import Paragraph from "antd/es/typography/Paragraph";
import Title from "antd/es/typography/Title";

interface LevelProgressBarProps {
  totalPages: number;
  currentLevel: number;
}

const LevelProgressBar: React.FC<LevelProgressBarProps> = ({
  totalPages,
  currentLevel,
}) => {
  const progress = getProgressToNextLevel(totalPages, currentLevel);
  const percentage = Math.min(100, Math.max(0, progress.percentageToNextLevel));

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Title level={4}>Nivell {currentLevel}</Title>
      <Progress
        percent={percentage}
        format={() =>
          `${progress.progressInLevel} / ${
            progress.nextLevelPages - progress.currentLevelPages
          } pàgines`
        }
        status="active"
      />
      <Paragraph style={{ marginTop: "0.5rem", color: "#666" }}>
        Has llegit {totalPages} pàgines en total. Necessites{" "}
        {progress.nextLevelPages - totalPages} pàgines més per arribar al nivell{" "}
        {currentLevel + 1}.
      </Paragraph>
    </div>
  );
};

export default LevelProgressBar;
