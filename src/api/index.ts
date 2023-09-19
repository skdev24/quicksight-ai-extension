import axios from "axios";

const QuickSightAPI = axios.create({
  baseURL: "http://localhost:8080/",
  timeout: 10000,
});

export default QuickSightAPI;
