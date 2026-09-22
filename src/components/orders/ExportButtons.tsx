"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { Order } from "@/types/order";

type ExportButtonsProps = {
  orders: Order[];
};

export default function ExportButtons({ orders }: ExportButtonsProps) {
  const exportToPDF = () => {
    const document = new jsPDF();

    document.setFontSize(16);
    document.text("Orders Report", 14, 15);

    autoTable(document, {
      startY: 25,
      head: [["Order ID", "Customer", "Product", "Status", "Amount", "Date"]],
      body: orders.map((order) => [
        order.id,
        order.customer,
        order.product,
        order.status,
        `$${order.amount.toLocaleString()}`,
        order.date,
      ]),
    });

    document.save("orders-report.pdf");
  };

  const exportToExcel = () => {
    const worksheetData = orders.map((order) => ({
      "Order ID": order.id,
      Customer: order.customer,
      Product: order.product,
      Status: order.status,
      Amount: order.amount,
      Date: order.date,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    XLSX.writeFile(workbook, "orders-report.xlsx");
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <button
        type="button"
        onClick={exportToPDF}
        className="btn-glass text-rose-600"
      >
        Export PDF
      </button>

      <button
        type="button"
        onClick={exportToExcel}
        className="btn-glass text-emerald-600"
      >
        Export Excel
      </button>
    </div>
  );
}
