"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTranslation } from "react-i18next";


interface Payment {
  id: string
  date: string
  amount: number
}

interface FuturePaymentsProps {
  payments?: Payment[]
}

export function FuturePayments({ payments = [] }: FuturePaymentsProps) {
  const { t } = useTranslation()

  return (
    <Card className="dark:border-gray-700 dark:bg-darkbg">
      <CardHeader>
        <CardTitle>{t("futurePayments.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("futurePayments.date")}</TableHead>
              <TableHead className="text-right">{t("futurePayments.amount")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.length > 0 ? (
              payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="text-right">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(payment.amount)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="text-center py-4">
                  {t("futurePayments.noPayments")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

