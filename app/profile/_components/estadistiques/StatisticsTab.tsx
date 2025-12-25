"use client";
import UserDTO from "@/app/_lib/models/UserDTO";
import { UserStats } from "@/app/_lib/models/UserStats";
import { Card, Flex, message, Spin, Statistic } from "antd";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import MiniBookCard from "@/app/_components/MiniBookCard";
import LevelProgressBar from "./LevelProgressBar";
import styles from "./StatisticsTab.module.css";
import { authFetch } from "@/app/_lib/utils/authFetch";

interface StatisticsTabProps {
  user: UserDTO;
}
const StatisticsTab: React.FC<StatisticsTabProps> = ({ user }) => {
  const totalPages = user.total_pages_read ?? 0;
  const currentLevel = user.level ?? 1;
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await authFetch("/api/user/stats");
        if (!response.ok) {
          message.error("Error carregant les estadístiques");
          return;
        }
        const data = (await response.json()) as UserStats;
        setStats(data);
      } catch (error) {
        console.error(error);
        message.error("Error carregant les estadístiques");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ minHeight: "400px" }}>
        <Spin size="large" />
      </Flex>
    );
  }

  return (
    <>
      <Title level={2}>Estadístiques</Title>
      <LevelProgressBar totalPages={totalPages} currentLevel={currentLevel} />

      {stats && (
        <>
          <Title level={3}>Destacats</Title>
          <div className={styles.statsGrid}>
            {stats.highestRatedBook ? (
              <Flex vertical align="center" gap="middle">
                <Title level={4}>Llibre llegit més valorat</Title>
                <MiniBookCard
                  thumbnail={stats.highestRatedBook.thumbnail}
                  title={stats.highestRatedBook.title}
                />
                <Statistic
                  title="Valoració mitjana"
                  value={
                    stats.highestRatedBook.avg_rating
                      ? Number(stats.highestRatedBook.avg_rating).toFixed(1)
                      : "N/A"
                  }
                  suffix="/ 5"
                />
              </Flex>
            ) : (
              <p>No hi ha dades disponibles</p>
            )}

            {stats.longestBook ? (
              <Flex vertical align="center" gap="middle">
                <Title level={4}>Llibre més llarg</Title>
                <MiniBookCard
                  thumbnail={stats.longestBook.thumbnail}
                  title={stats.longestBook.title}
                />
                <Statistic
                  title="Pàgines"
                  value={stats.longestBook.page_count}
                />
              </Flex>
            ) : (
              <p>No hi ha dades disponibles</p>
            )}

            {stats.mostReadAuthor ? (
              <Flex vertical align="center" gap="middle">
                <Title level={4}>Autor més llegit</Title>
                <MiniBookCard
                  thumbnail={stats.mostReadAuthor.thumbnail}
                  title={stats.mostReadAuthor.authors}
                />
                <Statistic
                  title="Llibres llegits"
                  value={stats.mostReadAuthor.book_count}
                />
              </Flex>
            ) : (
              <p>No hi ha dades disponibles</p>
            )}
          </div>

          <Title level={3} style={{ marginTop: "2rem" }}>
            Resum
          </Title>
          <div className={styles.summaryGrid}>
            <Statistic
              title="Nombre de llibres llegits"
              value={stats.totalBooksRead}
            />
            <Statistic
              title="Nombre de pàgines llegides"
              value={stats.totalPagesRead}
            />
            <Statistic
              title="Valoració mitjana"
              value={Number(stats.avgRating).toFixed(1)}
              suffix="/ 5"
            />
          </div>
        </>
      )}
    </>
  );
};

export default StatisticsTab;
