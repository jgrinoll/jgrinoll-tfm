"use client";
import UserDTO from "@/app/_lib/models/UserDTO";
import { UserAchievementWithDetails } from "@/app/_lib/models/UserAchievement";
import { Button, Flex, message, Progress, Spin } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./ChallengesTab.module.css";

interface AchievementsTabProps {
  user: UserDTO;
}

const AchievementsTab: React.FC<AchievementsTabProps> = ({ user }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [achievements, setAchievements] = useState<
    UserAchievementWithDetails[]
  >([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams({
          completed: showCompleted.toString(),
        });
        const response = await fetch(
          `/api/user/achievements?${searchParams.toString()}`
        );

        if (!response.ok) {
          message.error("Error carregant els assoliments");
          return;
        }

        const data = (await response.json()) as UserAchievementWithDetails[];
        setAchievements(data);
      } catch (error) {
        console.error(error);
        message.error("Error carregant els assoliments");
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [showCompleted]);

  const calculateProgress = (
    achievement: UserAchievementWithDetails
  ): number => {
    if (!achievement.progress_value) return 0;
    const progress =
      (achievement.progress_value / achievement.achievement.condition_value) *
      100;
    return Math.min(progress, 100);
  };

  return (
    <Flex justify="center" align="center" vertical style={{ width: "100%" }}>
      <Button
        type="primary"
        onClick={() => setShowCompleted(!showCompleted)}
        className={styles.toggleButton}
      >
        {showCompleted
          ? "Veure assoliments pendents"
          : "Veure assoliments completats"}
      </Button>

      {loading ? (
        <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
          <Spin size="large" />
        </Flex>
      ) : achievements.length === 0 ? (
        <Title level={4}>
          {showCompleted
            ? "No has completat cap assoliment encara"
            : "No hi ha assoliments pendents"}
        </Title>
      ) : (
        <ul className={styles.challengesList}>
          {achievements.map((userAchievement) => (
            <li
              key={userAchievement.achievement.id}
              className={styles.challengeItem}
            >
              <div className={styles.badgeContainer}>
                <img
                  src={`/${userAchievement.achievement.badge_url}`}
                  alt={userAchievement.achievement.name}
                  className={styles.badgeImage}
                />
              </div>
              <div className={styles.challengeContent}>
                <h3 className={styles.challengeTitle}>
                  {userAchievement.achievement.name}
                </h3>
                <p className={styles.challengeDescription}>
                  {userAchievement.achievement.description}
                </p>
                {showCompleted && (
                  <p className={styles.challengeEndDate}>
                    Completat: {dayjs(userAchievement.earned_at).format("DD/MM/YYYY")}
                  </p>
                )}
                <div className={styles.progressContainer}>
                  <Progress
                    percent={calculateProgress(userAchievement)}
                    format={() =>
                      `${userAchievement.progress_value || 0} / ${userAchievement.achievement.condition_value}`
                    }
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Flex>
  );
};

export default AchievementsTab;
