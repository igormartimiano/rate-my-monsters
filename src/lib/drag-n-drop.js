export const setDragPayload = ({ id, payload, event }) => {
  event.dataTransfer.setData(id, JSON.stringify(payload));
};

export const getDragPayload = ({ id, event }) => {
  const payload = JSON.parse(event.dataTransfer.getData(id));
  payload.id = Number(payload.id);

  return payload;
};
