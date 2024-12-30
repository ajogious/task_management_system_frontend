function Message({ message, alertType }) {
  return (
    <div
      className={`alert alert-${alertType}`}
      style={{
        position: "absolute",
        right: "150px",
        top: "80px",
        fontSize: "18px",
      }}
    >
      {message}
    </div>
  );
}

export default Message;
