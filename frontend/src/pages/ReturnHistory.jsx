import Layout from "../components/Layout";
import { useEffect, useState } from "react";

import {
  getAllReturns
} from "../services/dailyReturnService";

function ReturnHistory() {

  const [returns, setReturns] = useState([]);

  useEffect(() => {

    fetchReturns();

  }, []);

  const fetchReturns = async () => {

    try {

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      const res = await getAllReturns(
        user.email
      );

      setReturns(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  return (
    <Layout>

      <h1 className="text-3xl font-bold mb-6">
        RETURN HISTORY
      </h1>

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-900 text-white">

            <tr>
              <th className="p-4">Invoice</th>
              <th className="p-4">Amount</th>
              <th className="p-4">Description</th>
              <th className="p-4">Date</th>
            </tr>

          </thead>

          <tbody>

            {returns.map((item) => (

              <tr
                key={item.id}
                className="border-b"
              >

                <td className="p-4">
                  {item.invoiceNumber}
                </td>

                <td className="p-4">
                  {item.amount}
                </td>

                <td className="p-4">
                  {item.description}
                </td>

                <td className="p-4">
                  {item.submissionDate}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </Layout>
  );
}

export default ReturnHistory;