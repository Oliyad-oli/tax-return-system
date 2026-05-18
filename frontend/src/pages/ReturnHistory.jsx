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

              <th className="p-4 text-left">
                Invoice
              </th>

              <th className="p-4 text-left">
                Amount
              </th>

              <th className="p-4 text-left">
                Status
              </th>

              <th className="p-4 text-left">
                Notification
              </th>

              <th className="p-4 text-left">
                Validation
              </th>

              <th className="p-4 text-left">
                Date
              </th>

            </tr>

          </thead>

          <tbody>

            {returns.map((item) => (

              <tr
                key={item.id}
                className="border-b hover:bg-gray-50"
              >

                <td className="p-4">
                  {item.invoiceNumber}
                </td>

                <td className="p-4">
                  {item.amount}
                </td>

                <td className="p-4">

                  <span
                    className={`px-3 py-1 rounded-full text-sm text-white
                    ${
                      item.status === "APPROVED"
                        ? "bg-green-600"
                        : item.status === "FLAGGED"
                        ? "bg-yellow-500"
                        : "bg-red-600"
                    }`}
                  >
                    {item.status}
                  </span>

                </td>

                <td className="p-4">
                  {item.notificationMessage}
                </td>

                <td className="p-4">

                  <span
                    className={`font-semibold
                    ${
                      item.invoiceValidated
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {
                      item.invoiceValidated
                        ? "VALID"
                        : "INVALID"
                    }
                  </span>

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