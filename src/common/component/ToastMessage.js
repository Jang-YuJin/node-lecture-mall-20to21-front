import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './ToastMessage.style.css';

function CustomNotification({
  closeToast,
  data,
  toastProps,
}) {
  const isColored = toastProps.theme === 'colored';

  return (
    <div className="codesnack-toast">
      <strong className="toast-title">{data.title}</strong>
      <p className="toast-content">{data.content}</p>
    </div>
  );
}

const ToastMessage = () => {
  const { toastMessage } = useSelector((state) => state.ui);
  console.log("here", toastMessage);
  useEffect(() => {
    if (toastMessage) {
      const { message, detail, status } = toastMessage;
      if (message !== "" && status !== "") {
        toast[status](CustomNotification, {data: {title: message, content: detail}}, { theme: "colored" });
      }
    }
  }, [toastMessage]);
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default ToastMessage;
