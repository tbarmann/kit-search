  const Error = ({message, clearError}) => {
    return (
      <div className="error">
        <div>Error: {message}</div>
        <div onClick = {() => clearError()}>X</div>
      </div>
    );
  };

  export default Error;