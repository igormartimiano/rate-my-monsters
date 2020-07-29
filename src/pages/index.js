import React, { useState } from "react";
import Head from "next/head";

const Home = ({ monsters }) => {
  const [monsterInfo, setMonsterInfo] = useState({
    draft: monsters,
    loved: [],
  });

  console.log(monsterInfo);

  return (
    <div>
      <Head>
        <title>Order my monsters</title>
      </Head>

      <div className="page-wrapper">
        <div className="sidebar">
          {monsterInfo.draft.map((monster) => (
            <img
              key={monster.name}
              className="monster-icon"
              src={monster.image}
              title={monster.name}
              alt={monster.name}
              onDragStart={({ target }) => {
                event.dataTransfer.setData(
                  "draggedMonster",
                  JSON.stringify({
                    name: target.title,
                    image: target.src,
                  })
                );
              }}
              draggable
            />
          ))}
        </div>
        <main className="main">
          <div
            className="drop-container"
            onDragOver={(event) => {
              event.preventDefault();
            }}
            onDrop={(event) => {
              event.preventDefault();

              const monster = JSON.parse(
                event.dataTransfer.getData("draggedMonster")
              );

              setMonsterInfo({
                loved: [monster, ...monsterInfo.loved],
                draft: monsterInfo.draft.filter((monsterObj) => {
                  if (monsterObj.name !== monster.name) {
                    return monsterObj;
                  }
                }),
              });
            }}
          >
            {monsterInfo.loved.length > 0 &&
              monsterInfo.loved.map((monsterObj, i) => (
                <img
                  key={monsterObj.name}
                  className="monster-icon"
                  src={monsterObj.image}
                  title={monsterObj.name}
                  alt={monsterObj.name}
                />
              ))}
          </div>
        </main>
      </div>

      <style jsx>{`
        .page-wrapper {
          display: flex;
          width: 100vw;
        }

        .sidebar {
          align-items: center;
          background-color: var(--color-sidebar-bg);
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(5rem, 1fr));
          grid-gap: 1rem;
          overflow-y: scroll;
          justify-content: center;
          height: 100vh;
          padding: 1rem;
          width: 20rem;
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

        .drop-container {
          background-color: var(--color-drop-container-bg);
          border-radius: 0.25rem;
          min-height: 80vh;
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
