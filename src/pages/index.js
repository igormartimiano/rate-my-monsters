import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { saveAs } from "file-saver";
import qs from "qs";

import DropRow from "../components/DropRow";
import Sidebar from "../components/Sidebar";

const Home = ({ monsters }) => {
  const router = useRouter();
  const [draftMonsters, setDraftMonsters] = useState(monsters);
  const [monstersByStatus, setMonstersByStatus] = useState({
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
  const mainContentElem = useRef(null);

  const onDragStartHandler = ({ target }, status) => {
    event.dataTransfer.setData(
      "draggedMonster",
      JSON.stringify({
        name: target.title,
        image: target.src,
        id: target.id,
        status: status,
      })
    );
  };

  const parseMonsterDataFromDragEvent = () => {
    let monsterFromDrag = JSON.parse(
      event.dataTransfer.getData("draggedMonster")
    );
    monsterFromDrag.id = Number(monsterFromDrag.id);

    return monsterFromDrag;
  };

  const onDragOverHandler = (event) => {
    event.preventDefault();
  };

  const onDropHandler = ({ event, monstersByStatus, status }) => {
    event.preventDefault();

    const draggedMonster = parseMonsterDataFromDragEvent(event);

    const filterMonsterById = (monsters) =>
      monsters.filter((monsterObj) => {
        if (Number(monsterObj.id) !== Number(draggedMonster.id)) {
          return monsterObj;
        }
      });

    if (status === draggedMonster.status) {
      return;
    }

    const nextState = {
      ...monstersByStatus,
      [status]: {
        ...monstersByStatus[status],
        monsters: [draggedMonster, ...monstersByStatus[status].monsters],
      },
    };

    if (draggedMonster.status) {
      nextState[draggedMonster.status] = {
        ...monstersByStatus[draggedMonster.status],
        monsters: filterMonsterById(
          monstersByStatus[draggedMonster.status].monsters
        ),
      };
    }

    setDraftMonsters(filterMonsterById(draftMonsters));
    setMonstersByStatus(nextState);
  };

  return (
    <div>
      <Head>
        <title>Order my monsters</title>
      </Head>

      <div className="page-wrapper">
        {draftMonsters.length > 0 && (
          <Sidebar monsters={draftMonsters} onDragStart={onDragStartHandler} />
        )}
        <main className="main">
          <div className="main-container" ref={mainContentElem}>
            {Object.keys(monstersByStatus).map((status) => {
              return (
                <DropRow
                  key={status}
                  monsters={monstersByStatus[status].monsters}
                  status={status}
                  statusDesc={monstersByStatus[status].description}
                  onDragStart={onDragStartHandler}
                  onDragOver={onDragOverHandler}
                  onDrop={(event) =>
                    onDropHandler({
                      event,
                      monstersByStatus,
                      status: status,
                    })
                  }
                />
              );
            })}
          </div>
          <button
            onClick={async () => {
              // html2canvas uses window, has to be lazy loaded
              const html2canvas = await import("html2canvas");
              const canvas = await html2canvas.default(mainContentElem.current);

              canvas.toBlob((blob) => {
                saveAs(blob, "my-monsters-rated.png");
              });
            }}
          >
            Download screenshot
          </button>
          <button
            onClick={() => {
              const urlParam = Object.keys(monstersByStatus).reduce(
                (acc, status, i) => {
                  return {
                    ...acc,
                    [status]: monstersByStatus[status].monsters.map(
                      (monster) => monster.id
                    ),
                  };
                },
                {}
              );

              console.log(urlParam);
              console.log(
                qs.stringify(urlParam, { encode: false, arrayFormat: "comma" })
              );
            }}
          >
            Copy shareable link
          </button>
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
          max-height: 100vh;
          max-width: 100%;
          width: calc(100% - 20rem);
          padding: 2rem;
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
