import { useSelector, useDispatch } from "react-redux";
import { setEnvironment } from "../store/actions/orderBookActions";

export default function Header({ isConnected }) {
  const dispatch = useDispatch();
  const { systemEnvironment } = useSelector((state) => state.orderBooks);

  const onTestNetChange = (e) => {
    dispatch(setEnvironment(e.target.value));
  };

  return (
    <div
      style={{
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span>
        {isConnected ? (
          <div className="system-connected"></div>
        ) : (
          <div className="system-disconnected"></div>
        )}
      </span>
      <h1>CoinRoutes Frontend Test</h1>
      <select value={systemEnvironment} onChange={onTestNetChange}>
        <option value="TEST_NET">Test Net</option>
        <option value="MAIN_NET">Main Net</option>
      </select>
    </div>
  );
}
