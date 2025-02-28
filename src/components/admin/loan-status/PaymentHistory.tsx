"use client";

import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Payment {
  id: string;
  date: string;
  amount: number;
}

interface PaymentHistoryProps {
  payments?: Payment[];
}

export function PaymentHistory({ payments = [] }: PaymentHistoryProps) {
  const { t } = useTranslation();

  return (
    <Card className="dark:border-gray-700 dark:bg-darkbg">
      <CardHeader>
        <CardTitle>{t("paymentHistory.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("paymentHistory.date")}</TableHead>
              <TableHead className="text-right">{t("paymentHistory.amount")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(payment.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4">
                  {t("paymentHistory.noPayments")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
