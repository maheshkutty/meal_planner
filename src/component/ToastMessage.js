import { ToastAndroid } from "react-native";

const ToastMessage = (msg) => {
  ToastAndroid.showWithGravityAndOffset(
    msg,
    ToastAndroid.LONG,
    ToastAndroid.CENTER,
    25,
    30
  );
};

export default ToastMessage;
