import axios from "axios";

const API = "http://localhost:8080/api/returns";

export const submitDailyReturn = (data) =>
  axios.post(API, data);

export const getAllReturns = () =>
  axios.get(API);
export const getEInvoiceData = (invoiceNumber) =>
  axios.get(`${API}/einvoice/${invoiceNumber}`);