import React from "react";
import Head from "next/head";

const Sidebar = ({ monsters, onDragStart }) => {
  return (
    <>
      <div className="sidebar">
        {monsters.map((monster) => (
          <img
            key={monster.name}
            className="monster-icon"
            src={monster.image}
            title={monster.name}
            alt={monster.name}
            onDragStart={onDragStart}
            draggable
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
      `}</style>
    </>
  );
};

export default Sidebar;
