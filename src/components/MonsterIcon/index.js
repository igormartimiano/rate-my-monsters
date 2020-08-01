import React from "react";
import Head from "next/head";

const MonsterIcon = ({ id, name, image, onDragStart }) => {
  return (
    <>
      <img
        className="monster-icon"
        id={id}
        title={name}
        src={image}
        alt={name}
        onDragStart={onDragStart}
        draggable
      />
      <style jsx>{`
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

export default MonsterIcon;
