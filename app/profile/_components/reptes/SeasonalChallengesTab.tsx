"use client";
import UserDTO from "@/app/_lib/models/UserDTO";
import { UserChallengeWithDetails } from "@/app/_lib/models/UserChallenge";
import { Button, Flex, message, Progress, Spin } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import styles from "./ChallengesTab.module.css";

interface SeasonalChallengesTabProps {
  user: UserDTO;
}

const SeasonalChallengesTab: React.FC<SeasonalChallengesTabProps> = ({
  user,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);
  const [challenges, setChallenges] = useState<UserChallengeWithDetails[]>([]);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams({
          completed: showCompleted.toString(),
        });
        const response = await fetch(
          `/api/user/challenges?${searchParams.toString()}`
        );

        if (!response.ok) {
          message.error("Error carregant els reptes");
          return;
        }

        const data = (await response.json()) as UserChallengeWithDetails[];
        setChallenges(data);
      } catch (error) {
        console.error(error);
        message.error("Error carregant els reptes");
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [showCompleted]);

  const calculateProgress = (challenge: UserChallengeWithDetails): number => {
    const progress = (challenge.progress_value / challenge.challenge.goal_value) * 100;
    return Math.min(progress, 100);
  };

  return (
    <Flex justify="center" align="center" vertical style={{ width: "100%" }}>
      <Button
        type="primary"
        onClick={() => setShowCompleted(!showCompleted)}
        className={styles.toggleButton}
      >
        {showCompleted ? "Veure reptes actius" : "Veure reptes completats"}
      </Button>

      {loading ? (
        <Flex justify="center" align="center" style={{ minHeight: "200px" }}>
          <Spin size="large" />
        </Flex>
      ) : challenges.length === 0 ? (
        <Title level={4}>
          {showCompleted
            ? "No has completat cap repte encara"
            : "No hi ha reptes actius"}
        </Title>
      ) : (
        <ul className={styles.challengesList}>
          {challenges.map((userChallenge) => (
            <li key={userChallenge.challenge.id} className={styles.challengeItem}>
              <div className={styles.badgeContainer}>
                <img
                  src={`/${userChallenge.challenge.badge_url}`}
                  alt={userChallenge.challenge.title}
                  className={styles.badgeImage}
                />
              </div>
              <div className={styles.challengeContent}>
                <h3 className={styles.challengeTitle}>
                  {userChallenge.challenge.title}
                </h3>
                <p className={styles.challengeDescription}>
                  {userChallenge.challenge.description}
                </p>
                {showCompleted ? (
                  <p className={styles.challengeEndDate}>
                    Completat: {dayjs(userChallenge.updated_at).format("DD/MM/YYYY")}
                  </p>
                ) : (
                  <p className={styles.challengeEndDate}>
                    Acaba: {dayjs(userChallenge.challenge.end_date).format("DD/MM/YYYY")}
                  </p>
                )}
                <div className={styles.progressContainer}>
                  <Progress
                    percent={calculateProgress(userChallenge)}
                    format={() =>
                      `${userChallenge.progress_value} / ${userChallenge.challenge.goal_value}`
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

export default SeasonalChallengesTab;
