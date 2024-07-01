import { useSelector, useDispatch } from "react-redux";
import { setEnvironment } from "../store/actions/orderBookActions";
import { SYSTEM_ENVIRONMENT } from "../config";

export default function Header({ isConnected }) {
  const dispatch = useDispatch();
  const { systemEnvironment } = useSelector((state) => state.orderBooks);

  const onTestNetChange = (e) => {
    dispatch(
      setEnvironment(
        e.target.value === "TEST_NET"
          ? SYSTEM_ENVIRONMENT.TEST_NET
          : SYSTEM_ENVIRONMENT.MAIN_NET
      )
    );
  };

  return (
    <div
      style={{
        color: "white",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      <div className="connection-status">
        {isConnected ? (
          <div className="system-connected"></div>
        ) : (
          <div className="system-disconnected"></div>
        )}
        <span>{isConnected ? "Connected" : "Not-Connected"}</span>
      </div>
      <h1>CoinRoutes Frontend Test</h1>
      <select value={systemEnvironment} onChange={onTestNetChange}>
        <option value="TEST_NET">Test Net</option>
        <option value="MAIN_NET">Main Net</option>
      </select>
    </div>
  );
}
