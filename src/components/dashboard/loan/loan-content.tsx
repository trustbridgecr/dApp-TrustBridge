import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, ChevronRight } from 'lucide-react';

interface Loan {
  id: string;
  amount: number;
  term: number;
  status: 'active' | 'pending' | 'completed' | 'defaulted';
  interestRate: number;
  nextPayment?: {
    amount: number;
    dueDate: string;
  };
  totalPaid: number;
  remainingBalance: number;
}

export const LoanContent = () => {
  const [activeLoans, setActiveLoans] = useState<Loan[]>([]);
  const [loanHistory, setLoanHistory] = useState<Loan[]>([]);

  // Aquí irían los efectos para cargar los datos reales
  React.useEffect(() => {
    // Simulación de carga de datos - reemplazar con llamadas API reales
    const fetchLoans = async () => {
      // Llamada API simulada
      const mockActiveLoans: Loan[] = [
        {
          id: '1',
          amount: 5000,
          term: 12,
          status: 'active',
          interestRate: 5.5,
          nextPayment: {
            amount: 450,
            dueDate: '2025-03-01'
          },
          totalPaid: 1350,
          remainingBalance: 3650
        },
      ];
      setActiveLoans(mockActiveLoans);
    };

    fetchLoans();
  }, []);

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Mis Préstamos</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Solicitar Préstamo
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList>
          <TabsTrigger value="active">Préstamos Activos</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeLoans.map((loan) => (
              <Card key={loan.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      ${loan.amount.toLocaleString()}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {loan.term} meses al {loan.interestRate}%
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    loan.status === 'active' ? 'bg-green-500/10 text-green-500' :
                    loan.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-gray-500/10 text-gray-500'
                  }`}>
                    {loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}
                  </span>
                </div>

                {loan.nextPayment && (
                  <div className="mb-4 p-3 bg-secondary rounded-lg">
                    <p className="text-sm font-medium">Próximo Pago</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-lg font-semibold">
                        ${loan.nextPayment.amount}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(loan.nextPayment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pagado</span>
                    <span className="text-sm font-medium">
                      ${loan.totalPaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Restante</span>
                    <span className="text-sm font-medium">
                      ${loan.remainingBalance.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Button variant="ghost" className="w-full mt-4">
                  Ver Detalles
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Similar card structure for historical loans */}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};