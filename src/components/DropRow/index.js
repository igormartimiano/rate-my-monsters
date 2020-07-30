import React from "react";
import Head from "next/head";

const DropRow = ({
  monsters,
  status,
  statusDesc,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  return (
    <>
      <div className="container">
        <div className={`description description--${status}`}>
          {statusDesc && statusDesc}
        </div>
        <div
          className={`container--${status} drop-container`}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          {monsters[status].monsters.length > 0 &&
            monsters[status].monsters.map((monsterObj, i) => (
              <img
                key={monsterObj.name}
                className="monster-icon"
                src={monsterObj.image}
                title={monsterObj.name}
                alt={monsterObj.name}
                onDragStart={(event) => onDragStart(event, status)}
                draggable
              />
            ))}
        </div>
      </div>
      <style jsx>{`
        .container {
          display: flex;
        }

        .description {
          align-items: center;
          display: flex;
          justify-content: center;
          padding: 0.5rem;
          text-align: center;
          width: 10rem;
        }

        .description--loved {
          background-color: var(--color-loved);
        }

        .description--liked {
          background-color: var(--color-liked);
        }

        .description--alright {
          background-color: var(--color-alright);
        }

        .description--annoying {
          background-color: var(--color-annoying);
        }

        .description--disgusting {
          background-color: var(--color-disgusting);
        }

        .container--loved {
          border: 1px solid var(--color-loved);
        }

        .container--liked {
          border: 1px solid var(--color-liked);
        }

        .container--alright {
          border: 1px solid var(--color-alright);
        }

        .container--annoying {
          border: 1px solid var(--color-annoying);
        }

        .container--disgusting {
          border: 1px solid var(--color-disgusting);
        }

        .drop-container {
          margin-top: 1px;
          min-height: 15vh;
          width: 100%;
        }

        .monster-icon {
          cursor: pointer;
          display: inline-block;
          height: 5rem;
          min-width: 5rem;
          user-select: none;
        }
      `}</style>
    </>
  );
};

export default DropRow;
