import React from "react";
import Head from "next/head";
import MonsterIcon from "../MonsterIcon";

const Sidebar = ({ monsters, onDragStart }) => {
  return (
    <>
      <div className="sidebar">
        {monsters.map((monster) => (
          <MonsterIcon
            key={monster.id}
            name={monster.name}
            image={monster.image}
            id={monster.id}
            onDragStart={(event) => onDragStart(event, status)}
          />
        ))}
      </div>
      <style jsx>{`
        .sidebar {
          align-items: start;
          background-color: var(--color-sidebar-bg);
          display: flex;
          flex-wrap: wrap;
          overflow-y: scroll;
          grid-gap: 1rem;
          justify-content: start;
          height: 100vh;
          width: 20rem;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
