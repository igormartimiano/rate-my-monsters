import React, { useState, useRef, useEffect } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { saveAs } from "file-saver";
import qs from "qs";

import DropRow from "../../components/DropRow";
import Sidebar from "../../components/Sidebar";
import { getQs, parseQsWithCommas } from "../../lib/utils";
import { getDragPayload, setDragPayload } from "../../lib/drag-n-drop";

const filterMonsterById = (monsters, id) =>
  monsters.filter((monsterObj) => {
    if (monsterObj.id !== id) {
      return monsterObj;
    }
  });

const Home = ({ monsters }) => {
  const router = useRouter();
  const mainContentElem = useRef(null);
  const [isProcessingScreenshot, setProcessingScreenshot] = useState(false);
  const [monstersByStatusQs, setMonstersByStatusQs] = useState(
    getQs(router.asPath)
  );
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

  const persistAsQueryString = (monsters = monstersByStatus) => {
    const queryString = qs.stringify(
      // Returns simplified array for monsters ordered by status
      Object.keys(monsters).reduce((acc, status, i) => {
        const queryStringObj = { ...acc };
        const currMonsters = monsters[status].monsters;

        if (currMonsters.length > 0) {
          queryStringObj[status] = currMonsters.map((monster) => monster.id);
        }

        return queryStringObj;
      }, {}),
      {
        encode: false,
        arrayFormat: "comma",
      }
    );

    router.push({
      pathname: "/mhw",
      query: queryString,
    });

    setMonstersByStatusQs(queryString);
  };

  useEffect(() => {
    if (router.asPath.indexOf("?") === -1) {
      return;
    }

    // Router can't parse query string as we're using commas, so we need to parse the whole path
    const persistQueryStringToState = () => {
      const queryStringArr = parseQsWithCommas(router.asPath);
      const stripQsMonstersFromDraft = (reverse = false) => {
        const ratedMonstersIdsFromQs = Object.values(queryStringArr).reduce(
          (acc, ids) => {
            // If there's only one id, qs lib parses it as a string instead of an array
            // So we normalize before mapping it
            const parsedIds = [...ids].map((id) => Number(id));
            return [...acc, ...parsedIds];
          },
          []
        );

        return draftMonsters.filter((draftMonster) => {
          const isAnyMonsterIdOnQs = ratedMonstersIdsFromQs.some(
            (ratedMonsterId) => ratedMonsterId === draftMonster.id
          );

          if (reverse ? !isAnyMonsterIdOnQs : isAnyMonsterIdOnQs) {
            return draftMonster;
          }
        });
      };

      const nextMonstersByStatusState = Object.keys(queryStringArr).reduce(
        (acc, status, i) => {
          const hatedMonsters = stripQsMonstersFromDraft();
          const statusIds = [...Object.values(queryStringArr)[i]].map((id) =>
            Number(id)
          );

          return {
            ...acc,
            [status]: {
              ...monstersByStatus[status],
              monsters: hatedMonsters.filter((hatedMonster) => {
                if (
                  statusIds.some((statusId) => statusId === hatedMonster.id)
                ) {
                  return hatedMonster;
                }
              }),
            },
          };
        },
        {}
      );

      setMonstersByStatus({
        ...monstersByStatus,
        ...nextMonstersByStatusState,
      });
      setDraftMonsters(stripQsMonstersFromDraft(true));
    };

    persistQueryStringToState();
  }, []);

  const onDragStartHandler = ({ target }, status) => {
    setDragPayload({
      event,
      id: "monster",
      payload: {
        name: target.title,
        image: target.src,
        id: target.id,
        status,
      },
    });
  };

  const onDragOverHandler = (event) => {
    event.preventDefault();
  };

  const onDropHandler = ({ event, monstersByStatus, status }) => {
    event.preventDefault();

    const monsterFromDrag = getDragPayload({ event, id: "monster" });

    if (status === monsterFromDrag.status) {
      return;
    }

    const nextState = {
      ...monstersByStatus,
      [status]: {
        ...monstersByStatus[status],
        monsters: [...monstersByStatus[status].monsters, monsterFromDrag],
      },
    };

    if (monsterFromDrag.status) {
      nextState[monsterFromDrag.status] = {
        ...monstersByStatus[monsterFromDrag.status],
        monsters: filterMonsterById(
          monstersByStatus[monsterFromDrag.status].monsters,
          monsterFromDrag.id
        ),
      };
    }

    setDraftMonsters(filterMonsterById(draftMonsters, monsterFromDrag.id));
    setMonstersByStatus(nextState);
    persistAsQueryString(nextState);
  };

  return (
    <>
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
                      status,
                    })
                  }
                />
              );
            })}
          </div>
          <button
            onClick={async () => {
              setProcessingScreenshot(true);
              // html2canvas uses window, has to be lazy loaded
              const html2canvas = await import("html2canvas");
              const canvas = await html2canvas.default(mainContentElem.current);

              canvas.toBlob((blob) => {
                saveAs(blob, "my-monsters-rated.png");
              });

              setProcessingScreenshot(false);
            }}
          >
            {isProcessingScreenshot ? "Processing..." : "Download screenshot"}
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}${window.location.pathname}?${monstersByStatusQs}`
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
    </>
  );
};

export async function getServerSideProps() {
  const res = await fetch(`http://${process.env.HOST_NAME}/api/monsters`);
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
