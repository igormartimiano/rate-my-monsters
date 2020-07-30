import React, { useState } from "react";
import Head from "next/head";
import DropRow from "../components/DropRow";
import Sidebar from "../components/Sidebar";

const Home = ({ monsters }) => {
  const [monsterInfos, setMonsterInfos] = useState({
    draft: monsters,
    loved: {
      description: "I absolutely love these 😍",
      monsters: [],
    },
    liked: {
      description: "Good hunts",
      monsters: [],
    },
    alright: {
      description: "I don’t mind hunting",
      monsters: [],
    },
    annoying: {
      description: "Annoying hunts",
      monsters: [],
    },
    disgusting: {
      description: "Abominations, shouldn’t exist 🤮",
      monsters: [],
    },
  });

  const onDragStartHandler = ({ target }, status) => {
    event.dataTransfer.setData(
      "draggedMonster",
      JSON.stringify({
        name: target.title,
        image: target.src,
        status: status,
      })
    );
  };

  const onDragOverHandler = (event) => {
    event.preventDefault();
  };

  const onDropHandler = ({ event, monsterInfos, areaStatus }) => {
    event.preventDefault();

    const monster = JSON.parse(event.dataTransfer.getData("draggedMonster"));
    const filterMonsterByName = (monsters) =>
      monsters.filter((monsterObj) => {
        if (monsterObj.name !== monster.name) {
          return monsterObj;
        }
      });

    if (areaStatus === monster.status) {
      return;
    }

    const nextState = {
      ...monsterInfos,
      [areaStatus]: {
        ...monsterInfos[areaStatus],
        monsters: [monster, ...monsterInfos[areaStatus].monsters],
      },
      draft: filterMonsterByName(monsterInfos.draft),
    };

    if (monster.status) {
      nextState[monster.status] = {
        ...monsterInfos[monster.status],
        monsters: filterMonsterByName(monsterInfos[monster.status].monsters),
      };
    }

    setMonsterInfos(nextState);
  };

  return (
    <div>
      <Head>
        <title>Order my monsters</title>
      </Head>

      <div className="page-wrapper">
        <Sidebar
          monsters={monsterInfos.draft}
          onDragStart={onDragStartHandler}
        />
        <main className="main">
          <div className="main-container">
            {Object.keys(monsterInfos).map((monsterInfo) => {
              if (monsterInfo === "draft") {
                return;
              }

              return (
                <DropRow
                  key={monsterInfo}
                  monsters={monsterInfos}
                  status={monsterInfo}
                  statusDesc={monsterInfos[monsterInfo].description}
                  onDragStart={onDragStartHandler}
                  onDragOver={onDragOverHandler}
                  onDrop={(event) =>
                    onDropHandler({
                      event,
                      areaStatus: monsterInfo,
                      monsterInfos,
                    })
                  }
                />
              );
            })}
          </div>
        </main>
      </div>

      <style jsx>{`
        .page-wrapper {
          display: flex;
          width: 100vw;
        }

        .monster-icon {
          cursor: pointer;
          display: inline-block;
          height: 5rem;
          min-width: 5rem;
          user-select: none;
        }

        .main {
          align-items: center;
          display: flex;
          justify-content: center;
          padding: 2rem;
          width: calc(100% - 20rem);
        }

        .main-container {
          background-color: var(--color-main-container-bg);
          border-radius: 0.25rem;
          width: 90%;
        }
      `}</style>
    </div>
  );
};

export async function getStaticProps() {
  const res = await fetch("http://localhost:3000/api/monster");
  const {
    default: { monsters },
  } = await res.json();

  return {
    props: {
      monsters,
    },
  };
}

export default Home;
